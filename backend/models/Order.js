const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
    },
  ],
  totalAmount: { type: Number, required: true },

  // 🏠 1. YAHAN ADDRESS ADD KIYA
  address: {
    type: String,
    required: true,
  },

  // 🔄 2. YAHAN ENUM ADD KIYA (Ab isme 'Cancelled' bhi allow hoga)
  status: {
    type: String,
    enum: ["Processing", "Delivered", "Cancelled"],
    default: "Processing",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
