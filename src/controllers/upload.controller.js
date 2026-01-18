const axios = require("axios");
const FormData = require("form-data");

async function uploadToImgbb(req, res) {
  try {
    if (!process.env.IMGBB_API_KEY) {
      return res.status(500).json({ message: "IMGBB_API_KEY is missing" });
    }

    // multer puts file
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const form = new FormData();
    form.append("image", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const url = `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`;

    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });

    const data = response?.data?.data;

    return res.json({
      url: data?.url,
      display_url: data?.display_url,
      url_viewer: data?.url_viewer,
      delete_url: data?.delete_url,
    });
  } catch (err) {
    const msg =
      err?.response?.data?.error?.message || err?.message || "Upload failed";
    return res.status(500).json({ message: msg });
  }
}

module.exports = { uploadToImgbb };
