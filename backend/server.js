import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/database.js"; // PostgreSQL connection
import productRoutes from "./src/routes/productRoutes.js";

dotenv.config();

const app = express();

/* =======================
   MIDDLEWARE
======================= */

// Enable CORS (VERY IMPORTANT)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend (Vite)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

/* =======================
   ROUTES
======================= */

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Product routes
app.use("/api/products", productRoutes);

/* =======================
   DB CONNECTION TEST
======================= */

const testDBConnection = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL Connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  }
};

testDBConnection();

/* =======================
   START SERVER
======================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
