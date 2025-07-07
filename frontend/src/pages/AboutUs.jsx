import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import FlagIcon from "@mui/icons-material/Flag";
import CodeIcon from "@mui/icons-material/Code";
import Footer from "./Footer";

import "../styles/About.css";

export default function About() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <div className="about-page">
      {/* Navbar */}
      <nav className="about-navbar">
        <div className="about-logo" onClick={handleGoHome}>
          ApnaMeet
        </div>
        <Button
          variant="outlined"
          onClick={handleGoBack}
          startIcon={<ArrowBackIosNewIcon />}
          className="go-back-btn"
        >
          Go back
        </Button>
      </nav>

      {/* Main Content */}
      <div className="about-content">
        <InfoOutlinedIcon className="about-icon" />
        <h1 className="about-heading">
          About <span className="gradient-text">ApnaMeet</span>
        </h1>
        <p className="about-subheading">
          Bringing people closer through seamless real-time video communication.
        </p>

        <p className="about-description">
          ApnaMeet is a powerful video conferencing platform designed with
          simplicity and efficiency in mind. Whether you're collaborating with
          teammates, connecting with friends, or conducting interviews, ApnaMeet
          offers secure, high-quality, and real-time communication experiences.
        </p>

        {/* Cards Section */}
        <div className="about-cards-container">
          <Box className="about-card">
            <FlagIcon fontSize="large" />
            <Typography variant="h6" className="about-card-title">
              Our Vision
            </Typography>
            <Typography className="about-card-text">
              To make virtual meetings feel as natural and effective as
              in-person interactions—redefining the future of communication.
            </Typography>
          </Box>

          <Box className="about-card">
            <LightbulbIcon fontSize="large" />
            <Typography variant="h6" className="about-card-title">
              Our Mission
            </Typography>
            <Typography className="about-card-text">
              Empowering individuals and teams with intuitive, scalable, and
              accessible video conferencing tools for every purpose.
            </Typography>
          </Box>

          <Box className="about-card">
            <CodeIcon fontSize="large" />
            <Typography variant="h6" className="about-card-title">
              Technologies Used
            </Typography>
            <Typography className="about-card-text">
              React, Node.js, Express, Socket.IO, WebRTC, MongoDB, Material UI,
              CSS Modules — powering real-time communication at scale.
            </Typography>
          </Box>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
