const express = require("express");
const {
  getItems,
  getItemById,
  createItem,
  getItemsCount,
} = require("../controllers/item.controller");

const router = express.Router();

router.get("/count", getItemsCount);
router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", createItem);

module.exports = router;
