require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 In-memory storage (no DB)
let liveLocation = {};

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("MaxxTrack LIVE API Running 🚚");
});


// =========================
// 📍 DRIVER LOCATION API
// =========================
app.post("/location/:id", (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude & Longitude required" });
    }

    // Save live location
    liveLocation[req.params.id] = {
      lat,
      lng,
      status: "In Transit",
      truckNo: "LIVE-TRUCK"
    };

    res.json({
      message: "Location updated successfully",
      trackingId: req.params.id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =========================
// 🚚 CUSTOMER TRACK API
// =========================
app.get("/track/:id", (req, res) => {
  try {
    const data = liveLocation[req.params.id];

    if (!data) {
      return res.json({
        message: "No live tracking data yet"
      });
    }

    res.json({
      trackingId: req.params.id,
      status: data.status,
      truckNo: data.truckNo,
      location: `${data.lat},${data.lng}`
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
  console.log(`MaxxTrack LIVE server running on port ${PORT}`);
});
