import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  createMeeting,
  getMeetings,
  updateMeeting,
  requestMeeting,
  respondToMeetingRequest,
} from "../controllers/meeting.controller.js";

const router = express.Router();

// Basic CRUD meetings
router.post("/", authenticate, createMeeting);
router.get("/", authenticate, getMeetings);
router.put("/:id", authenticate, updateMeeting);

// Meeting "request" workflow
router.post("/request", authenticate, requestMeeting);
router.put("/requests/:id", authenticate, respondToMeetingRequest);

export default router;
