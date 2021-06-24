import { Button } from "@chakra-ui/button";
import { Flex, Text } from "@chakra-ui/layout";
import { Box } from "@chakra-ui/react";
import { FunctionComponent, useRef, useState } from "react";
import axios from "./axios";
import ZoomCall from "./zoomCall";

require("dotenv").config();

const App: FunctionComponent = () => {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [meetingId, setMeetingId] = useState("");
    const [meetingPassword, setMeetingPassword] = useState("");
    const [status, setStatus] = useState();

    const zoomCall: any = useRef();

    const joinMeeting = async () => {
        zoomCall.current.startZoomCall(meetingId, meetingPassword);
        console.log("clicked");
    };

    const showMeetingData = (data: any) => {
        console.log("App data:", data);
        setDataLoaded(true);
        setMeetingId(data.meeting_response.id);
        setMeetingPassword(data.meeting_response.password);
        setStatus(data.meeting_response.status);
    };

    const onCreateMeetingClick = async () => {
        console.log("Create Meeting Button Clicked");

        await axios
            .get("/zoom_meeting")
            .then((data) => {
                console.log(data.data);
                showMeetingData(data.data);
            })
            .catch((err) => {
                console.log("Error: ", err);
            });
    };

    return (
        <div className="App">
            <Flex align="center">
                <Flex>
                    <Button
                        isDisabled={dataLoaded}
                        onClick={onCreateMeetingClick}
                    >
                        Generate JWT Token And Create Meeting
                    </Button>
                    <Button disabled={!dataLoaded} onClick={joinMeeting}>
                        Join Meeting
                    </Button>
                </Flex>
                {dataLoaded ? (
                    <>
                        <Flex width="100%" justify="space-around">
                            <Text mr="2">Meeting ID: {meetingId}</Text>
                            <Text mr="2">
                                Meeting Password: {meetingPassword}
                            </Text>
                            {status && (
                                <Text mr="2">Meeting Status: {status}</Text>
                            )}
                        </Flex>
                    </>
                ) : (
                    <Text>Nothing to show here</Text>
                )}
            </Flex>
            <Box className="App-header" maxWidth="2xl" mt="10">
                <ZoomCall ref={zoomCall} />
            </Box>
        </div>
    );
};

export default App;
