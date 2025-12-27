import React, { useState, useMemo } from 'react';
import OrderSidebar from './OrderSidebar';
import CategorySidebar from './CategorySidebar';
import ProductGrid from './ProductGrid';
import ActionBottomBar from './ActionBottomBar';
import { useProducts } from '../../context/ProductsContext';

const POSContainer = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderItems, setOrderItems] = useState([]);
  const [taxRate] = useState(5); // 5% tax
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use products from context - ADD updateStockAfterSale
  const { products, getCategories, updateStockAfterSale } = useProducts();
  
  // Create categories from actual products
  const categories = useMemo(() => {
    const categoryCounts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    
    const categoryIcons = {
      'Clothing': '👕',
      'Electronics': '📱',
      'Accessories': '👓',
      'Food': '🍕',
      'Fitness': '💪',
      'all': '📦'
    };
    
    const categoryColors = {
      'Clothing': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'Electronics': 'bg-gradient-to-r from-purple-500 to-purple-600',
      'Accessories': 'bg-gradient-to-r from-green-500 to-green-600',
      'Food': 'bg-gradient-to-r from-amber-500 to-amber-600',
      'Fitness': 'bg-gradient-to-r from-red-500 to-red-600',
      'all': 'bg-gradient-to-r from-accent-600 to-accent-700'
    };
    
    const allCategories = [
      { 
        id: 'all', 
        name: 'All Products', 
        icon: '📦', 
        color: 'bg-gradient-to-r from-accent-600 to-accent-700', 
        count: products.length 
      },
      ...Object.entries(categoryCounts).map(([category, count]) => ({
        id: category.toLowerCase(),
        name: category,
        icon: categoryIcons[category] || '📦',
        color: categoryColors[category] || 'bg-gradient-to-r from-gray-500 to-gray-600',
        count
      }))
    ];
    
    return allCategories;
  }, [products]);
  
  // Filter products based on selected category and search - ONLY ACTIVE PRODUCTS
  const filteredProducts = useMemo(() => {
    // Get only active products for POS
    const activeProducts = products.filter(product => product.isActive === true);
    
    let filtered = activeProducts;
    
    if (selectedCategory !== 'all') {
      const categoryName = categories.find(c => c.id === selectedCategory)?.name;
      filtered = filtered.filter(product => product.category === categoryName);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.map(product => ({
      ...product,
      image: product.image || '📦',
      sku: product.sku || product.id,
      price: typeof product.price === 'number' ? product.price : parseFloat(product.price.toString().replace('$', '')),
      stock: product.stock || 0
    }));
  }, [products, selectedCategory, searchTerm, categories]);
  
  // Calculate order totals
  const orderSummary = useMemo(() => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + tax + shipping - discount;
    
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      itemCount: orderItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  }, [orderItems, taxRate, discount, shipping]);
  
  // Handle product selection
  const handleAddToOrder = (product) => {
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if product already in order
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new product to order
        return [...prev, {
          ...product,
          quantity: 1,
          total: product.price
        }];
      }
    });
  };
  
  // Handle quantity changes
  const handleQuantityChange = (productId, change) => {
    setOrderItems(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };
  
  // Handle item removal
  const handleRemoveItem = (productId) => {
    setOrderItems(prev => prev.filter(item => item.id !== productId));
  };
  
  // Clear entire order
  const handleClearOrder = () => {
    setOrderItems([]);
    setDiscount(0);
    setShipping(0);
  };
  
  // Handle checkout - UPDATED to track actual sales
  const handleCheckout = () => {
    if (orderItems.length === 0) {
      alert('Please add items to the order first.');
      return;
    }
    
    // Update product sales with actual sold quantities
    updateStockAfterSale(orderItems);
    
    // Show success message
    alert(`Order completed! Total: $${orderSummary.grandTotal}\nItems: ${orderSummary.itemCount}`);
    
    // Clear the order
    handleClearOrder();
  };
  
  // Handle hold order
  const handleHoldOrder = () => {
    if (orderItems.length === 0) {
      alert('No items to hold.');
      return;
    }
    
    // In production, this would save to database
    alert(`Order held with ${orderItems.length} items. Total: $${orderSummary.grandTotal}`);
  };
  
  // Handle void order
  const handleVoidOrder = () => {
    if (orderItems.length === 0) {
      alert('No order to void.');
      return;
    }
    
    if (window.confirm('Are you sure you want to void this order?')) {
      handleClearOrder();
    }
  };
  
  // Handle shipping change
  const handleShippingChange = (value) => {
    setShipping(parseFloat(value) || 0);
  };
  
  return (
    <div className="min-h-screen bg-background-subtle dark:bg-gradient-dark">
      {/* Header - POS 2 Style */}
      <header className="bg-gradient-to-r from-accent-700 to-accent-800 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between py-4">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-white/20 p-2 rounded-lg">
                <span className="text-2xl">🛒</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dreams POS 2</h1>
                <p className="text-white/80 text-sm">Professional Retail System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-sm opacity-80">Current Session</p>
                <p className="font-semibold">#POS-002-{Date.now().toString().slice(-6)}</p>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg">
                <span className="text-lg">⏰</span>
                <span className="font-mono">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Quick Action Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-border dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between py-3 gap-2">
            <div className="flex items-center space-x-3">
              <button className="btn-primary flex items-center">
                <span className="mr-2">📋</span> View Orders
              </button>
              <button className="btn-secondary flex items-center">
                <span className="mr-2">🔄</span> Reset
              </button>
              <button className="btn-secondary flex items-center">
                <span className="mr-2">📊</span> Transaction
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 pr-4 py-2"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted">
                  🔍
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main POS Interface - POS 2 Layout */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Categories (POS 2 Horizontal Layout) */}
          <div className="lg:col-span-12 mb-6">
            <CategorySidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          
          {/* Middle Column - Products (POS 2 Full Width) */}
          <div className="lg:col-span-8">
            <ProductGrid
              products={filteredProducts}
              onAddToOrder={handleAddToOrder}
              selectedCategory={selectedCategory}
            />
          </div>
          
          {/* Right Column - Order Summary (POS 2 Sidebar) */}
          <div className="lg:col-span-4">
            <OrderSidebar
              orderItems={orderItems}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
              orderSummary={orderSummary}
              taxRate={taxRate}
              discount={discount}
              shipping={shipping}
              onDiscountChange={setDiscount}
              onShippingChange={handleShippingChange}
              onVoidOrder={handleVoidOrder}
            />
          </div>
        </div>
      </main>
      
      {/* Bottom Action Bar - POS 2 Style */}
      <ActionBottomBar
        orderSummary={orderSummary}
        onClearOrder={handleClearOrder}
        onHoldOrder={handleHoldOrder}
        onCheckout={handleCheckout}
        onVoidOrder={handleVoidOrder}
        discount={discount}
        shipping={shipping}
        onDiscountChange={setDiscount}
        onShippingChange={handleShippingChange}
      />
    </div>
  );
};

export default POSContainer;