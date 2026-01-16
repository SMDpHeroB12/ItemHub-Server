const express = require("express");
const {
  getItems,
  getItemById,
  createItem,
} = require("../controllers/item.controller");

const router = express.Router();

router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", createItem);

module.exports = router;
