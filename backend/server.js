const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// --- CHANGE 1: Update this import to include registerUser ---
const { loginUser, registerUser } = require("./controllers/authController");

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./controllers/productController");
const { getDashboardStats } = require("./controllers/dashboardController");

const app = express();
app.use(express.json());
app.use(cors());

// --- ROUTES ---

// Auth
// --- CHANGE 2: Add the register route here ---
app.post("/api/register", registerUser);
app.post("/api/login", loginUser);

// Inventory Management
app.get("/api/products", getProducts);
app.post("/api/products", createProduct);
app.put("/api/products/:id", updateProduct);
app.delete("/api/products/:id", deleteProduct);

// Dashboard
app.get("/api/dashboard", getDashboardStats);

// DB Connection & Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
