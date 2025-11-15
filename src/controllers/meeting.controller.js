import MeetingRequest from "../models/MeetingRequest.model.js";
import User from "../models/User.model.js";
import { getWebSocketService } from "../services/websocket.service.js";
import emailService from "../services/email.service.js";

/* -----------------------------------------
   CREATE MEETING (Normal meeting object)
------------------------------------------*/
export const createMeeting = async (req, res) => {
  try {
    const meeting = await MeetingRequest.create({
      sender: req.user._id,
      ...req.body,
    });

    res
      .status(201)
      .json({ success: true, data: meeting, message: "Meeting created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -----------------------------------------
   GET MEETINGS (sender or receiver)
------------------------------------------*/
export const getMeetings = async (req, res) => {
  try {
    const meetings = await MeetingRequest.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    }).populate("sender receiver", "name email");

    res.json({ success: true, data: meetings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -----------------------------------------
   UPDATE MEETING STATUS
------------------------------------------*/
export const updateMeeting = async (req, res) => {
  try {
    const meeting = await MeetingRequest.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Not found" });

    if (meeting.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    meeting.status = req.body.status || meeting.status;
    await meeting.save();

    res.json({ success: true, data: meeting });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -----------------------------------------
   SEND MEETING REQUEST
------------------------------------------*/
export const requestMeeting = async (req, res) => {
  try {
    const { toUserId, message, contact } = req.body;

    const targetUser = await User.findById(toUserId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const meetingRequest = await MeetingRequest.create({
      fromUserId: req.userId,
      toUserId,
      message,
      contact,
      status: "pending",
    });

    /* WebSocket notification */
    try {
      const wsService = getWebSocketService();
      wsService.sendToUser(toUserId, {
        type: "meeting_request",
        title: "New Meeting Request",
        message: `${req.user.name} has requested a meeting`,
        meetingId: meetingRequest._id,
      });
    } catch (error) {
      console.error("WebSocket notification failed:", error);
    }

    /* Email notification */
    if (targetUser.email) {
      await emailService.sendMeetingRequest({
        toEmail: targetUser.email,
        fromName: req.user.name,
        message,
        meetingId: meetingRequest._id,
      });
    }

    res.status(201).json({ success: true, data: meetingRequest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -----------------------------------------
   RESPOND TO MEETING REQUEST (accept/decline)
------------------------------------------*/
export const respondToMeetingRequest = async (req, res) => {
  try {
    const { status } = req.body;

    const meetingRequest = await MeetingRequest.findById(req.params.id).populate(
      "fromUserId"
    );

    if (!meetingRequest)
      return res.status(404).json({ message: "Meeting request not found" });

    meetingRequest.status = status;
    await meetingRequest.save();

    /* WebSocket */
    try {
      const wsService = getWebSocketService();
      wsService.sendToUser(meetingRequest.fromUserId._id, {
        type: "meeting_response",
        title: `Meeting Request ${status}`,
        message: `${req.user.name} has ${status} your meeting request`,
        meetingId: meetingRequest._id,
      });
    } catch (error) {
      console.error("WebSocket notification failed:", error);
    }

    /* Email */
    if (meetingRequest.fromUserId.email) {
      await emailService.sendMeetingResponse({
        toEmail: meetingRequest.fromUserId.email,
        fromName: req.user.name,
        status,
        originalMessage: meetingRequest.message,
      });
    }

    res.json({ success: true, data: meetingRequest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
