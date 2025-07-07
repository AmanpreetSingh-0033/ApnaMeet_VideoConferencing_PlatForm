import React from "react";
import "../styles/Footer.css";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-center">
        <div className="footer-logo">
          <span
            style={{
              background: "linear-gradient(90deg, #7f53ac 40%, #647dee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
              fontWeight: 900,
              letterSpacing: "1px",
              display: "inline-block"
            }}
          >
            ApnaMeet
          </span>
        </div>
        <div className="footer-text">
          © 2025 ApnaMeet. All rights reserved.
        </div>
        <div className="footer-links-row">
          <a href="#" className="footer-link">Privacy</a>
          <span className="footer-dot">·</span>
          <a href="#" className="footer-link">Terms</a>
          <span className="footer-dot">·</span>
          <a href="#" className="footer-link">Contact</a>
        </div>
        <div className="footer-social">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <InstagramIcon fontSize="medium" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <FacebookIcon fontSize="medium" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <TwitterIcon fontSize="medium" />
          </a>
        </div>
      </div>
    </footer>
  );
}