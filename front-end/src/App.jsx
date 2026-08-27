import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import Navbar from "./pages/Navbar";
import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Meeting from "./pages/Meeting";
import JoinMeeting from "./pages/JoinMeeting";

import "./App.css";


function AppContent() {

    const location = useLocation();

  const hideNavbar =
    location.pathname === "/dashboard" ||
    (
        location.pathname.startsWith("/meeting/") &&
        location.pathname !== "/meeting/join"
    );

    return (
        <>
            {!hideNavbar && <Navbar />}

            <Routes>

                <Route
                    path="/"
                    element={<Hero />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />
                <Route
                    path="/meeting/join"
                    element={<JoinMeeting />}
                />

                <Route
                    path="/meeting/:meetingCode"
                    element={<Meeting />}
                />

            </Routes>
        </>
    );
}


function App() {

    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}


export default App;