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
    // Check for duplicate SKU
    let product = await Product.findOne({ sku });
    if (product) {
      return res.status(400).json({ msg: "Part ID (SKU) already exists!" });
    }

    product = new Product({
      name,
      sku,
      quantity,
      price,
    });

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// 3. DELETE SPARE PART (👇 NEW FUNCTION)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Part not found" });
    }

    await product.deleteOne(); // Delete from DB
    res.json({ msg: "Part removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { getProducts, createProduct, deleteProduct };
