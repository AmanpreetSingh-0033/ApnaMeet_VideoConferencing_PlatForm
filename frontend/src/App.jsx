import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import Auth from "./pages/Auth.jsx";
import HomeComponent from "./pages/Home.jsx";
import VideoMeetComponent from "./pages/VideoMeet.jsx";
import History from "./pages/History.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<HomeComponent />} />
            <Route path="/history" element={<History />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/verifyOtp" element={<VerifyOtp />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/:url" element={<VideoMeetComponent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
