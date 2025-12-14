const Product = require("../models/Product");

const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const outOfStock = await Product.countDocuments({ quantity: 0 });

    const products = await Product.find();
    const totalStoreValue = products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    res.json({ totalProducts, outOfStock, totalStoreValue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
