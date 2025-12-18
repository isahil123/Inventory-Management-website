const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Check for ID Card

// Controller se saari logic import kar rahe hain
const {
  getProducts,
  createProduct,
  deleteProduct,
  purchaseProduct, // 🌟 Sahil, ye naya logic humne add kiya hai
} = require("../controllers/productController");

// 1. GET ALL ITEMS - Sab log dekh sakte hain (Admin, Staff, Buyer)
router.get("/", auth, getProducts);

// 2. ADD NEW ITEM - Sirf Admin aur Manager ke liye
router.post("/", auth, createProduct);

// 3. DELETE ITEM - Sirf Admin aur Manager ke liye
router.delete("/:id", auth, deleteProduct);

// 4. 🛒 PURCHASE ITEM - Ye sirf Buyer use karega button dabane par
// Iska pura URL banega: POST http://localhost:5000/api/products/purchase/:id
router.post("/purchase/:id", auth, purchaseProduct);

module.exports = router;
