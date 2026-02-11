const productModel = require('../models/productModel');

const productService = {
  async getAllProducts() {
    try {
      return await productModel.getAllProducts();
    } catch (error) {
      console.error('Error in productService.getAllProducts:', error);
      throw new Error(`Error fetching products: ${error.message}`);
    }
  },

  async getProductById(id) {
    try {
      const product = await productModel.getProductById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (error) {
      console.error('Error in productService.getProductById:', error);
      throw new Error(`Error fetching product: ${error.message}`);
    }
  },

  async createProduct(productData) {
    try {
      console.log('productService.createProduct called with:', productData);
      
      // Validate required fields
      if (!productData.name || !productData.price) {
        throw new Error('Product name and price are required');
      }

      if (productData.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      if (productData.quantity < 0) {
        throw new Error('Quantity cannot be negative');
      }

      return await productModel.createProduct(productData);
    } catch (error) {
      console.error('Error in productService.createProduct:', error);
      throw new Error(`Error creating product: ${error.message}`);
    }
  },

  async updateProduct(id, productData) {
    try {
      const product = await productModel.getProductById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return await productModel.updateProduct(id, productData);
    } catch (error) {
      console.error('Error in productService.updateProduct:', error);
      throw new Error(`Error updating product: ${error.message}`);
    }
  },

  async deleteProduct(id) {
    try {
      const product = await productModel.getProductById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return await productModel.deleteProduct(id);
    } catch (error) {
      console.error('Error in productService.deleteProduct:', error);
      throw new Error(`Error deleting product: ${error.message}`);
    }
  },

  async clearAllProducts() {
    try {
      return await productModel.clearAllProducts();
    } catch (error) {
      console.error('Error in productService.clearAllProducts:', error);
      throw new Error(`Error clearing products: ${error.message}`);
    }
  }
};

module.exports = productService;