const prisma = require('../../config/prisma');

const productModel = {
  async getAllProducts() {
    try {
      console.log('Fetching all products from database...');
      const products = await prisma.product.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      console.log(`Found ${products.length} products in database`);
      return products;
    } catch (error) {
      console.error('Error in getAllProducts model:', error);
      throw error;
    }
  },

  async getProductById(id) {
    try {
      console.log(`Fetching product by ID: ${id}`);
      const product = await prisma.product.findUnique({
        where: { id }
      });
      console.log('Product found:', !!product);
      return product;
    } catch (error) {
      console.error('Error in getProductById model:', error);
      throw error;
    }
  },

  async createProduct(productData) {
    try {
      console.log('Creating product in database:', productData);
      
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          category: productData.category,
          price: productData.price,
          quantity: productData.quantity,
          description: productData.description,
          image: productData.image,
          status: productData.status,
          sales: productData.sales,
          sku: productData.sku,
          isActive: productData.isActive !== undefined ? productData.isActive : true
        }
      });
      
      console.log('Product created successfully:', product.id);
      return product;
    } catch (error) {
      console.error('Error in createProduct model:', error);
      throw error;
    }
  },

  async updateProduct(id, productData) {
    try {
      console.log(`Updating product ${id}:`, productData);
      
      const product = await prisma.product.update({
        where: { id },
        data: {
          name: productData.name,
          category: productData.category,
          price: productData.price,
          quantity: productData.quantity,
          description: productData.description,
          image: productData.image,
          status: productData.status
        }
      });
      
      console.log('Product updated successfully');
      return product;
    } catch (error) {
      console.error('Error in updateProduct model:', error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      console.log(`Deleting product ${id}`);
      
      const product = await prisma.product.delete({
        where: { id }
      });
      
      console.log('Product deleted successfully');
      return product;
    } catch (error) {
      console.error('Error in deleteProduct model:', error);
      throw error;
    }
  },

  async clearAllProducts() {
    try {
      console.log('Clearing all products...');
      
      const result = await prisma.product.deleteMany({});
      
      console.log(`Cleared ${result.count} products`);
      return result;
    } catch (error) {
      console.error('Error in clearAllProducts model:', error);
      throw error;
    }
  }
};

module.exports = productModel;