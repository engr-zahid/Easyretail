const supplierService = require('../services/supplierService');

const supplierController = {
  async getSuppliers(req, res) {
    try {
      const suppliers = await supplierService.getAllSuppliers();
      res.json({
        success: true,
        data: suppliers,
        count: suppliers.length
      });
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch suppliers' 
      });
    }
  },

  async getSupplier(req, res) {
    try {
      const supplier = await supplierService.getSupplierById(req.params.id);
      res.json({
        success: true,
        data: supplier
      });
    } catch (error) {
      console.error('Error fetching supplier:', error);
      res.status(404).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  async createSupplier(req, res) {
    try {
      const supplier = await supplierService.createSupplier(req.body);
      res.status(201).json({
        success: true,
        data: supplier,
        message: 'Supplier created successfully'
      });
    } catch (error) {
      console.error('Error creating supplier:', error);
      res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  async updateSupplier(req, res) {
    try {
      const supplier = await supplierService.updateSupplier(req.params.id, req.body);
      res.json({
        success: true,
        data: supplier,
        message: 'Supplier updated successfully'
      });
    } catch (error) {
      console.error('Error updating supplier:', error);
      res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  async deleteSupplier(req, res) {
    try {
      await supplierService.deleteSupplier(req.params.id);
      res.json({
        success: true,
        message: 'Supplier deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      res.status(400).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  async searchSuppliers(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }
      const suppliers = await supplierService.searchSuppliers(q);
      res.json({
        success: true,
        data: suppliers,
        count: suppliers.length
      });
    } catch (error) {
      console.error('Error searching suppliers:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to search suppliers' 
      });
    }
  }
};

module.exports = supplierController;