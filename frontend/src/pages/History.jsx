import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Footer from "./Footer";
import "../styles/History.css";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch {
        // Snackbar logic can be implemented here
      }
    };

    fetchHistory();
  }, []);

  const handleGoBack = () => {
    localStorage.setItem("askForUsername", true);
    routeTo(-1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="history-root">
      <Container maxWidth="md" className="history-container">
        <div className="history-header">
          <div
            className="history-brand"
            onClick={() => routeTo("/home")}
          >
            Apna<span>Meet</span>
          </div>
          <Button
            variant="outlined"
            onClick={handleGoBack}
            startIcon={<ArrowBackIosNewIcon />}
            className="history-back-btn"
          >
            Go back
          </Button>
        </div>

        <div className="history-list">
          {meetings.length > 0 ? (
            meetings.map((user, i) => (
              <Card className="history-card" key={i} variant="outlined">
                <CardContent>
                  <Typography
                    className="history-code"
                    gutterBottom
                  >
                    Code: <strong>{user.meetingCode}</strong>
                  </Typography>
                  <Typography className="history-date">
                    Date: {formatDate(user.date)}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography className="history-empty">
              No meeting history available.
            </Typography>
          )}
        </div>
      </Container>

      <Footer />
    </div>
  );
}
