const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

// Serve only public website files; keep server code and configuration private.
app.use("/images", express.static(path.join(__dirname, "images")));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// Start HTTP independently so the static site remains available when MongoDB is offline.
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((error) => console.error(`MongoDB connection failed: ${error.message}`));
} else {
  console.warn("MONGODB_URI is not configured; running without database access.");
}

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Thread & Bloom backend is working!"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    server: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "unavailable"
  });
});
