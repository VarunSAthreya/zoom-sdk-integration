const express = require("express");
const router = express.Router();
const { meetingSignature, meetingId } = require("../controllers/zoom");

router.get("/zoom_meeting", meetingId);
router.post("/zoom_signature", meetingSignature);

module.exports = router;
