const express = require("express");
const router = express.Router();
const Media = require("../models/Media");
const auth = require("../middleware/auth");
const upload = require("../config/multer");

router.post("/", auth, upload.single("photo"), async (req, res) => {
  console.log("DEBUG req.file =", req.file);
  console.log("DEBUG req.body =", req.body);

  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Photo file is missing" });
    }

    const mediaItem = new Media({
      user: req.user.id,
      imageUrl: req.file.path,
      caption: req.body.caption,
      location: req.body.location,
      isPublic: req.body.isPublic === "true",
    });

    const saved = await mediaItem.save();
    res.json(saved);
  } catch (err) {
    console.error("UPLOAD ERROR FULL:", err);
    res
      .status(500)
      .json({ msg: "Server error saving media", error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const media = await Media.find({ user: req.user.id }).sort({ date: -1 });
    res.json(media);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) return res.status(404).json({ message: "Media not found" });

    if (media.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not allowed" });

    res.json(media);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err.message,
    });
  }
});

router.put("/:id", auth, upload.single("photo"), async (req, res) => {
  try {
    const { caption, location, isPublic } = req.body;

    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    if (media.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not allowed" });

    if (caption) media.caption = caption;
    if (location) media.location = location;
    media.isPublic = isPublic === "true";

    if (req.file) media.imageUrl = req.file.path;

    await media.save();
    res.json(media);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err.message,
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) return res.status(404).json({ message: "Media not found" });

    if (media.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not allowed" });

    await media.deleteOne();
    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err.message,
    });
  }
});

module.exports = router;
