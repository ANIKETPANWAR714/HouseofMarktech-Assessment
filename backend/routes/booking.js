const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { ROOMS } = require("../constants/rooms");
const cron = require("node-cron");

// ✅ Create Rooms from `ROOMS`
router.post("/rooms", adminMiddleware, async (req, res) => {
  try {
    for (const roomData of ROOMS) {
      const existingRoom = await Room.findOne({ number: roomData.number });
      if (!existingRoom) {
        const room = new Room(roomData);
        await room.save();
      }
    }
    res.status(201).json({ message: "Rooms added successfully" });
  } catch (error) {
    console.error("Create Room Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Create a New Booking
router.post("/", authMiddleware, async (req, res) => {
  let { roomId, startDate, endDate } = req.body;

  if (!roomId || !startDate || !endDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Extract room number from format "Deluxe (#101)"
  if (roomId.includes("(") && roomId.includes(")")) {
    const match = roomId.match(/\(([^)]+)\)/);
    if (match) {
      roomId = match[1].trim(); // Extract room number (e.g., "101")
    }
  }

  try {
    const room = await Room.findOne({ number: roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check for booking conflicts
    const existingBooking = await Booking.findOne({
      roomId: room.number,
      $or: [
        {
          startDate: { $lt: new Date(endDate) },
          endDate: { $gt: new Date(startDate) },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Room already booked for the selected dates",
      });
    }

    // Create booking
    const booking = new Booking({
      userId: req.user.id,
      roomId: room.number,
      startDate,
      endDate,
      status: "pending",
    });

    await booking.save();

    res.status(201).json({
      message: "Booking request sent. Waiting for admin approval.",
      booking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Get All Rooms (for User View)
router.get("/rooms", authMiddleware, async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Fetch Rooms Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Get All Pending Bookings (Admin Only)
router.get("/pending", adminMiddleware, async (req, res) => {
  try {
    const pendingBookings = await Booking.find({ status: "pending" }).populate(
      "roomId"
    );
    res.status(200).json(pendingBookings);
  } catch (error) {
    console.error("Fetch Pending Bookings Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Approve or Reject a Booking (Admin Only)
router.put("/:bookingId", adminMiddleware, async (req, res) => {
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Booking already processed" });
    }

    if (status === "approved") {
      booking.status = "approved";
      await booking.save();

      // ✅ Update Room Status to "booked"
      await Room.findOneAndUpdate(
        { number: booking.roomId },
        { status: "booked" }
      );

      // ✅ Schedule status reset after endDate
      const resetTime = new Date(booking.endDate).getTime() - Date.now();
      if (resetTime > 0) {
        setTimeout(async () => {
          console.log(`Resetting room ${booking.roomId} status to available`);
          await Room.findOneAndUpdate(
            { number: booking.roomId },
            { status: "available" }
          );
        }, resetTime);
      }

      return res.status(200).json({ message: "Booking approved", booking });
    } else if (status === "rejected") {
      await Booking.findByIdAndDelete(req.params.bookingId);
      return res.status(200).json({ message: "Booking rejected" });
    }
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ CRON JOB to Reset Room Status at Midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const now = new Date();

    // Find bookings that have ended
    const expiredBookings = await Booking.find({
      endDate: { $lt: now },
      status: "approved",
    });

    for (const booking of expiredBookings) {
      await Room.findOneAndUpdate(
        { number: booking.roomId },
        { status: "available" }
      );
      console.log(`Room ${booking.roomId} reset to available`);
    }
  } catch (error) {
    console.error("Cron Reset Error:", error.message);
  }
});

module.exports = router;
