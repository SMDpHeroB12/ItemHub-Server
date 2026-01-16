const { ObjectId } = require("mongodb");
const { connectDB } = require("../config/db");

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

module.exports = { getItems, getItemById };
