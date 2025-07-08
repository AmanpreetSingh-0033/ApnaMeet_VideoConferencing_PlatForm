let IS_PROD = true;

const server = IS_PROD
  ? "https://apnameet-videoconferencing-platform-w7js.onrender.com"
  : "http://localhost:8000";

export default server;
