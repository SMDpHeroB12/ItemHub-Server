const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "ItemHub server is running" });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
