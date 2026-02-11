// orderController.js
const orderService = require('../services/orderService');

const orderController = {
  getAllOrders: async (req, res) => {
    try {
      console.log('Fetching all orders...');
      const orders = await orderService.getAllOrders();

      res.status(200).json({
        success: true,
        message: 'Orders fetched successfully',
        orders: orders
      });
    } catch (error) {
      console.error('Error in getAllOrders controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching orders',
        error: error.message
      });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Fetching order by ID: ${id}`);
      const order = await orderService.getOrderById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Order fetched successfully',
        order
      });
    } catch (error) {
      console.error('Error in getOrderById controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching order',
        error: error.message
      });
    }
  },

  createOrder: async (req, res) => {
    try {
      console.log('🔄 CONTROLLER: Starting createOrder');
      console.log('📥 Request body:', req.body);

      const orderData = req.body;

      // Validate
      if (!orderData.items || orderData.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one item is required'
        });
      }

      // Call service
      console.log('📞 Calling orderService.createOrder...');
      const order = await orderService.createOrder(orderData);

      console.log('✅ CONTROLLER: Service returned');
      console.log('🆔 Order ID from service:', order?.id);
      console.log('🔢 Order Number from service:', order?.orderNumber);
      console.log('💰 Total Amount from service:', order?.totalAmount);
      console.log('📅 Created At from service:', order?.createdAt);

      if (!order || !order.id) {
        console.error('❌ CONTROLLER: Service returned invalid order');
        return res.status(500).json({
          success: false,
          message: 'Failed to create order'
        });
      }

      // Prepare response
      const response = {
        success: true,
        message: 'Order created successfully',
        order: order
      };

      console.log('📤 CONTROLLER: Sending response');
      console.log('📋 Response order has ID?', !!response.order?.id);
      console.log('📋 Response order:', JSON.stringify(response.order, null, 2));

      res.status(201).json(response);

    } catch (error) {
      console.error('❌ CONTROLLER Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating order',
        error: error.message
      });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      console.log(`Updating order status for ${id} to ${status}`);

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const order = await orderService.updateOrderStatus(id, status);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order
      });
    } catch (error) {
      console.error('Error in updateOrderStatus controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating order status',
        error: error.message
      });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Deleting order: ${id}`);

      const order = await orderService.deleteOrder(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
        order
      });
    } catch (error) {
      console.error('Error in deleteOrder controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting order',
        error: error.message
      });
    }
  },

  getOrderStats: async (req, res) => {
    try {
      console.log('Fetching order stats...');
      const stats = await orderService.getOrderStats();

      res.status(200).json({
        success: true,
        message: 'Order stats fetched successfully',
        stats
      });
    } catch (error) {
      console.error('Error in getOrderStats controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching order stats',
        error: error.message
      });
    }
  },

  // ============================================
  // NEW: Get recent orders
  // ============================================
  getRecentOrders: async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      console.log(`Fetching recent orders, limit: ${limit}`);

      const orders = await orderService.getRecentOrders(parseInt(limit));

      res.status(200).json({
        success: true,
        message: 'Recent orders fetched successfully',
        orders
      });
    } catch (error) {
      console.error('Error in getRecentOrders controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching recent orders',
        error: error.message
      });
    }
  },

  // ============================================
  // NEW: Get order analytics
  // ============================================
  getOrderAnalytics: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      console.log(`Fetching order analytics from ${startDate} to ${endDate}`);

      const analytics = await orderService.getOrderAnalytics(startDate, endDate);

      res.status(200).json({
        success: true,
        message: 'Order analytics fetched successfully',
        analytics
      });
    } catch (error) {
      console.error('Error in getOrderAnalytics controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching order analytics',
        error: error.message
      });
    }
  },

  // ============================================
  // NEW: Get customer orders
  // ============================================
  getCustomerOrders: async (req, res) => {
    try {
      const { customerId } = req.params;
      console.log(`Fetching orders for customer: ${customerId}`);

      const orders = await orderService.getCustomerOrders(customerId);

      res.status(200).json({
        success: true,
        message: 'Customer orders fetched successfully',
        orders
      });
    } catch (error) {
      console.error('Error in getCustomerOrders controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching customer orders',
        error: error.message
      });
    }
  }
};

module.exports = orderController;