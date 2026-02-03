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

// GET all products
router.get('/products', productController.getAllProducts);

// GET product by ID
router.get('/products/:id', productController.getProductById);

// POST create new product (with file upload)
router.post('/products', upload.single('image'), productController.createProduct);

// PUT update product (with optional file upload)
router.put('/products/:id', upload.single('image'), productController.updateProduct);

// DELETE product
router.delete('/products/:id', productController.deleteProduct);

// DELETE all products
router.delete('/products', productController.clearAllProducts);

// Test route - get mock products
router.get('/test-products', (req, res) => {
  res.json({
    success: true,
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