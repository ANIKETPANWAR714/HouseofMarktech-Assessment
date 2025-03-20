require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require('../config/db')
const User = require("../models/User");

const seedAdmin = async () => {
  try {
      await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "Admin@123", // Change to a secure password if needed
      role: "admin",
    });

    await admin.save();
    console.log("Admin seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
