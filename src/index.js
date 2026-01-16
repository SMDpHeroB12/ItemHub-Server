const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./config/db");
const itemRoutes = require("./routes/item.routes");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to the ItemHub API");
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    await connectDB();
    res.json({ ok: true, message: "ItemHub server + MongoDB is running " });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Item routes
app.use("/api/items", itemRoutes);

// Seed items endpoint
app.get("/seed-items", async (req, res) => {
  try {
    const db = await connectDB();

    const sampleItems = [
      {
        name: "Dumbbell Set",
        description: "Adjustable dumbbell set for full-body workouts.",
        price: 79.99,
        image: "https://i.ibb.co/3pZQkK3/dumbbell.jpg",
      },
      {
        name: "Yoga Mat",
        description: "Non-slip yoga mat for comfort and stability.",
        price: 19.99,
        image: "https://i.ibb.co/5G2bY0j/yoga-mat.jpg",
      },
      {
        name: "Resistance Bands",
        description: "Set of resistance bands for strength training.",
        price: 14.5,
        image: "https://i.ibb.co/9r6yKq8/bands.jpg",
      },
    ];

    const count = await db.collection("items").countDocuments();
    if (count > 0) {
      return res.json({ message: "Items already exist. Skipping seed." });
    }

    const result = await db.collection("items").insertMany(sampleItems);
    res.json({
      message: "Seeded items successfully",
      insertedCount: result.insertedCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Seeding failed", error: err.message });
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
