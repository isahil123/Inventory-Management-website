const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/Order");
const Product = require("../models/Product");

// 1. 🛒 PLACE ORDER (Now supports Bulk Quantity & Discounts)
router.post("/", auth, async (req, res) => {
  try {
    // 🌟 Destructure quantity from body, default to 1 if not provided
    const { productId, address, quantity } = req.body;
    const orderQty = parseInt(quantity) || 1;

    if (!address)
      return res.status(400).json({ msg: "Bhai, address zaroori hai!" });

    const product = await Product.findById(productId);

    // 🌟 Check if enough stock exists for the requested quantity
    if (!product || product.quantity < orderQty) {
      return res.status(400).json({ msg: "Stock khatam ya kam hai bhai!" });
    }

    // 💰 BULK LOGIC: Agar 5 ya usse zyada hai, toh 30% Discount (0.7 multiplier)
    const isBulk = orderQty >= 5;
    const unitPrice = isBulk ? product.price * 0.7 : product.price;
    const finalTotal = unitPrice * orderQty;

    const newOrder = new Order({
      user: req.user.id,
      items: [
        {
          productId: product._id,
          name: product.name,
          price: unitPrice, // 🌟 Save the discounted price
          quantity: orderQty, // 🌟 Save the actual quantity
        },
      ],
      totalAmount: finalTotal,
      quantity: orderQty, // 🌟 Extra field for easy frontend access
      address,
      status: "Processing",
    });

    await newOrder.save();

    // 📉 Update stock by the ACTUAL quantity ordered
    product.quantity -= orderQty;
    await product.save();

    res.json(newOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 2. ❌ CANCEL ORDER (Updated to restore full quantity)
router.put("/cancel/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order nahi mila" });
    if (order.status === "Cancelled")
      return res.status(400).json({ msg: "Pehle se cancelled hai" });

    // 🌟 Restore inventory based on the quantity stored in the order
    for (let item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        // Restore the specific quantity from this order item
        product.quantity += item.quantity || 1;
        await product.save();
      }
    }

    order.status = "Cancelled";
    await order.save();
    res.json({ msg: "Order Cancelled & Stock Restored", order });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 3. 📜 GET MY ORDERS (History)
// Endpoint: GET /api/orders/my-orders
router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.productId", ["sku", "category"]) // Populating for extra details
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 4. 📊 ADMIN STATS (Already looks good, kept it same)
router.get("/stats", auth, async (req, res) => {
  try {
    const allOrders = await Order.find();
    const activeOrders = allOrders.filter((o) => o.status !== "Cancelled");
    const totalEarnings = activeOrders.reduce(
      (acc, item) => acc + item.totalAmount,
      0
    );

    const cancelledOrders = allOrders.filter((o) => o.status === "Cancelled");
    const lostRevenue = cancelledOrders.reduce(
      (acc, item) => acc + item.totalAmount,
      0
    );

    res.json({
      totalEarnings,
      orderCount: activeOrders.length,
      cancelledCount: cancelledOrders.length,
      lostRevenue,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// 5. 🏢 ADMIN ALL ORDERS
router.get("/all", auth, async (req, res) => {
  try {
    if (req.user.role === "buyer") {
      return res.status(403).json({ msg: "Access Denied" });
    }
    const orders = await Order.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
