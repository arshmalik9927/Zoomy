import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Dashboard.css";
import { createMeeting } from "../utils/api";

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [showJoinMeeting, setShowJoinMeeting] = useState(false);

    const [meetingCode, setMeetingCode] = useState("");

    const [joinError, setJoinError] = useState("");


    // =========================
    // CHECK USER
    // =========================

    useEffect(() => {

        const savedUser =
            localStorage.getItem("user");

        if (!savedUser) {
            navigate("/login");
            return;
        }

        setUser(JSON.parse(savedUser));

    }, [navigate]);


    // =========================
    // CREATE MEETING
    // =========================

    const handleCreateMeeting = async () => {

        try {

            const savedUser =
                localStorage.getItem("user");

            if (!savedUser) {
                navigate("/login");
                return;
            }

            const user =
                JSON.parse(savedUser);

            const data =
                await createMeeting(user.id);

            console.log(
                "Meeting created:",
                data
            );

            navigate(
                `/meeting/${data.meeting.meetingCode}`
            );

        } catch (error) {

            console.error(
                "Create meeting error:",
                error
            );

        }
    };


    // =========================
    // OPEN JOIN MODAL
    // =========================

    const openJoinMeeting = () => {

        setMeetingCode("");

        setJoinError("");

        setShowJoinMeeting(true);

    };


    // =========================
    // JOIN MEETING
    // =========================

    const handleJoinMeeting = (e) => {

        e.preventDefault();

        const code =
            meetingCode.trim();

        if (!code) {

            setJoinError(
                "Please enter meeting code"
            );

            return;
        }

        navigate(
            `/meeting/${code.toUpperCase()}`
        );

    };


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("user");

        navigate("/login");

    };


    if (!user) {
        return null;
    }


    return (

        <div className="dashboard">


            {/* =========================
                DASHBOARD NAVBAR
            ========================= */}

            <header className="dashboard-navbar">

                <div className="dashboard-logo">
                    Zoomy<span>.</span>
                </div>


                <div className="dashboard-user">

                    <span>
                        {user.username}
                    </span>

                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="dashboard-content">


                {/* WELCOME */}

                <div className="welcome-section">

                    <p className="dashboard-small-title">
                        Dashboard
                    </p>

                    <h1>
                        Welcome back, {user.username} 👋
                    </h1>

                    <p>
                        Connect, collaborate and meet
                        with people from anywhere.
                    </p>

                </div>


                {/* =========================
                    MEETING ACTIONS
                ========================= */}

                <div className="meeting-actions">


                    {/* CREATE MEETING */}

                    <div
                        className="meeting-card create-meeting"
                        onClick={handleCreateMeeting}
                    >

                        <div className="meeting-icon">
                            🎥
                        </div>

                        <h2>
                            New Meeting
                        </h2>

                        <p>
                            Start an instant video meeting.
                        </p>

                        <button type="button">
                            Start Meeting
                        </button>

                    </div>


                    {/* JOIN MEETING */}

                    <div
                        className="meeting-card join-meeting"
                        onClick={openJoinMeeting}
                    >

                        <div className="meeting-icon">
                            🔗
                        </div>

                        <h2>
                            Join Meeting
                        </h2>

                        <p>
                            Join a meeting using a meeting code.
                        </p>

                        <button type="button">
                            Join Meeting
                        </button>

                    </div>

                </div>


                {/* =========================
                    RECENT MEETINGS
                ========================= */}

                <section className="recent-meetings">

                    <div className="section-header">

                        <div>

                            <h2>
                                Recent Meetings
                            </h2>

                            <p>
                                Your recent meeting activity
                            </p>

                        </div>

                        <button type="button">
                            View All
                        </button>

                    </div>


                    <div className="empty-meetings">

                        <div>
                            📅
                        </div>

                        <h3>
                            No meetings yet
                        </h3>

                        <p>
                            Your meeting history will appear here.
                        </p>

                    </div>

                </section>


            </main>


            {/* =========================
                JOIN MEETING MODAL
            ========================= */}

            {showJoinMeeting && (

                <div
                    className="join-modal-overlay"
                    onClick={() =>
                        setShowJoinMeeting(false)
                    }
                >

                    <div
                        className="join-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* CLOSE */}

                        <button
                            type="button"
                            className="close-modal"
                            onClick={() =>
                                setShowJoinMeeting(false)
                            }
                        >
                            ×
                        </button>


                        {/* ICON */}

                        <div className="meeting-icon">
                            🔗
                        </div>


                        <h2>
                            Join Meeting
                        </h2>

                        <p>
                            Enter the meeting code
                            to join the meeting.
                        </p>


                        {/* ERROR */}

                        {joinError && (

                            <p className="join-error">
                                {joinError}
                            </p>

                        )}


                        {/* FORM */}

                        <form
                            onSubmit={handleJoinMeeting}
                        >

                            <input
                                type="text"
                                placeholder="Enter meeting code"
                                value={meetingCode}
                                onChange={(e) => {

                                    setMeetingCode(
                                        e.target.value
                                    );

                                    setJoinError("");

                                }}
                                autoFocus
                            />


                            <button
                                type="submit"
                                className="join-submit-btn"
                            >
                                Join Meeting
                            </button>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Dashboard;