require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const Truck = mongoose.model("Truck", {
  truckNo: String,
  location: String,
  status: String,
  trackingId: String,
  destination: String
});

// Save GPS
app.post("/location/:id", async (req,res)=>{
  const { lat,lng } = req.body;
  const truck = await Truck.findOneAndUpdate(
    { trackingId:req.params.id },
    { location:`${lat},${lng}` },
    { new:true }
  );
  res.send(truck);
});

// Get tracking + ETA
app.get("/track/:id", async (req,res)=>{
  const truck = await Truck.findOne({ trackingId:req.params.id });
  res.send(truck);
});

// Dummy WhatsApp trigger (integrate Twilio later)
app.post("/notify", (req,res)=>{
  console.log("Send WhatsApp:", req.body);
  res.send("Notification sent");
});

app.listen(5000, ()=>console.log("Pro MaxxTrack running"));
{
  "name": "backend",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "cors": "^2.8.5"
  }
}
