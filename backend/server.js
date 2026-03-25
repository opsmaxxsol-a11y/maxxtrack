require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Mongo Error:", err));

// Schema
const truckSchema = new mongoose.Schema({
  truckNo: String,
  location: String,
  status: String,
  trackingId: String,
  destination: String
});

const Truck = mongoose.model("Truck", truckSchema);

// Save GPS
app.post("/location/:id", async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const truck = await Truck.findOneAndUpdate(
      { trackingId: req.params.id },
      { location: `${lat},${lng}` },
      { new: true }
    );

    if (!truck) {
      return res.status(404).json({ message: "Truck not found" });
    }

    res.json(truck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tracking
app.get("/track/:id", async (req, res) => {
  try {
    const truck = await Truck.findOne({ trackingId: req.params.id });

    if (!truck) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json(truck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("MaxxTrack API Running ✅");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
