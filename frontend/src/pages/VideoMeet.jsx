import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Badge, IconButton, TextField } from "@mui/material";
import { Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
// import styles from "../styles/videoComponent.module.css";
import "../styles/VideoMeet.css";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ChatIcon from "@mui/icons-material/Chat";
import server from "../environment";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
const server_url = server;

var connections = {};
const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  const navigate = useNavigate();

  var socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoref = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState([]);

  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModal, setModal] = useState(true);

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  useEffect(() => {
    console.log("HELLO");
    getPermissions();
  });

  let getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDislayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
        console.log("Video permission granted");
      } else {
        setVideoAvailable(false);
        console.log("Video permission denied");
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
        console.log("Audio permission granted");
      } else {
        setAudioAvailable(false);
        console.log("Audio permission denied");
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoref.current) {
            localVideoref.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
      console.log("SET STATE HAS ", video, audio);
    }
  }, [video, audio]);
  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        console.log(description);
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  let getDislayMediaSuccess = (stream) => {
    console.log("HERE");
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          getUserMedia();
        })
    );
  };

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", {
        path: window.location.href,
        username: username,
      });
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients, usernamesMap) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );
          // Wait for their ice candidate
          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          // Wait for their video stream
          connections[socketListId].onaddstream = (event) => {
            console.log("BEFORE:", videoRef.current);
            console.log("FINDING ID: ", socketListId);

            const usernameOfUser = usernamesMap[socketListId] || "Unknown";

            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );

            if (videoExists) {
              console.log("FOUND EXISTING");

              // Update the stream of the existing video
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              // Create a new video
              console.log("CREATING NEW");
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoplay: true,
                playsinline: true,
                username: usernameOfUser,
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          // Add the local video stream
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }
        });

        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };
  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let handleVideo = () => {
    setVideo(!video);
    // getUserMedia();
  };
  let handleAudio = () => {
    setAudio(!audio);
    // getUserMedia();
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDislayMedia();
    }
  }, [screen]);
  let handleScreen = () => {
    setScreen(!screen);
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    if (localStorage.getItem("token")) {
      window.location.href = "/home";
    } else {
      window.location.href = "/";
    }
  };

  let openChat = () => {
    setModal(true);
    setNewMessages(0);
  };
  let closeChat = () => {
    setModal(false);
  };
  let handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let sendMessage = () => {
    console.log(socketRef.current);
    socketRef.current.emit("chat-message", message, username);
    setMessage("");

    // this.setState({ message: "", sender: username })
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  const handleGoBack = () => {
    localStorage.setItem("askForUsername", true);
    navigate(-1);
  };

  return (
    <div className="videomeet-root">
      {askForUsername ? (
        <div>
          <Button
            variant="outlined"
            onClick={handleGoBack}
            startIcon={<ArrowBackIosNewIcon />}
            className="videomeet-goback-btn"
            sx={{
              background: "rgba(255,255,255,0.85)",
              color: "#7f53ac",
              border: "2px solid #7f53ac",
              fontWeight: 700,
              fontSize: "1.05rem",
              borderRadius: "18px",
              boxShadow: "0 2px 8px #7f53ac22",
              textTransform: "none",
              position: "fixed",
              top: 24,
              right: 32,
              zIndex: 100,
              transition: "all 0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, #647dee 0%, #7f53ac 100%)",
                color: "#fff",
                border: "2px solid #647dee",
                boxShadow: "0 4px 16px #647dee55",
              },
            }}
          >
            Go back
          </Button>
          <div className="videomeet-content-wrapper">
            <div className="videomeet-card">
              <div className="videomeet-title">
                Set username before entering in to lobby{" "}
                <span role="img" aria-label="smile">
                  🙂
                </span>
              </div>
              <form
                className="videomeet-form"
                onSubmit={connect}
                autoComplete="off"
              >
                <TextField
                  id="username"
                  label="Enter username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameError("");
                  }}
                  fullWidth
                  className="videomeet-input"
                  margin="normal"
                  error={!!usernameError}
                  helperText={usernameError}
                />
                <Button
                  className="videomeet-btn"
                  fullWidth
                  type="submit"
                  onClick={connect}
                >
                  Connect
                </Button>
              </form>
              <div className="videomeet-video-box">
                <video
                  ref={localVideoref}
                  autoPlay
                  muted
                  className="videomeet-video"
                />
                {!videoAvailable && (
                  <div className="videomeet-warning">Camera not available</div>
                )}
                {!audioAvailable && (
                  <div className="videomeet-warning">
                    Microphone not available
                  </div>
                )}
                {!screenAvailable && (
                  <div className="videomeet-warning orange">
                    Screen sharing not supported
                  </div>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      ) : (
        <div className="conference-container">
          {/* Chat Modal */}
          {showModal && (
            <div className="chat-modal">
              <div className="chat-header">Chat</div>
              <div className="chat-body">
                {messages.length > 0 ? (
                  messages.map((msg, i) => (
                    <div key={i} className="chat-message">
                      <strong>{msg.sender}:</strong> <span>{msg.data}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "black" }}>No Messages Yet</p>
                )}
              </div>
              <div className="chat-input">
                <TextField
                  fullWidth
                  label="Enter your chat"
                  variant="outlined"
                  value={message}
                  onChange={handleMessage}
                />
                <Button
                  variant="contained"
                  style={{ color: "white", backgroundColor: "#673ab7" }}
                  onClick={sendMessage}
                >
                  Send
                </Button>
              </div>
            </div>
          )}

          {/* Conference Controls */}
          <div className="controls-bar">
            <IconButton onClick={handleVideo} color="inherit">
              {video ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton onClick={handleEndCall} style={{ color: "red" }}>
              <CallEndIcon />
            </IconButton>
            <IconButton onClick={handleAudio} color="inherit">
              {audio ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
            {screenAvailable && (
              <IconButton onClick={handleScreen} color="inherit">
                {screen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
              </IconButton>
            )}
            <Badge badgeContent={newMessages} color="secondary">
              <IconButton
                onClick={() => {
                  setModal(!showModal);
                  setNewMessages(0);
                }}
                color="inherit"
              >
                <ChatIcon />
              </IconButton>
            </Badge>
          </div>

          {/* Local Video */}
          <video
            style={{ zIndex: "10" }}
            ref={localVideoref}
            autoPlay
            muted
            className="local-video"
          ></video>

          <h3 style={{ color: "red", position: "absolute", bottom: "10.7rem" }}>
            <p>{video ? "" : "your Video is OFF ! "}</p>
            <p> {audio ? "" : "your Audio is OFF ! "}</p>
          </h3>

          {/* Remote Videos */}
          <div className="remote-videos-grid">
            {videos.map((video) => (
              <div key={video.socketId} className="remote-video-wrapper">
                <video
                  data-socket={video.socketId}
                  autoPlay
                  playsInline
                  ref={(ref) => {
                    if (ref && video.stream) ref.srcObject = video.stream;
                  }}
                ></video>
                <div className="remote-username-tag">{video.username}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

