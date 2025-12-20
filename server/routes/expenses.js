const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const { description, amount, category, date, travelLog, groupTrip } =
    req.body;

  try {
    const newExpense = new Expense({
      description,
      amount,
      category,
      date,
      user: req.user.id,
      travelLog,
      groupTrip: groupTrip || null,
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (error) {
    console.error("Error creating expense:", error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .populate("travelLog", "title")
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    res.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Expense not found" });
    }
    res.status(500).send("Server Error");
  }
});

router.put("/:id", auth, async (req, res) => {
  const { description, amount, category, date, travelLog, groupTrip } =
    req.body;

  const expenseFields = {
    ...(description && { description }),
    ...(amount && { amount }),
    ...(category && { category }),
    ...(date && { date }),
    travelLog: travelLog === "" ? null : travelLog,
    groupTrip: groupTrip === "" ? null : groupTrip,
  };

  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: expenseFields },
      { new: true }
    );

    res.json(expense);
  } catch (error) {
    console.error("Error updating expense:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Expense not found" });
    }
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await expense.deleteOne();
    res.json({ msg: "Expense removed" });
  } catch (error) {
    console.error("Error deleting expense:", error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Expense not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
