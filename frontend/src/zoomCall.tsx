import { ZoomMtg } from "@zoomus/websdk";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import axios from "./axios";

const ZoomCall = forwardRef((props, ref) => {
    useEffect(() => {
        if (ZoomMtg) {
            ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.5/lib", "/av");
            ZoomMtg.preLoadWasm();
            ZoomMtg.prepareJssdk();
        }
    }, [ZoomMtg]);

    useImperativeHandle(ref, () => ({
        startZoomCall(meeting_number_temp: string, password: string) {
            var body = {
                meeting_number: meeting_number_temp,
                role: "1",
            };
            console.log("Starting/Joining zoom call: ", meeting_number_temp);
            axios
                .post("/zoom/signature", JSON.stringify(body), {
                    headers: { "Content-Type": "application/json" },
                })
                .then(({ data }) => {
                    console.log(data);
                    ZoomMtg.init({
                        disableRecord: false,
                        videoDrag: true,
                        sharingMode: "both",
                        leaveUrl: "https://tremendo.in/",
                        success: () => {
                            console.log("Success");
                            ZoomMtg.join({
                                meetingNumber: meeting_number_temp,
                                userName: "Test NextJS",
                                signature: data.signature,
                                apiKey: process.env.NEXT_PUBLIC_ZOOM_API,
                                passWord: password,
                                userEmail: "shubham.singh@tremendo.in",
                                success: (res: Error) => {
                                    // $('#nav-tool').hide();
                                    console.log("join meeting success:", res);
                                },
                                error: (res: Error) => {
                                    console.log("Error point 1:", res);
                                },
                            });
                        },
                        error: (res: Error) => {
                            console.log("Error point 2:", res);
                        },
                    });
                })
                .catch((err) => {
                    console.log("Error: ", err);
                });
        },
    }));

    return (
        <div
            style={{ width: "100%", height: "100vh", position: "relative" }}
            id="zmmtg-root"
        ></div>
    );
});
export default ZoomCall;
