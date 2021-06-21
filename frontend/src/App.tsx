import { Button } from "@chakra-ui/button";
import { Flex, Text } from "@chakra-ui/layout";
import { Container } from "@chakra-ui/react";
import { FunctionComponent, useRef, useState } from "react";
import "./App.css";
import axios from "./axios";
import ZoomCall from "./zoomCall";

const App: FunctionComponent = () => {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [meetingId, setMeetingId] = useState("");
    const [meetingPassword, setMeetingPassword] = useState("");
    // const [startUrl, setStartUrl] = useState('');
    const [status, setStatus] = useState();

    const zoomCall: any = useRef();

    const joinMeeting = async () => {
        zoomCall.current.startZoomCall(meetingId, meetingPassword);
        console.log("clicked");
    };

    const showMeetingData = (data: any) => {
        console.log("App data:", data);
        setDataLoaded(true);
        setMeetingId(data.ZoomMeetingResponse.id);
        setMeetingPassword(data.ZoomMeetingResponse.password);
        // setStartUrl(data.meeting_response.start_url);
        setStatus(data.ZoomMeetingResponse.status);
    };

    const onCreateMeetingClick = async () => {
        console.log("Create Meeting Button Clicked");

        await axios
            .get("/zoomcallToken")
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

                    {/* Display the Data of the meeting generated via Zoom API call */}
                </Flex>
                {dataLoaded ? (
                    <>
                        {/* <Text>Meeting Data After API call:</Text> */}
                        <Flex width="100%" justify="space-around">
                            <Text mr="2">Meeting ID: {meetingId}</Text>
                            <Text mr="2">
                                Meeting Password: {meetingPassword}
                            </Text>
                            {/* <Text>Join URL: {this.state.start_url}</Text> */}
                            {status && (
                                <Text mr="2">Meeting Status: {status}</Text>
                            )}
                        </Flex>
                    </>
                ) : (
                    <Text>Nothing to show here</Text>
                )}
            </Flex>
            <Container as="header" className="App-header">
                <ZoomCall ref={zoomCall} />
            </Container>
        </div>
    );
};

export default App;
