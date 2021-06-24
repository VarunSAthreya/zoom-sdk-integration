import axios from "axios";
import { Request, Response } from "express";
var jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.meetingId = (req: Request, res: Response) => {
    const token = jwt.sign(
        {
            iss: process.env.ZOOM_API,
            exp: Date.now() + 6000000,
        },
        process.env.ZOOM_API_SECRET,
        { algorithm: "HS256" }
    );

    const meeting_data = {
        topic: "Sample Discussion",
        type: "1",
        duration: "60",
        password: "password",
        agenda: "To discuss various plans meeting",
        settings: {
            host_video: "true",
            participant_video: "true",
            join_before_host: "true",
            mute_upon_entry: "true",
            watermark: "true",
            use_pmi: "false",
            approval_type: "0",
            audio: "both",
            auto_recording: "cloud",
        },
    };

    axios({
        url: `https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/meetings`,
        method: "POST",
        data: JSON.stringify(meeting_data),
        headers: {
            "content-type": "application/json",
            authorization: `Bearer ${process.env.USER_TOKEN}`,
        },
    }).then((response) => {
        res.json({
            zoom_signature: token,
            meeting_response: response.data,
        });
    });
};

exports.meetingSignature = (req: Request, res: Response) => {
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(
        process.env.ZOOM_API +
            req.body.meeting_number +
            timestamp +
            req.body.role
    ).toString("base64");
    const hash = crypto
        .createHmac("sha256", process.env.ZOOM_API_SECRET)
        .update(msg)
        .digest("base64");
    const signature = Buffer.from(
        `${process.env.ZOOM_API}.${req.body.meeting_number}.${timestamp}.${req.body.role}.${hash}`
    ).toString("base64");

    res.json({
        signature: signature,
    });
};
