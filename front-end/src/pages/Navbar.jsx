import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <nav className="navbar">

            {/* Logo */}
            <div
                className="logo"
                onClick={() => navigate("/")}
            >
                Zoomy<span>.</span>
            </div>

            {/* Navigation */}
            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                <a href="#features">
                    Features
                </a>

                <a href="#about">
                    About
                </a>

            </div>

            {/* Login */}
            <button
                className="login-btn"
                onClick={handleLogin}
            >
                Login
            </button>

        </nav>
    );
}

export default Navbar;