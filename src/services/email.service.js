import nodemailer from "nodemailer";

// Transporter (use your real SMTP credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // you MUST set this in .env
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"CuraLink" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

/* -------------------------------------------------
   Send Meeting Request Notification Email
--------------------------------------------------*/
const sendMeetingRequest = async ({ toEmail, fromName, message, meetingId }) => {
  return sendEmail({
    to: toEmail,
    subject: "New Meeting Request",
    html: `
      <h3>You received a new meeting request</h3>
      <p><strong>${fromName}</strong> has requested a meeting.</p>
      <p>Message: ${message}</p>
      <p>Meeting ID: ${meetingId}</p>
    `,
  });
};

/* -------------------------------------------------
   Send Meeting Response Email (accepted / declined)
--------------------------------------------------*/
const sendMeetingResponse = async ({ toEmail, fromName, status, originalMessage }) => {
  return sendEmail({
    to: toEmail,
    subject: `Your Meeting Request Was ${status}`,
    html: `
      <h3>Your meeting request has been ${status}</h3>
      <p>${fromName} has ${status} your meeting request.</p>
      <p><strong>Your original message:</strong> ${originalMessage}</p>
    `,
  });
};

export default {
  sendMeetingRequest,
  sendMeetingResponse,
};
