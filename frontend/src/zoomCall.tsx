import { ZoomMtg } from "@zoomus/websdk";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import axios from "./axios";

const ZoomCall = forwardRef((props, ref) => {
    const [zoomMtg, setZoomMtg] = useState<typeof ZoomMtg>();

    const importZoomSdk = async () => {
        let { ZoomMtg } = await import("@zoomus/websdk");
        setZoomMtg(ZoomMtg);
    };

    useEffect(() => {
        importZoomSdk();
        if (zoomMtg) {
            zoomMtg.setZoomJSLib("https://source.zoom.us/1.9.6/lib", "/av");
            // zoomMtg.setZoomJSLib("node_modules/@zoomus/websdk/dist/lib", "/av");
            zoomMtg.preLoadWasm();
            zoomMtg.prepareJssdk();
        }
    }, [zoomMtg, importZoomSdk]);

    useImperativeHandle(ref, () => ({
        startZoomCall(meeting_number_temp: string, password: string) {
            var body = {
                meeting_number: meeting_number_temp,
                role: "1",
            };
            console.log("Starting/Joining zoom call: ", meeting_number_temp);
            axios
                .post("/zoom_signature", JSON.stringify(body), {
                    headers: { "Content-Type": "application/json" },
                })
                .then(({ data }) => {
                    console.log(data.signature);
                    zoomMtg?.init({
                        disableRecord: false,
                        videoDrag: true,
                        sharingMode: "both",
                        leaveUrl: "http://localhost:3000/",
                        success: () => {
                            console.log("Success");
                            zoomMtg.join({
                                meetingNumber: meeting_number_temp.toString(),
                                userName: "Zoom Meeting",
                                signature: data.signature,
                                apiKey: process.env.REACT_APP_ZOOM_API!,
                                passWord: password,
                                userEmail: process.env.REACT_APP_ZOOM_EMAIL,
                                success: (res: Error) => {
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
