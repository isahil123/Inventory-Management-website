const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
  // We now accept 'secretKey' from the frontend
  const { username, email, password, role, secretKey } = req.body;

  try {
    // --- 🛡️ SECURITY CHECK 1: Password Strength ---
    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters long." });
    }

    // --- 🛡️ SECURITY CHECK 2: Admin "Secret Key" ---
    // If someone selects "Admin" in the dropdown, they MUST know the code.
    if (role === "admin") {
      const COMPANY_SECRET = "BOSSMAN_2025"; // <--- The Secret Password
      if (secretKey !== COMPANY_SECRET) {
        return res.status(400).json({
          msg: "Invalid Secret Key! You are not authorized to be Admin.",
        });
      }
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create the new user
    user = new User({
      username: username || "Engineer", // Default name if they forget
      email,
      password,
      role: role || "staff",
    });

    // Encrypt Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save to DB
    await user.save();

    // Create Token
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        // ✅ CRITICAL: We send 'username' and 'role' back to the frontend
        res.json({ token, role: user.role, username: user.username });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// 2. LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check User
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Create Token
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        // ✅ CRITICAL: We send 'username' and 'role' back here too!
        res.json({ token, role: user.role, username: user.username });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { registerUser, loginUser };
