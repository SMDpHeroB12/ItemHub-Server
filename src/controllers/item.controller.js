const { ObjectId } = require("mongodb");
const { connectDB } = require("../config/db");

// Get all items
async function getItems(req, res) {
  try {
    const db = await connectDB();
    const items = await db
      .collection("items")
      .find()
      .sort({ _id: -1 })
      .toArray();
    res.json(items);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch items", error: err.message });
  }
}

// Get a single item by ID
async function getItemById(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item id" });
    }

    const db = await connectDB();
    const item = await db
      .collection("items")
      .findOne({ _id: new ObjectId(id) });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch item", error: err.message });
  }
}

// Additional function to create a new item
async function createItem(req, res) {
  try {
    const { name, description, price, image } = req.body || {};

    // Simple validation (no over-engineering)
    if (!name || !description || price === undefined || !image) {
      return res.status(400).json({
        message: "name, description, price, and image are required",
      });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "price must be a valid number" });
    }

    const db = await connectDB();

    const newItem = {
      name: String(name).trim(),
      description: String(description).trim(),
      price: numericPrice,
      image: String(image).trim(),
      createdAt: new Date(),
    };

    const result = await db.collection("items").insertOne(newItem);

    res.status(201).json({
      message: "Item created successfully",
      insertedId: result.insertedId,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create item", error: err.message });
  }
}

module.exports = { getItems, getItemById, createItem };
