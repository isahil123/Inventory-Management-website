const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate Token Helper
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// 1. REGISTER USER (New)
const registerUser = async (req, res) => {
  const { email, password, role } = req.body; // Role can be 'admin' or 'user'

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user (In production, you'd hash the password here)
    const user = await User.create({
      email,
      password,
      role: role || "user", // Default to user if no role selected
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// 2. LOGIN USER (Existing)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && user.password === password) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
