const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");

// Helper: Format date to MM/DD/YYYY string
function formatDate(dateString) {
  const d = new Date(dateString);
  return [
    ("0" + (d.getMonth() + 1)).slice(-2),
    ("0" + d.getDate()).slice(-2),
    d.getFullYear(),
  ].join("/");
}

// Add a new reminder
router.post("/", async (req, res) => {
  try {
    const { date, reminder } = req.body;

    if (!date || !reminder) {
      return res
        .status(400)
        .json({ message: "Date and reminder text are required." });
    }

    const formattedDate = formatDate(date);

    const newReminder = new Reminder({ date: formattedDate, reminder });
    const savedReminder = await newReminder.save();
    res.status(201).json(savedReminder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding reminder", error: error.message });
  }
});

// Get all reminders
router.get("/", async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.json(reminders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reminders", error: error.message });
  }
});

// Delete all reminders
router.delete("/", async (req, res) => {
  try {
    await Reminder.deleteMany({});
    res.json({ message: "All reminders cleared" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing reminders", error: error.message });
  }
});

// Delete a single reminder by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedReminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!deletedReminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting reminder", error: error.message });
  }
});

// Update a reminder by ID
router.put("/:id", async (req, res) => {
  try {
    let { date, reminder } = req.body;

    if (!date || !reminder) {
      return res
        .status(400)
        .json({ message: "Date and reminder text are required." });
    }

    // Format date if needed
    if (date.includes("-")) {
      date = formatDate(date);
    }

    const updatedReminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      { date, reminder },
      { new: true }
    );

    if (!updatedReminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json(updatedReminder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating reminder", error: error.message });
  }
});

module.exports = router;
