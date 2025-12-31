import express from "express";
import pool from "../../config/database.js";

const router = express.Router();

/* ======================
   GET all products
====================== */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id ASC"
    );
    
    // Transform data for frontend (with defaults for missing columns)
    const transformedProducts = result.rows.map(product => ({
      id: product.id,
      name: product.name || '',
      price: product.price || 0,
      quantity: product.quantity || 0,
      category: product.category || 'Clothing',
      // Map quantity to stock for frontend
      stock: product.quantity || 0,
      // Calculate status based on quantity
      status: (product.quantity || 0) === 0 ? 'out-of-stock' : 
              (product.quantity || 0) <= 10 ? 'low-stock' : 'in-stock',
      // Provide defaults for missing columns
      // sales: Math.floor(Math.random() * 100), // Generate random sales for demo
      image: '📦', // Default emoji
      description: '' // Empty description
    }));
    
    res.json(transformedProducts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/* ======================
   ADD product
====================== */
router.post("/", async (req, res) => {
  try {
    const { name, price, stock, quantity, category } = req.body;
    
    // Use stock if provided, otherwise quantity
    const stockValue = stock || quantity || 0;
    
    // Insert only columns that exist in your table
    const result = await pool.query(
      `INSERT INTO products (name, price, quantity, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        name, 
        price, 
        stockValue, 
        category || 'Clothing'
      ]
    );

    // Return transformed product for frontend
    const insertedProduct = result.rows[0];
    const transformedProduct = {
      id: insertedProduct.id,
      name: insertedProduct.name || '',
      price: insertedProduct.price || 0,
      quantity: insertedProduct.quantity || 0,
      category: insertedProduct.category || 'Clothing',
      // Map quantity to stock
      stock: insertedProduct.quantity || 0,
      // Calculate status
      status: (insertedProduct.quantity || 0) === 0 ? 'out-of-stock' : 
              (insertedProduct.quantity || 0) <= 10 ? 'low-stock' : 'in-stock',
      // Provide defaults for frontend
      sales: Math.floor(Math.random() * 100),
      image: '📦',
      description: ''
    };

    res.status(201).json(transformedProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/* ======================
   DELETE product
====================== */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ 
      message: "Product deleted successfully",
      deletedProduct: result.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/* ======================
   UPDATE product
====================== */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, quantity, category } = req.body;

    // Use stock if provided, otherwise quantity
    const stockValue = stock || quantity || 0;

    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           price = $2,
           quantity = $3,
           category = $4
       WHERE id = $5
       RETURNING *`,
      [
        name, 
        price, 
        stockValue, 
        category || 'Clothing', 
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Return transformed product for frontend
    const updatedProduct = result.rows[0];
    const transformedProduct = {
      id: updatedProduct.id,
      name: updatedProduct.name || '',
      price: updatedProduct.price || 0,
      quantity: updatedProduct.quantity || 0,
      category: updatedProduct.category || 'Clothing',
      // Map quantity to stock
      stock: updatedProduct.quantity || 0,
      // Calculate status
      status: (updatedProduct.quantity || 0) === 0 ? 'out-of-stock' : 
              (updatedProduct.quantity || 0) <= 10 ? 'low-stock' : 'in-stock',
      // Provide defaults for frontend
      sales: Math.floor(Math.random() * 100),
      image: '📦',
      description: ''
    };

    res.json(transformedProduct);
  } catch (err) {
    console.error(err.message);       
    res.status(500).send("Server Error");
  }
});

export default router;