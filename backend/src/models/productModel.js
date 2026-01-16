const prisma = require('../../config/prisma');

const Product = {
  async create(productData) {
    try {
      console.log('Model: Creating product with data:', productData);
      
      // Transform data - frontend sends 'stock', database has 'quantity'
      const transformedData = {
        name: productData.name,
        description: productData.description || '',
        price: parseFloat(productData.price) || 0,
        quantity: parseInt(productData.stock || productData.quantity) || 0, // Use quantity
        category: productData.category || 'Clothing',
        image: productData.image || '📦',
        status: productData.status || 'in-stock',
        sales: parseInt(productData.sales) || 0,
        sku: productData.sku || `SKU-${Date.now()}`,
        isActive: productData.isActive !== undefined ? productData.isActive : true
      };

      console.log('Model: Transformed data for DB:', transformedData);

      const product = await prisma.product.create({
        data: transformedData
      });
      
      // Add stock field for frontend compatibility
      return {
        ...product,
        stock: product.quantity
      };
    } catch (error) {
      console.error('Model - Create Error:', error);
      throw error;
    }
  },

  async findAll() {
    try {
      console.log('Model: Finding all products');
      const products = await prisma.product.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log(`Model: Found ${products.length} products`);
      
      // Add stock field for frontend compatibility
      return products.map(product => ({
        ...product,
        stock: product.quantity
      }));
    } catch (error) {
      console.error('Model - Find All Error:', error);
      throw error;
    }
  },

  async findById(id) {
    try {
      console.log('Model: Finding product by ID:', id);
      const product = await prisma.product.findUnique({
        where: { id }
      });
      
      if (product) {
        // Add stock field for frontend compatibility
        return {
          ...product,
          stock: product.quantity
        };
      }
      console.log('Model: Product not found for ID:', id);
      return null;
    } catch (error) {
      console.error('Model - Find By ID Error:', error);
      throw error;
    }
  },

  async update(id, productData) {
    try {
      console.log('Model: Updating product ID:', id, 'with data:', productData);
      
      // Prepare update data
      const updateData = {};
      
      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.description !== undefined) updateData.description = productData.description;
      if (productData.price !== undefined) updateData.price = parseFloat(productData.price) || 0;
      if (productData.stock !== undefined || productData.quantity !== undefined) {
        // Frontend sends 'stock', database has 'quantity'
        updateData.quantity = parseInt(productData.stock || productData.quantity) || 0;
      }
      if (productData.category !== undefined) updateData.category = productData.category;
      if (productData.image !== undefined) updateData.image = productData.image;
      if (productData.status !== undefined) updateData.status = productData.status;
      if (productData.sales !== undefined) updateData.sales = parseInt(productData.sales) || 0;
      if (productData.isActive !== undefined) updateData.isActive = productData.isActive;

      console.log('Model: Update data for DB:', updateData);

      const product = await prisma.product.update({
        where: { id },
        data: updateData
      });
      
      // Add stock field for frontend compatibility
      return {
        ...product,
        stock: product.quantity
      };
    } catch (error) {
      console.error('Model - Update Error:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      console.log('Model: Deleting product ID:', id);
      await prisma.product.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Model - Delete Error:', error);
      throw error;
    }
  },

  async deleteAll() {
    try {
      console.log('Model: Deleting all products');
      await prisma.product.deleteMany({});
      return true;
    } catch (error) {
      console.error('Model - Delete All Error:', error);
      throw error;
    }
  }
};

module.exports = Product;