const Product = require('../models/productModel');

const productService = {
  async createProduct(productData) {
    try {
      console.log('Service: Creating product');
      const product = await Product.create(productData);
      return { success: true, product };
    } catch (error) {
      console.error('Service - Create Error:', error.message);
      return { 
        success: false, 
        error: error.message,
        code: error.code
      };
    }
  },

  async getAllProducts() {
    try {
      console.log('Service: Getting all products');
      const products = await Product.findAll();
      return { success: true, products };
    } catch (error) {
      console.error('Service - Get All Error:', error.message);
      return { 
        success: false, 
        error: error.message,
        code: error.code
      };
    }
  },

  async getProductById(id) {
    try {
      console.log('Service: Getting product by ID:', id);
      const product = await Product.findById(id);
      if (!product) {
        return { success: false, error: 'Product not found' };
      }
      return { success: true, product };
    } catch (error) {
      console.error('Service - Get By ID Error:', error.message);
      return { 
        success: false, 
        error: error.message,
        code: error.code
      };
    }
  },

  async updateProduct(id, productData) {
    try {
      console.log('Service: Updating product ID:', id);
      const product = await Product.update(id, productData);
      return { success: true, product };
    } catch (error) {
      console.error('Service - Update Error:', error.message);
      return { 
        success: false, 
        error: error.message,
        code: error.code
      };
    }
  },

  async deleteProduct(id) {
    try {
      console.log('Service: Deleting product ID:', id);
      await Product.delete(id);
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      console.error('Service - Delete Error:', error.message);
      return { 
        success: false, 
        error: error.message,
        code: error.code
      };
    }
  },

  async deleteAllProducts() {
    try {
      console.log('Service: Deleting all products');
      await Product.deleteAll();
      return { success: true, message: 'All products deleted successfully' };
    } catch (error) {
      console.error('Service - Delete All Error:', error.message);
      return { 
        success: false, 
        error: error.message,
        code: error.code
      };
    }
  }
};

module.exports = productService;