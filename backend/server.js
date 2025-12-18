const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected")) // 👈 Yahan semicolon hata diya
  .catch((err) => console.log("❌ DB Connection Error:", err));

// --- ROUTES ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));

// 🌟 YAHAN ADD KARO (Order Route)
// Isse /api/orders/my-orders wala 404 error solve ho jayega
app.use("/api/orders", require("./routes/orderRoutes"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
