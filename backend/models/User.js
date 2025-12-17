const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  }, // Added username because your Register page sends it
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
    // 👇 UPDATED: Added 'staff' and 'manager' to the allowed list
    enum: ["admin", "user", "staff", "manager"],
    default: "staff",
  },
});

module.exports = mongoose.model("User", userSchema);
