const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import Models
const User = require("./models/User");
const Product = require("./models/Product");

// --- DATA TO INSERT ---

const users = [
  {
    email: "admin@example.com",
    password: "adminpassword",
    role: "admin",
  },
  {
    email: "user@example.com",
    password: "userpassword",
    role: "user",
  },
];

const products = [
  {
    name: "Gaming Laptop",
    category: "Electronics",
    quantity: 10,
    price: 75000,
    image: "https://placehold.co/600x400?text=Laptop",
  },
  {
    name: "Wireless Mouse",
    category: "Electronics",
    quantity: 50,
    price: 1500,
    image: "https://placehold.co/600x400?text=Mouse",
  },
  {
    name: "Mechanical Keyboard",
    category: "Electronics",
    quantity: 0, // Out of Stock example
    price: 4500,
    image: "https://placehold.co/600x400?text=Keyboard",
  },
  {
    name: "Office Chair",
    category: "Furniture",
    quantity: 5, // Low Stock example
    price: 12000,
    image: "https://placehold.co/600x400?text=Chair",
  },
  {
    name: "Notebook Set",
    category: "Stationery",
    quantity: 100,
    price: 500,
    image: "https://placehold.co/600x400?text=Notebooks",
  },
];

// --- INSERTION LOGIC ---

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    console.log("Old Data Removed...");

    // Insert new data
    await User.insertMany(users);
    await Product.insertMany(products);

    console.log("SUCCESS: Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
