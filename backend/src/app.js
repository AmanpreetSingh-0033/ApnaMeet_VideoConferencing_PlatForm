import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";

import userRoutes from "./routes/userRoutes.js";
import { connectToSocket } from "./controllers/socketManager.js";

import dotenv from "dotenv";
dotenv.config(); // if .env is in backend/src/

const app = express();

// Set port to environment value or fallback to 8000
app.set("port", process.env.PORT || 8000);

// Create an HTTP server and attach to Express
const server = createServer(app);

// Setup Socket.IO with custom socketManager handler
const io = connectToSocket(server);

// Enable CORS (Cross-Origin Requests)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local frontend development
      "https://apnameet-videoconferencing-platform-w7js.onrender.com", // ✅ your deployed frontend
    ],
    // credentials: true, // keep it only if using cookies (optional for JWT)
  })
);

// Middleware to parse incoming JSON and form data
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

// Mount all user-related routes
app.use("/apnaMeet/api/v1/users", userRoutes);

// Root route (basic health check)
// app.get("/", (req, res) => {
//   res.send("This is root page");
// });

// Start the server and connect to MongoDB
const start = async () => {
  // Hardcoded MongoDB connection URL (used directly without .env)
  const dbUrl = process.env.MONGODB_URI;

  try {
    // Connect to MongoDB
    const mongodb = await mongoose.connect(dbUrl);
    console.log(" Connected to MongoDB:", mongodb.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }

  // Start the server after DB connection
  server.listen(app.get("port"), "0.0.0.0", () => {
    console.log(`Server running at port: ${app.get("port")}`);
  });
};

// Execute the start function
start().catch((err) => {
  console.error(" Error starting the server:", err.message);
});
