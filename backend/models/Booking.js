const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roomId: { type: String, required: true }, // Change from ObjectId to String
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: "pending" },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
