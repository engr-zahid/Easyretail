
import React, { useState } from 'react';

const OrderSidebar = ({ 
  orderItems, 
  onQuantityChange, 
  onRemoveItem, 
  orderSummary, 
  taxRate,
  discount,
  shipping,
  onDiscountChange,
  onShippingChange,
  onVoidOrder
}) => {
  const [customer, setCustomer] = useState('Walk in Customer');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const customers = [
    'Walk in Customer',
    'John Doe',
    'Jane Smith',
    'Robert Johnson',
    'Sarah Wilson'
  ];
  
  const taxOptions = [
    { label: 'No Tax', value: 0 },
    { label: 'GST 5%', value: 5 },
    { label: 'GST 10%', value: 10 },
    { label: 'GST 15%', value: 15 },
    { label: 'GST 20%', value: 20 }
  ];
  
  const shippingOptions = [
    { label: 'No Shipping', value: 0 },
    { label: 'Standard $15', value: 15 },
    { label: 'Express $25', value: 25 },
    { label: 'Priority $40', value: 40 }
  ];
  
  const discountOptions = [
    { label: 'No Discount', value: 0 },
    { label: '5% Off', value: orderSummary.subtotal * 0.05 },
    { label: '10% Off', value: orderSummary.subtotal * 0.10 },
    { label: '15% Off', value: orderSummary.subtotal * 0.15 },
    { label: '20% Off', value: orderSummary.subtotal * 0.20 }
  ];
  
  return (
    <div className="sticky top-6 h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-gray-800 
                    rounded-xl shadow-lg border border-border dark:border-gray-700 overflow-hidden">
      {/* Header - POS 2 Style */}
      <div className="p-6 bg-gradient-to-r from-accent-700 to-accent-800 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <span className="mr-2">🛒</span>
              Order List
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Transaction ID: #POS-{Date.now().toString().slice(-6)}
            </p>
          </div>
          <button
            onClick={onVoidOrder}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            title="Void Order"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {/* Customer Information - POS 2 Style */}
      <div className="p-6 border-b border-border dark:border-gray-700 bg-gradient-to-r from-secondary-50 to-white dark:from-gray-900 dark:to-gray-800">
        <h3 className="font-bold text-lg text-accent-800 dark:text-white mb-4 flex items-center">
          <span className="mr-2">👤</span>
          Customer Information
        </h3>
        
        <div className="space-y-4">
          {/* Customer Selector */}
          <div className="flex gap-2">
            <select 
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="flex-1 input-field"
            >
              {customers.map(cust => (
                <option key={cust} value={cust}>{cust}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCustomerModal(true)}
              className="btn-primary px-4"
            >
              <span className="mr-1">+</span> New
            </button>
          </div>
          
          {/* Search Products */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products to add..."
              className="input-field pl-10"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted dark:text-gray-500">
              🔍
            </span>
          </div>
        </div>
      </div>
      
      {/* Order Items - POS 2 Style */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-accent-800 dark:text-white flex items-center">
            <span className="mr-2">📦</span>
            Items in Cart
            <span className="ml-2 badge badge-info">{orderItems.length}</span>
          </h3>
          <button className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center">
            <span className="mr-1">🗑️</span>
            Clear All
          </button>
        </div>
        
        {orderItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-gray-300 dark:text-gray-600">🛒</div>
            <h3 className="text-xl font-semibold text-accent-700 dark:text-gray-400 mb-2">Empty Cart</h3>
            <p className="text-text-secondary dark:text-gray-500">Add products from the grid to start an order</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orderItems.map(item => (
              <div
                key={item.id}
                className="bg-gradient-to-r from-white to-muted-50 dark:from-gray-800 dark:to-gray-900 
                         rounded-xl border border-border dark:border-gray-700 p-4 
                         hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-50 to-secondary-100 
                                dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <span className="text-2xl">{item.image}</span>
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-accent-800 dark:text-white mb-1">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400">
                          <span>SKU: {item.sku}</span>
                          <span>•</span>
                          <span>${item.price.toFixed(2)} each</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 
                                 text-red-500 hover:text-red-600 dark:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => onQuantityChange(item.id, -1)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg 
                                   border border-border dark:border-gray-700 
                                   hover:bg-muted-100 dark:hover:bg-gray-700"
                        >
                          −
                        </button>
                        <span className="font-bold text-lg min-w-[36px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onQuantityChange(item.id, 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg 
                                   border border-border dark:border-gray-700 
                                   hover:bg-muted-100 dark:hover:bg-gray-700"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600 dark:text-amber-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-text-muted dark:text-gray-500">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Order Summary & Settings - POS 2 Style */}
      <div className="border-t border-border dark:border-gray-700 p-6 bg-gradient-to-r from-muted-100 to-muted-50 dark:from-gray-900 dark:to-gray-800">
        {/* Settings Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Tax Selector */}
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
              Tax
            </label>
            <select 
              className="w-full input-field py-2 text-sm"
              value={taxRate}
              onChange={(e) => {/* Handle tax change */}}
            >
              {taxOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Shipping Selector */}
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
              Shipping
            </label>
            <select 
              className="w-full input-field py-2 text-sm"
              value={shipping}
              onChange={(e) => onShippingChange(e.target.value)}
            >
              {shippingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Discount Selector */}
          <div>
            <label className="block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1">
              Discount
            </label>
            <select 
              className="w-full input-field py-2 text-sm"
              value={discount}
              onChange={(e) => onDiscountChange(parseFloat(e.target.value))}
            >
              {discountOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-border dark:border-gray-700 p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary dark:text-gray-400">Subtotal:</span>
              <span className="font-semibold">${orderSummary.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary dark:text-gray-400">Tax ({taxRate}%):</span>
              <span className="font-semibold">${orderSummary.tax.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary dark:text-gray-400">Shipping:</span>
              <span className="font-semibold">${orderSummary.shipping.toFixed(2)}</span>
            </div>
            
            {orderSummary.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-gray-400">Discount:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  -${orderSummary.discount.toFixed(2)}
                </span>
              </div>
            )}
            
            <div className="border-t border-border dark:border-gray-700 pt-3 mt-2">
              <div className="flex justify-between text-xl font-bold">
                <span className="text-accent-800 dark:text-white">Grand Total:</span>
                <span className="text-primary-600 dark:text-amber-400">
                  ${orderSummary.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Statistics */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-border dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-accent-800 dark:text-white">
              {orderSummary.itemCount}
            </div>
            <div className="text-sm text-text-secondary dark:text-gray-400">Total Items</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-border dark:border-gray-700 text-center">
            <div className="text-2xl font-bold text-accent-800 dark:text-white">
              {orderItems.length}
            </div>
            <div className="text-sm text-text-secondary dark:text-gray-400">Unique Items</div>
          </div>
        </div>
      </div>
      
      {/* Payment Methods - POS 2 Style */}
      <div className="p-6 border-t border-border dark:border-gray-700 bg-gradient-to-r from-accent-50 to-secondary-100 dark:from-gray-900 dark:to-gray-800">
        <h3 className="font-bold text-lg text-accent-800 dark:text-white mb-4 flex items-center">
          <span className="mr-2">💳</span>
          Payment Method
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 
                     border-border dark:border-gray-700 hover:border-primary-500 
                     dark:hover:border-amber-500 hover:shadow-md transition-all duration-200 
                     bg-white dark:bg-gray-800"
          >
            <span className="text-2xl mb-2">💰</span>
            <span className="font-medium">Cash</span>
          </button>
          
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 
                     border-border dark:border-gray-700 hover:border-primary-500 
                     dark:hover:border-amber-500 hover:shadow-md transition-all duration-200 
                     bg-white dark:bg-gray-800"
          >
            <span className="text-2xl mb-2">💳</span>
            <span className="font-medium">Card</span>
          </button>
          
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 
                     border-border dark:border-gray-700 hover:border-primary-500 
                     dark:hover:border-amber-500 hover:shadow-md transition-all duration-200 
                     bg-white dark:bg-gray-800"
          >
            <span className="text-2xl mb-2">📱</span>
            <span className="font-medium">Scan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSidebar;