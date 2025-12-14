const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "https://placehold.co/400", // Default image if none provided
  },
});

module.exports = mongoose.model("Product", productSchema);
