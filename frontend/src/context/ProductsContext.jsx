import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('pos-products');
    if (savedProducts) {
      const parsed = JSON.parse(savedProducts);
      // Migrate old products to have isActive field and reset dummy sales
      return parsed.map(p => ({
        ...p,
        isActive: p.isActive !== undefined ? p.isActive : true, // Default to active
        sales: typeof p.sales === 'number' ? p.sales : 0, // Ensure sales is a number
        status: p.status || (p.stock > 20 ? 'in-stock' : p.stock > 5 ? 'low-stock' : 'out-of-stock')
      }));
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);

  // Save to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('pos-products', JSON.stringify(products));
  }, [products]);

  // Add a new product
  const addProduct = useCallback((productData) => {
    setIsLoading(true);
    
    // Generate unique ID and SKU
    const newId = `PROD-${String(products.length + 1).padStart(3, '0')}`;
    const newSku = `SKU-${String(products.length + 1).padStart(3, '0')}`;
    
    const stockNum = parseInt(productData.stock) || 0;
    
    const newProduct = {
      id: newId,
      name: productData.name,
      category: productData.category || 'Clothing',
      price: parseFloat(productData.price) || 0,
      stock: stockNum,
      status: stockNum > 20 ? 'in-stock' : 
               stockNum > 5 ? 'low-stock' : 'out-of-stock',
      isActive: true, // CRITICAL: Always active by default
      sales: 0, // ✅ REAL DATA: Start with 0 sales
      description: productData.description || 'No description available.',
      sku: newSku,
      image: productData.image || '📦',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setProducts(prev => {
      const updatedProducts = [...prev, newProduct];
      return updatedProducts;
    });
    
    setIsLoading(false);
    return newProduct;
  }, [products.length]);

  // Update an existing product
  const updateProduct = useCallback((productId, updatedData) => {
    setIsLoading(true);
    
    setProducts(prev => {
      const updatedProducts = prev.map(product => {
        if (product.id === productId) {
          const updatedStock = updatedData.stock !== undefined ? parseInt(updatedData.stock) : product.stock;
          const updatedIsActive = updatedData.isActive !== undefined ? updatedData.isActive : product.isActive;
          
          return {
            ...product,
            ...updatedData,
            stock: updatedStock,
            status: updatedStock > 20 ? 'in-stock' : 
                    updatedStock > 5 ? 'low-stock' : 'out-of-stock',
            isActive: updatedIsActive,
            updatedAt: new Date().toISOString(),
            price: updatedData.price !== undefined ? parseFloat(updatedData.price) : product.price
          };
        }
        return product;
      });
      return updatedProducts;
    });
    
    setIsLoading(false);
  }, []);

  // Delete a product
  const deleteProduct = useCallback((productId) => {
    setIsLoading(true);
    setProducts(prev => prev.filter(product => product.id !== productId));
    setIsLoading(false);
  }, []);

  // Toggle product active status
  const toggleProductActive = useCallback((productId) => {
    setIsLoading(true);
    
    setProducts(prev => {
      return prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            isActive: !product.isActive,
            updatedAt: new Date().toISOString()
          };
        }
        return product;
      });
    });
    
    setIsLoading(false);
  }, []);

  // Get products for POS (only active ones)
  const getPOSProducts = useMemo(() => {
    return products.filter(product => product.isActive === true);
  }, [products]);

  // Get products for admin (all products)
  const getAdminProducts = useMemo(() => {
    return products;
  }, [products]);

  // Clear all products
  const clearAllProducts = useCallback(() => {
    setIsLoading(true);
    setProducts([]);
    setIsLoading(false);
  }, []);

  // Get product by ID
  const getProductById = useCallback((productId) => {
    return products.find(product => product.id === productId);
  }, [products]);

  // Get products by category
  const getProductsByCategory = useCallback((category) => {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
  }, [products]);

  // Search products
  const searchProducts = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.id.toLowerCase().includes(lowerQuery) ||
      product.sku.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    );
  }, [products]);

  // Get product statistics
  const getProductStats = useMemo(() => {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isActive).length;
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const totalSales = products.reduce((sum, product) => sum + (product.sales || 0), 0);
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    
    const categories = [...new Set(products.map(p => p.category))];
    const categoryStats = categories.map(category => {
      const categoryProducts = products.filter(p => p.category === category);
      return {
        name: category,
        count: categoryProducts.length,
        stock: categoryProducts.reduce((sum, p) => sum + p.stock, 0),
        value: categoryProducts.reduce((sum, p) => sum + (p.price * p.stock), 0),
        sales: categoryProducts.reduce((sum, p) => sum + (p.sales || 0), 0)
      };
    });
    
    const statusStats = {
      'in-stock': products.filter(p => p.status === 'in-stock').length,
      'low-stock': products.filter(p => p.status === 'low-stock').length,
      'out-of-stock': products.filter(p => p.status === 'out-of-stock').length
    };
    
    return {
      totalProducts,
      activeProducts,
      totalStock,
      totalSales,
      totalValue: parseFloat(totalValue.toFixed(2)),
      averagePrice: totalProducts > 0 ? parseFloat((products.reduce((sum, p) => sum + p.price, 0) / totalProducts).toFixed(2)) : 0,
      categories: categoryStats,
      status: statusStats
    };
  }, [products]);

  // Get unique categories
  const getCategories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories;
  }, [products]);

  // Import products from JSON
  const importProducts = useCallback((importedProducts) => {
    setIsLoading(true);
    
    const newProducts = importedProducts.map((product, index) => {
      const stockNum = parseInt(product.stock) || 0;
      
      return {
        id: product.id || `PROD-${String(products.length + index + 1).padStart(3, '0')}`,
        name: product.name,
        category: product.category || 'Clothing',
        price: parseFloat(product.price) || 0,
        stock: stockNum,
        status: stockNum > 20 ? 'in-stock' : 
                 stockNum > 5 ? 'low-stock' : 'out-of-stock',
        isActive: product.isActive !== undefined ? product.isActive : true,
        sales: typeof product.sales === 'number' ? product.sales : 0, // ✅ Use actual sales from import or 0
        description: product.description || 'No description available.',
        sku: product.sku || `SKU-${String(products.length + index + 1).padStart(3, '0')}`,
        image: product.image || '📦',
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });
    
    setProducts(prev => [...prev, ...newProducts]);
    setIsLoading(false);
    return newProducts;
  }, [products.length]);

  // Export products to JSON
  const exportProducts = useCallback(() => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return products;
  }, [products]);

  // Update stock after sale (for POS checkout) - REAL SALES TRACKING
  const updateStockAfterSale = useCallback((soldItems) => {
    setIsLoading(true);
    
    setProducts(prev => {
      return prev.map(product => {
        const soldItem = soldItems.find(item => item.id === product.id);
        if (soldItem) {
          const newStock = product.stock - soldItem.quantity;
          return {
            ...product,
            stock: Math.max(0, newStock),
            status: newStock > 20 ? 'in-stock' : 
                    newStock > 5 ? 'low-stock' : 'out-of-stock',
            sales: (product.sales || 0) + soldItem.quantity, // ✅ REAL DATA: Add actual quantity sold
            updatedAt: new Date().toISOString()
          };
        }
        return product;
      });
    });
    
    setIsLoading(false);
  }, []);

  // Get low stock products (less than 10 items)
  const getLowStockProducts = useMemo(() => {
    return products.filter(product => product.stock < 10);
  }, [products]);

  // Get out of stock products
  const getOutOfStockProducts = useMemo(() => {
    return products.filter(product => product.stock === 0);
  }, [products]);

  // Bulk update products
  const bulkUpdateProducts = useCallback((updates) => {
    setIsLoading(true);
    
    setProducts(prev => {
      return prev.map(product => {
        const update = updates.find(u => u.id === product.id);
        if (update) {
          const updatedStock = update.stock !== undefined ? parseInt(update.stock) : product.stock;
          
          return {
            ...product,
            ...update,
            stock: updatedStock,
            status: updatedStock > 20 ? 'in-stock' : 
                    updatedStock > 5 ? 'low-stock' : 'out-of-stock',
            updatedAt: new Date().toISOString(),
            price: update.price !== undefined ? parseFloat(update.price) : product.price
          };
        }
        return product;
      });
    });
    
    setIsLoading(false);
  }, []);

  // Reset to demo data
  const resetToDemoData = useCallback(() => {
    const demoProducts = [
      { id: 'PROD-001', name: 'IPhone 14 64GB', category: 'Electronics', price: 15800, stock: 30, image: '📱', sku: 'SKU-001' },
      { id: 'PROD-002', name: 'MacBook Pro', category: 'Electronics', price: 1000, stock: 140, image: '💻', sku: 'SKU-002' },
      { id: 'PROD-003', name: 'Rolex Tribute V3', category: 'Accessories', price: 6800, stock: 220, image: '⌚', sku: 'SKU-003' },
      { id: 'PROD-004', name: 'Red Nike Angelo', category: 'Clothing', price: 7800, stock: 78, image: '👟', sku: 'SKU-004' },
      { id: 'PROD-005', name: 'Airpod 2', category: 'Electronics', price: 5478, stock: 47, image: '🎧', sku: 'SKU-005' },
    ];
    
    setProducts(demoProducts.map(product => {
      const stockNum = product.stock || 0;
      return {
        ...product,
        status: stockNum > 20 ? 'in-stock' : 
                stockNum > 5 ? 'low-stock' : 'out-of-stock',
        isActive: true,
        sales: 0,
        description: 'High quality product with excellent performance.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }));
  }, []);

  const value = useMemo(() => ({
    // State
    products,
    isLoading,
    
    // Actions
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    toggleProductActive,
    
    // Getters
    getProductById,
    getProductsByCategory,
    searchProducts,
    getProductStats,
    getCategories,
    getLowStockProducts,
    getOutOfStockProducts,
    
    // POS Functions
    updateStockAfterSale,
    
    // Bulk operations
    bulkUpdateProducts,
    
    // Demo data
    resetToDemoData,
    
    // POS-specific getters
    getPOSProducts,
    getAdminProducts,
    
    // Import/Export
    importProducts,
    exportProducts,
    
    // Raw setter (use with caution)
    setProducts
  }), [
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    toggleProductActive,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getProductStats,
    getCategories,
    getLowStockProducts,
    getOutOfStockProducts,
    updateStockAfterSale,
    bulkUpdateProducts,
    resetToDemoData,
    getPOSProducts,
    getAdminProducts,
    importProducts,
    exportProducts
  ]);

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};