const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth"); // Check for ID Card
const {
  getProducts,
  createProduct,
  deleteProduct,
} = require("../controllers/productController"); // Get the Logic

// 1. GET ALL ITEMS (e.g. Loading the Inventory Page)
// The server sees "GET /", checks ID (auth), then runs getProducts
router.get("/", auth, getProducts);

// 2. ADD NEW ITEM (e.g. Clicking "Add Stock")
router.post("/", auth, createProduct);

// 3. DELETE ITEM (e.g. Clicking the Red Trash Can)
router.delete("/:id", auth, deleteProduct);

module.exports = router;
