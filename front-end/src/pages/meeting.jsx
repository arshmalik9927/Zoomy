import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "../style/Meeting.css";

const SOCKET_URL = "http://localhost:8080";

function Meeting() {

    const { meetingCode } = useParams();
    const navigate = useNavigate();

    const socketRef = useRef(null);
    const streamRef = useRef(null);
    const peersRef = useRef({});

    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [remoteStreams, setRemoteStreams] = useState({});

    const [showChat, setShowChat] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const [showParticipants, setShowParticipants] = useState(false);
    const [participants, setParticipants] = useState([]);







    const localVideoRef = useRef(null);
    const chatMessagesRef = useRef(null);

    const sendMessage = (e) => {

        e.preventDefault();

        const text = message.trim();

        if (!text) return;

        const socket = socketRef.current;





        if (!socket || !socket.connected) {

            console.log(
                "❌ Socket not connected"
            );

            return;
        }

        const savedUser =
            localStorage.getItem("user");

        let username = "You";

        if (savedUser) {

            const user =
                JSON.parse(savedUser);

            username = user.username;

        }

        socket.emit(
            "chat-message",
            text,
            username
        );



        setMessage("");

    };
    useEffect(() => {

        if (chatMessagesRef.current) {

            chatMessagesRef.current.scrollTop =
                chatMessagesRef.current.scrollHeight;

        }

    }, [messages]);

    useEffect(() => {

        let mounted = true;
        let socket;

        const startMeeting = async () => {

            try {

                // =========================
                // CAMERA + MICROPHONE
                // =========================

                const stream =
                    await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true
                    });

                if (!mounted) {

                    stream
                        .getTracks()
                        .forEach(track => track.stop());

                    return;
                }

                streamRef.current = stream;

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // =========================
                // CONNECT SOCKET.IO
                // =========================

                socket = io(SOCKET_URL);

                socketRef.current = socket;


                // =========================
                // SOCKET CONNECT
                // =========================

                socket.on("connect", () => {

                    console.log(
                        "✅ Socket connected:",
                        socket.id
                    );

                    if (!mounted) return;


                    // Get logged-in user
                    const savedUser =
                        localStorage.getItem("user");

                    let username = "Guest";

                    if (savedUser) {

                        const user =
                            JSON.parse(savedUser);

                        username = user.username;
                    }


                    // Join meeting with username
                    socket.emit(
                        "join-call",
                        meetingCode,
                        username
                    );

                });


                // =========================
                // CHAT MESSAGE RECEIVER
                // =========================

                socket.on(
                    "chat-message",
                    (
                        data,
                        sender,
                        socketIdSender
                    ) => {



                        setMessages(previous => [

                            ...previous,

                            {
                                message: data,
                                sender: sender,
                                socketId: socketIdSender
                            }

                        ]);

                    }
                );


                // =========================
                // USER JOINED
                // =========================

                socket.on(
                    "user-joined",
                    async (userId, users, userNames) => {

                        console.log("👤 USER JOINED:", userId);
                        console.log("👥 USERS:", users);
                        console.log("🧑 USERNAMES:", userNames);

                        if (!mounted) return;

                        setParticipants(
                            users.map((id) => ({
                                id: id,
                                username: userNames?.[id] || "Guest"
                            }))
                        );

                        if (
                            userId !== socket.id &&
                            !peersRef.current[userId]
                        ) {
                            await createOffer(userId);
                        }

                    }
                );


                // =========================
                // WEBRTC SIGNAL
                // =========================

                socket.on(
                    "signal",
                    async (fromId, message) => {

                        if (!mounted) return;

                        await handleSignal(
                            fromId,
                            message
                        );

                    }
                );


                // =========================
                // USER LEFT
                // =========================

                socket.on(
                    "user-left",
                    (userId) => {

                        console.log(
                            "👋 User left:",
                            userId
                        );

                        if (
                            peersRef.current[userId]
                        ) {

                            peersRef.current[userId]
                                .close();

                            delete peersRef.current[userId];

                        }


                        setRemoteStreams(
                            previous => {

                                const updated = {
                                    ...previous
                                };

                                delete updated[userId];

                                return updated;

                            }
                        );

                    }
                );


            } catch (error) {

                console.error(
                    "Meeting error:",
                    error
                );

            }

        };


        // Start meeting
        startMeeting();


        // =========================
        // CLEANUP
        // =========================

        return () => {

            mounted = false;


            // Stop camera + microphone
            if (streamRef.current) {

                streamRef.current
                    .getTracks()
                    .forEach(track => track.stop());

                streamRef.current = null;

            }


            // Close WebRTC peers
            Object.values(peersRef.current)
                .forEach(peer => {

                    peer.close();

                });

            peersRef.current = {};


            // Disconnect Socket.IO
            if (socket) {

                socket.disconnect();

                socket = null;

            }

            socketRef.current = null;

        };

    }, [meetingCode]);


    // =========================
    // CREATE PEER
    // =========================

    const createPeer = (userId) => {

        if (peersRef.current[userId]) {

            return peersRef.current[userId];

        }


        const peer =
            new RTCPeerConnection({
                iceServers: [
                    {
                        urls: "stun:stun.l.google.com:19302"
                    }
                ]
            });


        peersRef.current[userId] = peer;


        // Add local tracks
        if (streamRef.current) {

            streamRef.current
                .getTracks()
                .forEach(track => {

                    peer.addTrack(
                        track,
                        streamRef.current
                    );

                });

        }


        // Remote stream
        peer.ontrack = (event) => {

            const remoteStream =
                event.streams[0];

            setRemoteStreams(
                previous => ({
                    ...previous,
                    [userId]: remoteStream
                })
            );

        };


        // ICE candidates
        peer.onicecandidate = (event) => {

            if (event.candidate) {

                socketRef.current.emit(
                    "signal",
                    userId,
                    {
                        type: "ice-candidate",
                        candidate: event.candidate
                    }
                );

            }

        };


        return peer;

    };


    // =========================
    // CREATE OFFER
    // =========================

    const createOffer = async (userId) => {

        try {

            const peer =
                createPeer(userId);

            const offer =
                await peer.createOffer();

            await peer.setLocalDescription(
                offer
            );

            socketRef.current.emit(
                "signal",
                userId,
                {
                    type: "offer",
                    offer
                }
            );

        } catch (error) {

            console.error(
                "Offer error:",
                error
            );

        }

    };


    // =========================
    // HANDLE SIGNAL
    // =========================

    const handleSignal = async (
        fromId,
        message
    ) => {

        try {

            const peer =
                createPeer(fromId);


            if (message.type === "offer") {

                await peer.setRemoteDescription(
                    new RTCSessionDescription(
                        message.offer
                    )
                );

                const answer =
                    await peer.createAnswer();

                await peer.setLocalDescription(
                    answer
                );

                socketRef.current.emit(
                    "signal",
                    fromId,
                    {
                        type: "answer",
                        answer
                    }
                );

            }


            else if (
                message.type === "answer"
            ) {

                await peer.setRemoteDescription(
                    new RTCSessionDescription(
                        message.answer
                    )
                );

            }


            else if (
                message.type === "ice-candidate"
            ) {

                if (message.candidate) {

                    await peer.addIceCandidate(
                        new RTCIceCandidate(
                            message.candidate
                        )
                    );

                }

            }

        } catch (error) {

            console.error(
                "Signal error:",
                error
            );

        }

    };


    // =========================
    // MICROPHONE
    // =========================

    const toggleMic = () => {

        if (!streamRef.current) return;

        const track =
            streamRef.current
                .getAudioTracks()[0];

        if (!track) return;

        track.enabled =
            !track.enabled;

        setMicOn(track.enabled);

    };


    // =========================
    // CAMERA
    // =========================

    const toggleCamera = () => {

        if (!streamRef.current) return;

        const track =
            streamRef.current
                .getVideoTracks()[0];

        if (!track) return;

        track.enabled =
            !track.enabled;

        setCameraOn(track.enabled);

    };


    // =========================
    // LEAVE
    // =========================

    const leaveMeeting = () => {

        // Stop camera + microphone
        if (streamRef.current) {

            streamRef.current
                .getTracks()
                .forEach(track => track.stop());

            streamRef.current = null;
        }


        // Disconnect socket
        if (socketRef.current) {

            socketRef.current.disconnect();

            socketRef.current = null;
        }


        // Close WebRTC connections
        Object.values(peersRef.current)
            .forEach(peer => peer.close());

        peersRef.current = {};


        // Clear participants
        setParticipants([]);


        // Close panels
        setShowChat(false);
        setShowParticipants(false);


        // Back to dashboard
        navigate("/dashboard");
    };


    return (

        <div className="meeting-page">

            {/* HEADER */}

            <header className="meeting-header">

                <div className="meeting-logo">
                    Zoomy<span>.</span>
                </div>

                <div className="meeting-info">

                    <span>
                        Meeting
                    </span>

                    <strong>
                        {meetingCode}
                    </strong>

                </div>

            </header>


            {/* VIDEO AREA */}

            <main className="meeting-main">

                {/* =========================
        VIDEO SECTION
    ========================= */}

                <div className="video-section">

                    {/* Local Video */}

                    <div className="local-video-wrapper">

                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="local-video"
                        />

                        {!cameraOn && (
                            <div className="camera-off">

                                📷

                                <span>
                                    Camera Off
                                </span>

                            </div>
                        )}

                        <div className="video-name">
                            You
                        </div>

                    </div>


                    {/* =========================
            REMOTE VIDEOS
        ========================= */}

                    {Object.entries(remoteStreams).map(
                        ([userId, stream]) => (

                            <RemoteVideo
                                key={userId}
                                stream={stream}
                                userId={userId}
                            />

                        )
                    )}

                </div>


                {/* =========================
        PARTICIPANTS SIDEBAR
    ========================= */}

                <aside className="meeting-sidebar">

                    <div className="sidebar-header">

                        <h2>
                            Participants
                        </h2>

                        <span>
                            {participants.length}
                        </span>

                    </div>


                    <div className="participants-list">

                        {participants.map((participant) => (

                            <div
                                className="participant"
                                key={participant.id}
                            >

                                <div className="participant-avatar">
                                    👤
                                </div>

                                <div>

                                    <strong>
                                        {participant.id === socketRef.current?.id
                                            ? `${participant.username} (You)`
                                            : participant.username
                                        }
                                    </strong>

                                    <p>
                                        🟢 Connected
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </aside>

            </main>
            {showChat && (

                <aside className="chat-panel">

                    {/* Chat Header */}
                    <div className="chat-header">

                        <h2>
                            Chat
                        </h2>

                        <button
                            type="button"
                            onClick={() => setShowChat(false)}
                        >
                            ×
                        </button>

                    </div>


                    {/* Messages */}
                    <div className="chat-messages" ref={chatMessagesRef}>

                        {messages.length === 0 ? (

                            <div className="no-messages">
                                No messages yet
                            </div>

                        ) : (

                            messages.map((item, index) => (

                                <div
                                    key={index}
                                    className={`chat-message ${item.socketId ===
                                        socketRef.current?.id
                                        ? "my-message"
                                        : "other-message"
                                        }`}
                                >

                                    <span className="message-sender">
                                        {item.sender}
                                    </span>

                                    <p>
                                        {item.message}
                                    </p>

                                </div>

                            ))

                        )}

                    </div>


                    {/* Send Message */}
                    <form
                        className="chat-input"
                        onSubmit={sendMessage}
                    >

                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                        />

                        <button type="submit">
                            ➤
                        </button>

                    </form>

                </aside>

            )}
            {showParticipants && (

                <aside className="participants-panel">

                    <div className="participants-header">

                        <h2>
                            Participants
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                setShowParticipants(false)
                            }
                        >
                            ×
                        </button>

                    </div>


                    <div className="participants-list">

                        {participants.map((userId, index) => (

                            <div
                                className="participant-item"
                                key={userId}
                            >

                                <div className="participant-avatar">
                                    👤
                                </div>

                                <div>
                                    <strong>
                                        {userId === socketRef.current?.id
                                            ? "You"
                                            : `Participant ${index + 1}`
                                        }
                                    </strong>

                                    <p>
                                        Connected
                                    </p>
                                </div>

                            </div>

                        ))}

                    </div>

                </aside>

            )}

            {/* CONTROLS */}

            <footer className="meeting-controls-bar">

                <button
                    className={`control-btn ${!micOn ? "off" : ""
                        }`}
                    onClick={toggleMic}
                >
                    {micOn ? "🎤" : "🔇"}
                </button>




                <button
                    className={`control-btn ${!cameraOn ? "off" : ""
                        }`}
                    onClick={toggleCamera}
                >
                    {cameraOn ? "📹" : "🚫"}
                </button>


                <button
                    type="button"
                    className="control-btn"
                    onClick={() => {

                        setShowChat(true);
                    }}
                >
                    💬
                </button>


                <button
                    type="button"
                    className={`control-btn ${showParticipants ? "active" : ""
                        }`}
                    onClick={() =>
                        setShowParticipants(!showParticipants)
                    }
                >
                    👥
                </button>


                <button
                    className="leave-btn"
                    onClick={leaveMeeting}
                >
                    ☎

                    <span>
                        Leave
                    </span>

                </button>

            </footer>

        </div>
    );
}


// =========================
// REMOTE VIDEO COMPONENT
// =========================

function RemoteVideo({
    stream,
    userId
}) {

    const videoRef = useRef(null);

    useEffect(() => {

        if (videoRef.current) {

            videoRef.current.srcObject =
                stream;

        }

    }, [stream]);


    return (

        <div className="remote-video-wrapper">

            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="remote-video"
            />

            <div className="video-name">
                Participant
            </div>

        </div>

    );

}

export default Meeting;