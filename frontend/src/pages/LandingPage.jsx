import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
import mobileImg from "../assets/mobile.png";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Footer from "./Footer";

import { v4 as uuidv4 } from "uuid";

export default function LandingPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [randomMeetingCode, setRandomMeetingCode] = useState();

  useEffect(() => {
    const code = uuidv4().replace(/-/g, "");
    setRandomMeetingCode(code);
    console.log("random meeting code is : ", code);
  }, []);

  return (
    <>
      <div className="landing-page">
        <nav className="navbar">
          <div className="logo">ApnaMeet</div>
          <button
            className="nav-toggle"
            onClick={() => setNavOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <MenuIcon fontSize="large" />
          </button>
          <div className={`nav-links${navOpen ? " open" : ""}`}>
            <Link to={`/${randomMeetingCode}`} className="nav-btn">
              Join as Guest
            </Link>
            <Link to="/auth" className="nav-btn">
              <PersonAddAltIcon style={{ marginRight: 6, fontSize: 20 }} />
              Register
            </Link>
            <Link to="/auth" className="nav-btn">
              <LoginIcon style={{ marginRight: 6, fontSize: 20 }} />
              Login
            </Link>
          </div>
        </nav>
        <main className="main-content">
          <section className="left-section">
            <h1 className="animated-title">
              Welcome to{" "}
              <span
                id="apnameet"
                className="gradient-animate"
                style={{
                  background:
                    "linear-gradient(90deg, #7f53ac 40%, #647dee 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  filter: "drop-shadow(0 2px 8px #7f53ac33)",
                  display: "inline-block",
                  fontSize: "4.5rem",
                  lineHeight: "1.1",
                }}
              >
                ApnaMeet
              </span>
            </h1>
            <p>
              Professional, secure, and seamless video communication for
              everyone.
            </p>
            <Link to="/auth" className="cta-btn">
              <LoginIcon style={{ marginRight: 8, fontSize: 22 }} />
              Get Started
            </Link>
          </section>
          <section className="right-section">
            <img src={mobileImg} alt="Mobile Preview" className="mobile-img" />
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
