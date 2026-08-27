import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/JoinMeeting.css";

function JoinMeeting() {

    const navigate = useNavigate();

    const [meetingCode, setMeetingCode] = useState("");
    const [error, setError] = useState("");


    const handleJoinMeeting = (e) => {

        e.preventDefault();

        setError("");

        const code = meetingCode.trim();

        if (!code) {
            setError("Please enter a meeting code");
            return;
        }

        navigate(`/meeting/${code.toUpperCase()}`);
    };


    return (

        <div className="join-page">

            <div className="join-card">

                <div className="join-icon">
                    🔗
                </div>

                <h1>
                    Join Meeting
                </h1>

                <p>
                    Enter the meeting code shared with you
                    to join the meeting.
                </p>


                {error && (
                    <div className="join-error">
                        {error}
                    </div>
                )}


                <form onSubmit={handleJoinMeeting}>

                    <label>
                        Meeting Code
                    </label>

                    <input
                        type="text"
                        placeholder="Enter meeting code"
                        value={meetingCode}
                        onChange={(e) =>
                            setMeetingCode(e.target.value)
                        }
                    />

                    <button type="submit">
                        Join Meeting
                    </button>

                </form>


                <button
                    className="back-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>

            </div>

        </div>
    );
}

export default JoinMeeting;