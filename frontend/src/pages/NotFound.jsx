// NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import Footer from "./Footer";
import "../styles/NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="notfound-root">
      <nav className="notfound-navbar">
        <div className="notfound-logo" onClick={handleGoHome}>
          ApnaMeet
        </div>
        <button className="notfound-back-btn" onClick={handleGoBack}>
          Go Back
        </button>
      </nav>

      <div className="notfound-container">
        <h1 className="notfound-title">404 - Page Not Found</h1>
        <p className="notfound-message">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button className="notfound-home-btn" onClick={handleGoHome}>
          Go to Home
        </button>
      </div>

      <Footer />
    </div>
  );
}
