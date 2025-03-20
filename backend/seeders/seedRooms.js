require('dotenv').config();
const mongoose = require("mongoose");
const Room = require("../models/Room");
const connectDB = require('../config/db')

const rooms = [
  {
    roomId: "101",
    number: "101",
    type: "Deluxe",
    price: 150,
    status: "available",
  },
  {
    roomId: "102",
    number: "102",
    type: "Standard",
    price: 100,
    status: "available",
  },
  {
    roomId: "103",
    number: "103",
    type: "Suite",
    price: 250,
    status: "available",
  },
];


const seedRooms = async () => {
    await connectDB();

  await Room.deleteMany({});
  await Room.insertMany(rooms);

  console.log("Rooms seeded successfully!");
    process.exit();
};

seedRooms();
