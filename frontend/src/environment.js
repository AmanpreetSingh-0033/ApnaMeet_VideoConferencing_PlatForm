let IS_PROD = false;

const server = IS_PROD
  ? "https://apnameet-videoconferencing-platform-w7js.onrender.com"
  : "http://localhost:8000";

export default server;
