const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

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
router.get('/', orderController.getAllOrders); // ✅ Fixed: getAllOrders (not getOrders)
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrderStatus); // ✅ Fixed: updateOrderStatus (not updateOrder)
router.delete('/:id', orderController.deleteOrder);

// ========== ADDITIONAL ROUTES ==========
// Add these if you want to use the additional methods
router.get('/stats/summary', orderController.getOrderStats);
router.get('/recent/orders', orderController.getRecentOrders);
router.get('/analytics/orders', orderController.getOrderAnalytics);
router.get('/customer/:customerId', orderController.getCustomerOrders);

module.exports = router;