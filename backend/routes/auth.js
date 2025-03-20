const express = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

const ROLE = {
  USER: "user",
  ADMIN: "admin",
};

// 🟢 Register Route (for users only)
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(req.body);
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Prevent registering as admin directly
    if (role === ROLE.ADMIN) {
      return res.status(403).json({ message: "Cannot register as admin" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: ROLE.USER,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log(error);
  }
});

// 🟢 Register Admin Route (only admins can register other admins)
router.post(
  "/register/admin",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      const admin = new User({
        name,
        email,
        password: hashedPassword,
        role: ROLE.ADMIN,
      });
      await admin.save();

      res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
      console.log(error);
    }
  }
);

// 🟢 Login Route (for both user and admin)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and Password both are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Create JWT token with role included
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("Generated Token:", token);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.log(error);
  }
});

module.exports = router;
