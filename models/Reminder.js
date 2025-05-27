const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  reminder: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Reminder", ReminderSchema);
