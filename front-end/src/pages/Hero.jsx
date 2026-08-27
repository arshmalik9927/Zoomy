import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate();

    const handleStartMeeting = () => {
        // Later:
        // POST /api/meetings/create
        navigate("/login");
    };

    const handleJoinMeeting = () => {
        navigate("/login");
    };

    return (
        <section className="hero" id="home">

            <div className="hero-content">

                <p className="tagline">
                    The future of virtual meetings
                </p>

                <h1>
                    <span >Connect.</span>
                    <br />
                    <span>Collaborate.</span>
                    <br />
                    <span>Meet Without Limits.</span>
                </h1>

                <p className="hero-description">
                    Experience seamless video meetings with crystal-clear
                    communication. Connect with your team, friends and
                    family from anywhere.
                </p>

                <div className="hero-buttons">

                    <button
                        className="primary-btn"
                        onClick={handleStartMeeting}
                    >
                        Start a Meeting
                    </button>

                    <button
                        className="secondary-btn"
                        onClick={handleJoinMeeting}
                    >
                        Join a Meeting
                    </button>

                </div>

            </div>

            <div className="hero-visual">

                <div className="video-card">

                    <div className="video-header">
                        <span>●</span>
                        Live Meeting
                    </div>

                    <div className="video-grid">

                        <div className="person">
                            <span>👨🏻‍💻</span>
                            <p>Arsh</p>
                        </div>

                        <div className="person">
                            <span>👩🏻‍💻</span>
                            <p>Sarah</p>
                        </div>

                        <div className="person">
                            <span>👨🏻‍💼</span>
                            <p>Alex</p>
                        </div>

                        <div className="person">
                            <span>👩🏻‍💼</span>
                            <p>Emma</p>
                        </div>

                    </div>

                    <div className="meeting-controls">

                        <button type="button">
                            🎤
                        </button>

                        <button type="button">
                            📹
                        </button>

                        <button type="button">
                            💬
                        </button>

                        <button
                            type="button"
                            className="end-call"
                        >
                            ☎
                        </button>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Hero;