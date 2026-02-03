// orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); // Make sure this imports the REAL controller

// Routes
router.get('/', orderController.getAllOrders);
router.get('/stats', orderController.getOrderStats);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.patch('/:id/status', orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);



module.exports = router;