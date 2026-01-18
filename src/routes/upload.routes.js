const router = require("express").Router();
const multer = require("multer");
const { uploadToImgbb } = require("../controllers/upload.controller");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 32 * 1024 * 1024 },
});

router.post("/imgbb", upload.single("image"), uploadToImgbb);

module.exports = router;
