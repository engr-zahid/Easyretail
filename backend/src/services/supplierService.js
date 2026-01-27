const supplierModel = require('../models/supplierModel');

const supplierService = {
  async getAllSuppliers() {
    return await supplierModel.findAll();
  },

  async getSupplierById(id) {
    const supplier = await supplierModel.findById(id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    return supplier;
  },

  async createSupplier(supplierData) {
    // Validate required fields
    if (!supplierData.name || !supplierData.email) {
      throw new Error('Name and email are required');
    }

    // Check if email already exists
    const existingSupplier = await supplierModel.findByEmail(supplierData.email);
    if (existingSupplier) {
      throw new Error('Email already registered');
    }
    
    return await supplierModel.create(supplierData);
  },

  async updateSupplier(id, supplierData) {
    await this.getSupplierById(id); // Check if exists
    
    // If email is being updated, check if new email already exists
    if (supplierData.email) {
      const existingSupplier = await supplierModel.findByEmail(supplierData.email);
      if (existingSupplier && existingSupplier.id !== id) {
        throw new Error('Email already registered to another supplier');
      }
    }
    
    // Filter out fields that shouldn't be updated
    const { id: _, createdAt, updatedAt, ...updateData } = supplierData;
    
    return await supplierModel.update(id, updateData);
  },

  async deleteSupplier(id) {
    await this.getSupplierById(id); // Check if exists
    return await supplierModel.delete(id);
  },

  async searchSuppliers(query) {
    return await supplierModel.search(query);
  }
};

module.exports = supplierService;