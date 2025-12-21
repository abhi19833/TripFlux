const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const TravelLog = require("../models/TravelLog");

router.get("/public", async (req, res) => {
  try {
    const logs = await TravelLog.find({ isPublic: true })
      .populate("userId", "username")
      .sort({ date: -1 });

    res.json(logs);
  } catch (err) {
    console.error("public logs error:", err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/", auth, async (req, res) => {
  const logs = await TravelLog.find({ userId: req.user.id })
    .populate("userId", "username")
    .sort({ date: -1 });

  res.json(logs);
});

router.get("/:id", auth, async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id)
      .populate("userId", "username")
      .populate("members", "_id username");

    if (!log) return res.status(404).json({ msg: "Log not found" });

    const isOwner = log.userId._id.toString() === req.user.id;
    const isMember = log.members.some((m) => m._id.toString() === req.user.id);

    if (!log.isPublic && !isOwner && !isMember) {
      return res.status(401).json({ msg: "Not allowed" });
    }

    res.json(log);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});
router.post("/", auth, async (req, res) => {
  const {
    title,
    destination,
    description,
    status,
    latitude,
    longitude,
    isPublic,
    date,
  } = req.body;

  try {
    if (!title || !destination) {
      return res
        .status(400)
        .json({ msg: "Title and destination are required" });
    }

    const log = new TravelLog({
      title: title.trim(),
      destination: destination.trim(),
      description,
      status,
      latitude,
      longitude,
      isPublic,
      date: date || new Date(),
      userId: req.user.id,
    });

    const saved = await log.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id);

    if (!log) return res.status(404).json({ msg: "Log not found" });
    if (log.userId.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not allowed" });

    const updated = await TravelLog.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("update log error:", err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id);

    if (!log) return res.status(404).json({ msg: "Log not found" });
    if (log.userId.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not allowed" });

    await log.deleteOne();
    res.json({ msg: "Travel log removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.put("/like/:id", auth, async (req, res) => {
  const log = await TravelLog.findById(req.params.id);
  if (!log) return res.status(404).json({ msg: "Log not found" });

  if (log.likes.some((l) => l.user.toString() === req.user.id)) {
    return res.status(400).json({ msg: "Already liked" });
  }

  log.likes.unshift({ user: req.user.id });
  await log.save();
  res.json(log.likes);
});

router.put("/unlike/:id", auth, async (req, res) => {
  const log = await TravelLog.findById(req.params.id);
  if (!log) return res.status(404).json({ msg: "Log not found" });

  log.likes = log.likes.filter((l) => l.user.toString() !== req.user.id);
  await log.save();
  res.json(log.likes);
});

router.put("/bookmark/:id", auth, async (req, res) => {
  const log = await TravelLog.findById(req.params.id);
  if (!log) return res.status(404).json({ msg: "Log not found" });

  if (log.bookmarks.some((b) => b.user.toString() === req.user.id)) {
    return res.status(400).json({ msg: "Already bookmarked" });
  }

  log.bookmarks.unshift({ user: req.user.id });
  await log.save();
  res.json(log.bookmarks);
});

router.put("/unbookmark/:id", auth, async (req, res) => {
  const log = await TravelLog.findById(req.params.id);
  if (!log) return res.status(404).json({ msg: "Log not found" });

  log.bookmarks = log.bookmarks.filter(
    (b) => b.user.toString() !== req.user.id
  );
  await log.save();
  res.json(log.bookmarks);
});

module.exports = router;
