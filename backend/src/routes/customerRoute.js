const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// ========== OPTIONS HANDLERS ==========
router.options('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
});

router.options('/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Max-Age', '86400');
  res.sendStatus(200);
});

// ========== MAIN ROUTES ==========
// CHANGE THESE NAMES TO MATCH YOUR CONTROLLER:
router.get('/', customerController.getCustomers);  // Changed from getAllCustomers
router.post('/', customerController.createCustomer);
router.get('/:id', customerController.getCustomer);  // Changed from getCustomerById
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

// Optional: Add analytics route if needed
router.get('/analytics/summary', customerController.getCustomerAnalytics);

module.exports = router;