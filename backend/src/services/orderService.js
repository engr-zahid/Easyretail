// orderService.js
const orderModel = require('../models/orderModel');

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
  }
};

module.exports = orderService;