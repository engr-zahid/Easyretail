// orderService.js
const orderModel = require('../models/orderModel');
const customerModel = require('../models/customerModel');
const productModel = require('../models/productModel');

const orderService = {
  getAllOrders: async () => {
    try {
      console.log('Fetching all orders in service...');
      const orders = await orderModel.getAllOrders();
      return orders;
    } catch (error) {
      console.error('Error in orderService.getAllOrders:', error);
      throw error;
    }
  },

  getOrderById: async (id) => {
    try {
      return await orderModel.getOrderById(id);
    } catch (error) {
      console.error('Error in orderService.getOrderById:', error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      console.log('🔄 SERVICE: Starting createOrder');
      console.log('📥 Service input:', orderData);

      // ============================================
      // 1. VALIDATE PRODUCT STOCK
      // ============================================
      for (const item of orderData.items) {
        const product = await productModel.getProductById(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`);
        }
      }

      // ============================================
      // 2. VALIDATE CUSTOMER (if provided)
      // ============================================
      if (orderData.customerId) {
        const customer = await customerModel.findById(orderData.customerId);
        if (!customer) {
          throw new Error(`Customer ${orderData.customerId} not found`);
        }
      }

      const order = await orderModel.createOrder(orderData);

      console.log('✅ SERVICE: Model returned order');
      console.log('🆔 Order ID from model:', order?.id);
      console.log('🔢 Order Number from model:', order?.orderNumber);

      if (!order || !order.id) {
        console.error('❌ SERVICE: Model returned invalid order');
        throw new Error('Failed to create order');
      }

      console.log('📤 SERVICE: Returning to controller');
      return order;

    } catch (error) {
      console.error('❌ SERVICE Error:', error);
      throw error;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      return await orderModel.updateOrderStatus(id, status);
    } catch (error) {
      console.error('Error in orderService.updateOrderStatus:', error);
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      return await orderModel.deleteOrder(id);
    } catch (error) {
      console.error('Error in orderService.deleteOrder:', error);
      throw error;
    }
  },

  getOrderStats: async () => {
    try {
      return await orderModel.getStats();
    } catch (error) {
      console.error('Error in orderService.getOrderStats:', error);
      throw error;
    }
  },

  // ============================================
  // NEW: Get customer order history
  // ============================================
  getCustomerOrders: async (customerId) => {
    try {
      return await orderModel.getOrdersByCustomer(customerId);
    } catch (error) {
      console.error('Error in orderService.getCustomerOrders:', error);
      throw error;
    }
  },

  // ============================================
  // NEW: Get recent orders for dashboard
  // ============================================
  getRecentOrders: async (limit = 10) => {
    try {
      return await orderModel.getRecentOrdersSummary(limit);
    } catch (error) {
      console.error('Error in orderService.getRecentOrders:', error);
      throw error;
    }
  },

  // ============================================
  // NEW: Get order analytics
  // ============================================
  getOrderAnalytics: async (startDate, endDate) => {
    try {
      const orders = await orderModel.getAllOrders();
      
      // Filter by date range if provided
      let filteredOrders = orders;
      if (startDate && endDate) {
        filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
        });
      }

      // Calculate analytics
      const analytics = {
        totalOrders: filteredOrders.length,
        totalRevenue: filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        averageOrderValue: filteredOrders.length > 0 
          ? filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0) / filteredOrders.length
          : 0,
        statusDistribution: {
          PENDING: filteredOrders.filter(o => o.status === 'PENDING').length,
          PROCESSING: filteredOrders.filter(o => o.status === 'PROCESSING').length,
          COMPLETED: filteredOrders.filter(o => o.status === 'COMPLETED').length,
          CANCELLED: filteredOrders.filter(o => o.status === 'CANCELLED').length
        },
        topProducts: {},
        topCustomers: {}
      };

      // Calculate top products
      const productSales = {};
      filteredOrders.forEach(order => {
        order.orderItems.forEach(item => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              productId: item.productId,
              productName: item.product?.name || 'Unknown',
              totalQuantity: 0,
              totalRevenue: 0
            };
          }
          productSales[item.productId].totalQuantity += item.quantity;
          productSales[item.productId].totalRevenue += item.subtotal;
        });
      });

      analytics.topProducts = Object.values(productSales)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5);

      return analytics;
    } catch (error) {
      console.error('Error in orderService.getOrderAnalytics:', error);
      throw error;
    }
  }
};

module.exports = orderService;