const express = require("express");
const { getItems, getItemById } = require("../controllers/item.controller");

const router = express.Router();

router.get("/", getItems);
router.get("/:id", getItemById);

module.exports = router;
