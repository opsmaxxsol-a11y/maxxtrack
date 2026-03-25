require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// =========================
// 🔌 CONNECT MONGODB
// =========================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error:", err));

// =========================
// 📦 SCHEMA
// =========================
const truckSchema = new mongoose.Schema({
  truckNo: String,
  status: String,
  trackingId: String,
  location: String,
  destination: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Truck = mongoose.model("Truck", truckSchema);

// =========================
// 🧪 HEALTH CHECK
// =========================
app.get("/", (req, res) => {
  res.send("MaxxTrack Mongo API Running 🚚");
});

// =========================
// 📍 DRIVER LOCATION API
// =========================
app.post("/location/:id", async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude & Longitude required" });
    }

    const location = `${lat},${lng}`;

    // Update or create truck
    const truck = await Truck.findOneAndUpdate(
      { trackingId: req.params.id },
      {
        location,
        status: "In Transit",
        updatedAt: new Date()
      },
      { new: true, upsert: true } // 🔥 key line
    );

    res.json({
      message: "Location updated",
      data: truck
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// 🚚 TRACK API
// =========================
app.get("/track/:id", async (req, res) => {
  try {
    const truck = await Truck.findOne({ trackingId: req.params.id });

    if (!truck) {
      return res.json({
        message: "No tracking data found"
      });
    }

    res.json({
      trackingId: truck.trackingId,
      status: truck.status,
      truckNo: truck.truckNo || "LIVE-TRUCK",
      location: truck.location,
      destination: truck.destination
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// 🔔 OPTIONAL NOTIFICATION
// =========================
app.post("/notify", (req, res) => {
  console.log("Notification:", req.body);
  res.json({ message: "Notification received" });
});

// =========================
// 🚀 START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
