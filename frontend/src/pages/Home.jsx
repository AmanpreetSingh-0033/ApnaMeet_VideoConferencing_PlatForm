import React, { useEffect, useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, TextField } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { AuthContext } from "../contexts/AuthContext";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Footer from "./Footer";
import "../styles/Home.css";
import InputAdornment from "@mui/material/InputAdornment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";

function HomeComponent() {
  let navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
  });

  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    if (!meetingCode.trim()) return;
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleJoinVideoCall();
    }
  };

  const handleGoBack = () => {
    localStorage.setItem("askForUsername", true);
    navigate(-1);
  };

  return (
    <div className="home-root">
      <nav className="home-navbar">
        <div
          className="home-logo"
          onClick={() => navigate("/home")}
          style={{ marginRight: "0.5rem" }}
        >
          ApnaMeet
        </div>

        <div className="home-nav-right">
          <Button
            onClick={() => navigate("/aboutUs")}
            className="home-nav-btn"
            startIcon={<InfoIcon />}
          >
            About Us
          </Button>

          <Button
            onClick={() => navigate("/history")}
            className="home-history-btn"
            startIcon={<RestoreIcon className="home-history-icon" />}
          >
            History
          </Button>

          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
            className="home-nav-btn"
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>

          <Button
            variant="outlined"
            onClick={handleGoBack}
            startIcon={<ArrowBackIosNewIcon />}
            className="  goBackBtn"
            sx={{
              background: "rgba(255,255,255,0.85)",
              color: "#7f53ac",
              border: "2px solid #7f53ac",
              fontWeight: 700,
              fontSize: "1.05rem",
              borderRadius: "18px",
              boxShadow: "0 2px 8px #7f53ac22",
              textTransform: "none",
              transition: "all 0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, #647dee 0%, #7f53ac 100%)",
                color: "#fff",
                border: "2px solid #647dee",
                boxShadow: "0 4px 16px #647dee55",
              },
            }}
            style={{ position: "static", zIndex: "0" }}
          >
            Go back
          </Button>
        </div>
      </nav>

      <main className="home-main-content">
        <section className="home-left-section">
          <h1 className="home-title">
            Providing Quality Video Call Just Like Quality Education
          </h1>

          <div className="home-input-row">
            <TextField
              onChange={(e) => setMeetingCode(e.target.value)}
              onKeyPress={handleKeyPress}
              value={meetingCode}
              id="meeting-code-input"
              label="Meeting Code"
              variant="outlined"
              className="home-meeting-input"
              placeholder="Enter room code..."
              InputProps={{
                endAdornment: meetingCode.trim() && (
                  <InputAdornment position="end">
                    {/* Copy Icon */}
                    <IconButton
                      className="p-1"
                      aria-label="copy meeting code"
                      onClick={() => {
                        navigator.clipboard.writeText(meetingCode);
                      }}
                      edge="end"
                      sx={{
                        padding: "6px",
                        color: "#7f53ac",
                        "&:hover": {
                          backgroundColor: "#f3f3f3",
                        },
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>

                    {/* Share Icon */}
                    <IconButton
                      aria-label="share meeting code"
                      onClick={() => {
                        if (navigator.share) {
                          navigator
                            .share({
                              title: "ApnaMeet Invitation",
                              text: `Join my meeting using this code: ${meetingCode}`,
                              url: `${window.location.origin}/${meetingCode}`,
                            })
                            .catch((err) => console.log("Share error:", err));
                        } else {
                          alert("Web Share not supported on this browser.");
                        }
                      }}
                      edge="end"
                      sx={{
                        padding: "6px",
                        color: "#7f53ac",
                        "&:hover": {
                          backgroundColor: "#f3f3f3",
                        },
                      }}
                    >
                      <ShareIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              onClick={handleJoinVideoCall}
              className="home-join-btn"
              startIcon={<VideoCallIcon />}
              disabled={!meetingCode.trim()}
              style={{ color: "lightGrey" }}
            >
              Join
            </Button>
          </div>
        </section>

        <section className="home-right-section">
          <img
            srcSet="/homePageSideImage.jpg"
            alt="Video Conference Illustration"
            className="home-illustration"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default withAuth(HomeComponent);
