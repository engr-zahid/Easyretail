const productService = require('../services/productService');

const productController = {
  async createProduct(req, res) {
    try {
      console.log('Controller: Creating product with data:', req.body);
      const productData = { ...req.body };

      // Handle image upload
      if (req.file) {
        // File was uploaded - store the file path
        productData.image = `/uploads/products/${req.file.filename}`;
        console.log('Image uploaded:', req.file.filename);
      } else {
        // No file uploaded - use emoji or default from body
        productData.image = productData.image || '📦';
        console.log('Using default/emoji image:', productData.image);
      }

      const result = await productService.createProduct(productData);

      if (result.success) {
        res.status(201).json({
          success: true,
          message: 'Product created successfully',
          product: result.product
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.error,
          code: result.code
        });
      }
    } catch (error) {
      console.error('Controller - Create Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  async getProducts(req, res) {
    try {
      console.log('Controller: Getting all products');
      const result = await productService.getAllProducts();
      
      if (result.success) {
        res.status(200).json({
          success: true,
          count: result.products.length,
          products: result.products
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.error,
          code: result.code
        });
      }
    } catch (error) {
      console.error('Controller - Get Products Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  async getProduct(req, res) {
    try {
      const { id } = req.params;
      console.log('Controller: Getting product:', id);
      const result = await productService.getProductById(id);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          product: result.product
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.error,
          code: result.code
        });
      }
    } catch (error) {
      console.error('Controller - Get Product Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = { ...req.body };
      console.log('Controller: Updating product:', id, 'with:', productData);

      // Handle image upload for updates
      if (req.file) {
        // File was uploaded - store the file path
        productData.image = `/uploads/products/${req.file.filename}`;
        console.log('Image updated:', req.file.filename);
      }
      // If no file uploaded, keep existing image or use emoji/default

      const result = await productService.updateProduct(id, productData);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: 'Product updated successfully',
          product: result.product
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.error,
          code: result.code
        });
      }
    } catch (error) {
      console.error('Controller - Update Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      console.log('Controller: Deleting product:', id);
      const result = await productService.deleteProduct(id);
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.error,
          code: result.code
        });
      }
    } catch (error) {
      console.error('Controller - Delete Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  async deleteAllProducts(req, res) {
    try {
      console.log('Controller: Deleting all products');
      const result = await productService.deleteAllProducts();
      
      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.error,
          code: result.code
        });
      }
    } catch (error) {
      console.error('Controller - Delete All Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = productController;