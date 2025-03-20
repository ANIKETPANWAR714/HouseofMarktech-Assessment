const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: { type: String },
  number: { type: String, required: true, unique: true }, // Ensure 'number' is the unique key
  type: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "available" },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
