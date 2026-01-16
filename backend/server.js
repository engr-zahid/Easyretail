<<<<<<< HEAD
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
=======
require('dotenv').config();

const app = require('./src/app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API Endpoint: http://localhost:${PORT}/api/products`);
      console.log(`🎯 Test Data: http://localhost:${PORT}/api/test-products`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('HTTP server closed.');
        await prisma.$disconnect();
        console.log('Database connection closed.');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    // process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    // process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
>>>>>>> a3859f8 (Implemented product fetch and add features with database connectivity and UI updates)
