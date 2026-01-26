// 1. Load env variables
require("dotenv").config();
// import livekitRoutes from "./routes/livekit.js";

// 2. Imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bookingRoutes = require("./routes/bookingRoutes");
const livekitRoutes= require("./routes/livekit.js");

// 3. App init
const app = express();

// 4. Middleware
app.use(cors());
app.use(express.json());
app.use("/api/bookings", bookingRoutes);
app.use("/api", livekitRoutes);


// 5. MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// 6. Basic test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// 7. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});