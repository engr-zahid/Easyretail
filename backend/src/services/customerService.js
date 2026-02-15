const customerModel = require('../models/customerModel');
const orderService = require('./orderService');

const customerService = {
  async getAllCustomers() {
    return await customerModel.findAll();
  },

  async getCustomerById(id) {
    const customer = await customerModel.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  },

  // Get customer with their orders
  async getCustomerWithOrders(id) {
    const customer = await this.getCustomerById(id);
    const orders = await orderService.getCustomerOrders(id);
    
    return {
      ...customer,
      orders: orders || []
    };
  },

  async createCustomer(customerData) {
    // Check if email already exists
    const existingCustomer = await customerModel.findByEmail(customerData.email);
    if (existingCustomer) {
      throw new Error('Email already registered');
    }
    
    return await customerModel.create(customerData);
  },

  async updateCustomer(id, customerData) {
    await this.getCustomerById(id); // Check if exists
    
    // Filter out fields that shouldn't be updated
    const { id: _, createdAt, updatedAt, ...updateData } = customerData;
    
    return await customerModel.update(id, updateData);
  },

  async deleteCustomer(id) {
    await this.getCustomerById(id); // Check if exists
    return await customerModel.delete(id);
  },

  // Search customers
  async searchCustomers(query) {
    return await customerModel.search(query);
  },

  // Get customer analytics
  async getCustomerAnalytics() {
    const customers = await this.getAllCustomers();
    
    // Calculate analytics
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
    
    return analytics;
  },

  // Get customer statistics for dashboard
  async getCustomerStats() {
    const customers = await this.getAllCustomers();
    
    return {
      total: customers.length,
      active: customers.filter(c => c.status === 'active').length,
      inactive: customers.filter(c => c.status === 'inactive').length,
      newThisMonth: customers.filter(c => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(c.createdAt) >= thirtyDaysAgo;
      }).length
    };
  }
};

module.exports = customerService;