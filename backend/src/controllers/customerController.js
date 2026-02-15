const customerService = require('../services/customerService');

const customerController = {
  async getCustomers(req, res) {
    console.log('getCustomers called');
    try {
      const customers = await customerService.getAllCustomers();
      console.log('Customers fetched:', customers.length);
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
      // here i Use service method that combines customer with orders
      const customerWithOrders = await customerService.getCustomerWithOrders(req.params.id);
      
      res.json({
        success: true,
        data: customerWithOrders
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
      console.log('Customer created:', customer.id);
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

  async searchCustomers(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }
      const customers = await customerService.searchCustomers(q);
      res.json({
        success: true,
        data: customers,
        count: customers.length
      });
    } catch (error) {
      console.error('Error searching customers:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to search customers' 
      });
    }
  },

  // Get customer analytics
  async getCustomerAnalytics(req, res) {
    try {
      const analytics = await customerService.getCustomerAnalytics();
      
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
  },

  // Get customer stats
  async getCustomerStats(req, res) {
    try {
      const stats = await customerService.getCustomerStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getCustomerStats:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = customerController;