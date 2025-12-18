const Product = require("../models/Product");

// 1. GET ALL SPARES (Sorted by Newest)
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// 2. ADD NEW SPARE PART
const createProduct = async (req, res) => {
  const { name, sku, quantity, price } = req.body;

  try {
    // 🛑 Check: Kya saare fields aa rahe hain?
    if (!name || !sku || !quantity || !price) {
      return res.status(400).json({ msg: "Bhai, saare fields bharo!" });
    }

    let product = await Product.findOne({ sku });
    if (product) {
      return res.status(400).json({ msg: "SKU ID already exists!" });
    }

    product = new Product({ name, sku, quantity, price });
    await product.save();

    // ✅ Success Response bhej raha hai ya nahi?
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// 3. DELETE SPARE PART
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Part not found" });
    }
    await product.deleteOne();
    res.json({ msg: "Part removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// 4. 🛒 PURCHASE SPARE PART (🌟 SAHIL, ADD THIS HERE!)
const purchaseProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Machine part not found" });
    }

    // 🛑 Check if stock exists before reducing
    if (product.quantity <= 0) {
      return res.status(400).json({ msg: "Sorry! Out of stock." });
    }

    // 📉 Business Logic: Reduce quantity by 1 for each order
    product.quantity -= 1;

    await product.save();
    res.json(product); // Send updated part back to UI
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error in Purchase");
  }
};

// 🚀 Export all functions including the new one
module.exports = { getProducts, createProduct, deleteProduct, purchaseProduct };
