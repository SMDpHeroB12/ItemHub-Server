const { ObjectId } = require("mongodb");
const { connectDB } = require("../config/db");

// Get all items
async function getItems(req, res) {
  try {
    const db = await connectDB();

    // ✅ Sort by createdAt for consistency (works even if _id is string)
    const items = await db
      .collection("items")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json(items);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch items", error: err.message });
  }
}

// Get a single item by ID (supports ObjectId OR string _id)
async function getItemById(req, res) {
  try {
    const { id } = req.params;

    const db = await connectDB();

    let item = null;

    // ✅ If id is valid ObjectId, try ObjectId lookup
    if (ObjectId.isValid(id)) {
      item = await db.collection("items").findOne({ _id: new ObjectId(id) });
    }

    // ✅ If not found (or not ObjectId), try string lookup
    if (!item) {
      item = await db.collection("items").findOne({ _id: id });
    }

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

// Create a new item (now supports extra fields)
async function createItem(req, res) {
  try {
    const {
      name,
      description,
      price,
      image,
      images,
      category,
      subCategory,
      tags,
    } = req.body || {};

    // ✅ Required fields
    if (!name || !description || price === undefined || !image) {
      return res.status(400).json({
        message: "name, description, price, and image are required",
      });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "price must be a valid number" });
    }

    // ✅ Normalize optional fields (simple, no over-engineering)
    const safeImages = Array.isArray(images)
      ? images.map((u) => String(u).trim()).filter(Boolean)
      : [];

    const safeTags = Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter(Boolean)
      : [];

    const newItem = {
      name: String(name).trim(),
      description: String(description).trim(),
      price: numericPrice,
      image: String(image).trim(), // main thumbnail
      images: safeImages, // optional gallery
      category: category ? String(category).trim() : "",
      subCategory: subCategory ? String(subCategory).trim() : "",
      tags: safeTags,
      createdAt: new Date(),
    };

    const db = await connectDB();
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

// Get the count of items
async function getItemsCount(req, res) {
  try {
    const db = await connectDB();
    const count = await db.collection("items").countDocuments();
    return res.json({ count });
  } catch (err) {
    return res.status(500).json({ message: "Failed to get items count" });
  }
}

module.exports = { getItems, getItemById, createItem, getItemsCount };
