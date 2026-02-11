const productService = require('../services/productService');

const productController = {
  async getAllProducts(req, res) {
    try {
      console.log('Fetching all products...');
      const products = await productService.getAllProducts();
      console.log(`Found ${products.length} products`);
      
      res.json({
        success: true,
        products: products || [],
        count: products?.length || 0
      });
    } catch (error) {
      console.error('Error in getAllProducts controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      res.json({
        success: true,
        product
      });
    } catch (error) {
      console.error('Error in getProductById controller:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch product'
      });
    }
  },

  async createProduct(req, res) {
    try {
      console.log('Create product request received');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      
      // Handle image upload
      let image = '📦';
      if (req.file) {
        image = `/uploads/products/${req.file.filename}`;
        console.log('Image uploaded:', image);
      } else if (req.body.image && req.body.image !== '📦') {
        image = req.body.image;
      }

      // Prepare product data
      const productData = {
        name: req.body.name?.trim(),
        category: req.body.category || 'Clothing',
        price: parseFloat(req.body.price) || 0,
        quantity: parseInt(req.body.quantity || req.body.stock || 0),
        description: req.body.description?.trim() || '',
        image: image,
        status: req.body.status || 'in-stock',
        sales: parseInt(req.body.sales) || 0,
        sku: req.body.sku || `SKU-${Date.now()}`
      };

      console.log('Creating product with data:', productData);
      
      // Validate required fields
      if (!productData.name) {
        return res.status(400).json({
          success: false,
          message: 'Product name is required'
        });
      }

      if (productData.price <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Product price must be greater than 0'
        });
      }

      const product = await productService.createProduct(productData);
      
      res.status(201).json({
        success: true,
        product,
        message: 'Product created successfully'
      });
    } catch (error) {
      console.error('Error in createProduct controller:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create product',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  async updateProduct(req, res) {
    try {
      let image = req.body.image;
      if (req.file) {
        image = `/uploads/products/${req.file.filename}`;
      }

      const productData = {
        name: req.body.name?.trim(),
        category: req.body.category,
        price: parseFloat(req.body.price) || 0,
        quantity: parseInt(req.body.quantity || req.body.stock || 0),
        description: req.body.description?.trim(),
        image: image || '📦',
        status: req.body.status
      };

      const product = await productService.updateProduct(req.params.id, productData);
      res.json({
        success: true,
        product,
        message: 'Product updated successfully'
      });
    } catch (error) {
      console.error('Error in updateProduct controller:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update product'
      });
    }
  },

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteProduct controller:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete product'
      });
    }
  },

  async clearAllProducts(req, res) {
    try {
      await productService.clearAllProducts();
      res.json({
        success: true,
        message: 'All products cleared successfully'
      });
    } catch (error) {
      console.error('Error in clearAllProducts controller:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to clear products'
      });
    }
  }
};

module.exports = productController;