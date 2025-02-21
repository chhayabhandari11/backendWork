const express = require("express");
const multer = require("multer");
const fs = require("fs");
const User = require("../models/userModel");

const router = express.Router();

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Profile Update Route
router.post("/profile", upload.fields([
  { name: "aadharCard", maxCount: 1 },
  { name: "drivingLicense", maxCount: 1 }
]), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!req.files) {
      return res.status(400).json({ message: "❌ No files uploaded!" });
    }

    let aadharPath = req.files["aadharCard"] ? req.files["aadharCard"][0].path : null;
    let drivingPath = req.files["drivingLicense"] ? req.files["drivingLicense"][0].path : null;

    // ✅ Save User Data in MongoDB
    const user = await User.findOneAndUpdate(
      { email },
      {
        username,
        password,
        aadharCard: aadharPath,
        drivingLicense: drivingPath,
      },
      { upsert: true, new: true }
    );

    res.json({ message: "✅ Profile updated successfully!", user });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "❌ Upload failed!", error });
  }
});

module.exports = router;
