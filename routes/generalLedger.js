const express = require("express");
const router = express.Router();
const GeneralLedger = require("../models/GeneralLedger");

// POST: Save a new general ledger entry
router.post("/", async (req, res) => {
  try {
    const entry = new GeneralLedger(req.body);
    await entry.save();
    res.status(201).json({ message: "Data saved successfully.", entry });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Fetch all general ledger entries
router.get("/", async (req, res) => {
  try {
    const entries = await GeneralLedger.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch a single entry by ID
router.get("/:id", async (req, res) => {
  try {
    const entry = await GeneralLedger.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete an entry by ID
router.delete("/:id", async (req, res) => {
  try {
    const result = await GeneralLedger.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Entry not found" });
    }
    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
