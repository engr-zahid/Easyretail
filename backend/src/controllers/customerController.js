const customerService = require('../services/customerService');
const orderService = require('../services/orderService'); // Add this import

const customerController = {
  async getCustomers(req, res) {
    console.log('getCustomers called');
    try {
      const customers = await customerService.getAllCustomers();
      console.log('Customers fetched:', customers);
      res.json({
        success: true,
        data: customers
      });
    } catch (error) {
      console.error('Error in getCustomers:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async getCustomer(req, res) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      
      // Get customer's order history
      const orders = await orderService.getCustomerOrders(req.params.id);
      
      const response = {
        ...customer,
        orders: orders || []
      };
      
      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  },

  async createCustomer(req, res) {
    console.log('createCustomer called with data:', req.body);
    try {
      const customer = await customerService.createCustomer(req.body);
      console.log('Customer created:', customer);
      res.status(201).json({
        success: true,
        data: customer,
        message: 'Customer created successfully'
      });
    } catch (error) {
      console.error('Error in createCustomer:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async updateCustomer(req, res) {
    try {
      const customer = await customerService.updateCustomer(req.params.id, req.body);
      res.json({
        success: true,
        data: customer,
        message: 'Customer updated successfully'
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  async deleteCustomer(req, res) {
    try {
      await customerService.deleteCustomer(req.params.id);
      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // ============================================
  // NEW: Get customer analytics
  // ============================================
  async getCustomerAnalytics(req, res) {
    try {
      const customers = await customerService.getAllCustomers();
      
      const analytics = {
        totalCustomers: customers.length,
        activeCustomers: customers.filter(c => c.status === 'active').length,
        totalRevenue: customers.reduce((sum, c) => sum + parseFloat(c.totalSpent || 0), 0),
        averageOrderValue: customers.length > 0 
          ? customers.reduce((sum, c) => sum + parseFloat(c.totalSpent || 0), 0) / customers.length
          : 0,
        topCustomers: customers
          .sort((a, b) => parseFloat(b.totalSpent || 0) - parseFloat(a.totalSpent || 0))
          .slice(0, 10)
          .map(c => ({
            id: c.id,
            name: c.name,
            totalSpent: parseFloat(c.totalSpent || 0),
            totalOrders: c.totalOrders || 0
          }))
      };
      
      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Error in getCustomerAnalytics:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = customerController;