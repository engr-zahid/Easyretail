const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

const productController = require('../controllers/productController');

// ========== OPTIONS HANDLERS FOR PREFLIGHT REQUESTS ==========
// These are CRITICAL for CORS preflight requests

// Handle OPTIONS for all product routes
router.options('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  res.sendStatus(200);
});

// Handle OPTIONS for specific product ID routes
router.options('/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
});

// Handle OPTIONS for test-products route
router.options('/test-products', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
});

// ========== MAIN ROUTES ==========

// GET /api/products
router.get('/', productController.getAllProducts);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

// POST /api/products
router.post('/', upload.single('image'), productController.createProduct);

// PUT /api/products/:id
router.put('/:id', upload.single('image'), productController.updateProduct);

// DELETE /api/products/:id
router.delete('/:id', productController.deleteProduct);

// DELETE /api/products (delete all)
router.delete('/', productController.clearAllProducts);

// Test route - GET /api/products/test-products
router.get('/test-products', (req, res) => {
  res.json({
    success: true,
    message: 'Test products endpoint is working',
    products: [
      {
        id: 'test-1',
        name: 'Test Product 1',
        price: 19.99,
        quantity: 100,
        category: 'Electronics',
        status: 'in-stock'
      },
      {
        id: 'test-2',
        name: 'Test Product 2',
        price: 29.99,
        quantity: 50,
        category: 'Clothing',
        status: 'low-stock'
      }
    ]
  });
});

module.exports = router;