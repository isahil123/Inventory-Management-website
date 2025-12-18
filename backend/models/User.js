const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    // ✅ Updated this line
    enum: ["admin", "user", "staff", "manager", "buyer"],
    default: "buyer",
  },
});

module.exports = mongoose.model("User", userSchema);
