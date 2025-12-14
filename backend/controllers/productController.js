const Product = require("../models/Product");

// 1. Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Add New Product
const createProduct = async (req, res) => {
  const { name, category, quantity, price, image } = req.body;
  try {
    const product = new Product({ name, category, quantity, price, image });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: "Error creating product" });
  }
};

// 3. Update Product (Edit Stock/Price) <--- NEW
const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error updating product" });
  }
};

// 4. Delete Product <--- NEW
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting product" });
  }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
