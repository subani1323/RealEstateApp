require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const validateEnv = require("./middleware/validateEnv");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Validate required environment variables early
const requiredEnvVars = ["MONGO_URI"];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingVars.length) {
  console.error(`❌ Missing environment variables: ${missingVars.join(", ")}`);
  process.exit(1); // stop app startup
}

// Optionally, use the validateEnv middleware on routes if you want:
// app.use(validateEnv(requiredEnvVars));

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// Route Imports (make sure these files exist)
const reminderRoutes = require("./routes/reminder");
const generalLedgerRoutes = require("./routes/generalLedger");

// Use Routes
app.use("/api/reminders", reminderRoutes);
app.use("/api/general-ledger", generalLedgerRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// MongoDB Connection
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Error Handling Middleware — must come after routes
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});
