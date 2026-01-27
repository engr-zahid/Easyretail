const customerModel = require('../models/customerModel');

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
  }
};

module.exports = customerService;