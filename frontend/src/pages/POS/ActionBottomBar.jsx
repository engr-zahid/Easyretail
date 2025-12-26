import React, { useState } from 'react';

const ActionBottomBar = ({ 
  orderSummary, 
  onClearOrder, 
  onHoldOrder, 
  onCheckout,
  onVoidOrder,
  discount,
  shipping,
  onDiscountChange,
  onShippingChange
}) => {
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [holdReference, setHoldReference] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [receivedAmount, setReceivedAmount] = useState('');
  
  const quickCashOptions = [10, 20, 50, 100, 500, 1000];
  
  const calculateChange = () => {
    const received = parseFloat(receivedAmount) || 0;
    return Math.max(0, received - orderSummary.grandTotal);
  };
  
  const handleHoldSubmit = (e) => {
    e.preventDefault();
    onHoldOrder();
    setShowHoldModal(false);
    setHoldReference('');
  };
  
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    onCheckout();
    setShowPaymentModal(false);
    setReceivedAmount('');
  };
  
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 shadow-2xl z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between py-4 gap-4">
          {/* Totals Display */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Items</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {orderSummary.itemCount}
                </p>
              </div>
              
              <div className="hidden md:block text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Subtotal</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ${orderSummary.subtotal.toFixed(2)}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Grand Total</p>
                <p className="text-4xl font-bold text-blue-600 dark:text-amber-400">
                  ${orderSummary.grandTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Hold Button */}
            <button
              onClick={() => setShowHoldModal(true)}
              disabled={orderSummary.itemCount === 0}
              className={`
                flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200
                ${orderSummary.itemCount === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:shadow-lg'
                }
              `}
            >
              <span className="mr-2">⏸️</span>
              Hold
            </button>
            
            {/* Void Button */}
            <button
              onClick={onVoidOrder}
              disabled={orderSummary.itemCount === 0}
              className={`
                flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200
                ${orderSummary.itemCount === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-lg'
                }
              `}
            >
              <span className="mr-2">🗑️</span>
              Void
            </button>
            
            {/* Checkout Button - FIXED VISIBILITY */}
            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={orderSummary.itemCount === 0}
              className={`
                flex items-center px-8 py-3 rounded-xl font-bold transition-all duration-200
                ${orderSummary.itemCount === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] shadow-lg'
                }
              `}
            >
              <span className="mr-2">💳</span>
              CHECKOUT
              <span className="ml-3 text-sm font-normal bg-white/30 px-3 py-1 rounded-full">
                ${orderSummary.grandTotal.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm px-4 py-3 rounded-b-lg 
                       flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-4">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              System Ready • POS 2 Active
            </span>
            <span className="hidden md:inline">Session: #POS-002 • Cashier: Admin</span>
          </div>
          <div className="text-white/80">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
      
      {/* Hold Order Modal */}
      {showHoldModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Hold Order</h3>
              <button
                onClick={() => setShowHoldModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleHoldSubmit}>
              <div className="mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 
                              p-6 rounded-xl text-center mb-4">
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                    ${orderSummary.grandTotal.toFixed(2)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Total Amount</p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order Reference
                  </label>
                  <input
                    type="text"
                    value={holdReference}
                    onChange={(e) => setHoldReference(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    placeholder="Enter reference (e.g., Table 5)"
                    required
                  />
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The current order will be set on hold. You can retrieve this order from the pending orders. 
                  Providing a reference helps identify the order quickly.
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowHoldModal(false)}
                  className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Confirm Hold
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Finalize Sale</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handlePaymentSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Received Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total Due
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={orderSummary.grandTotal.toFixed(2)}
                      readOnly
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Change
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="text"
                      value={calculateChange().toFixed(2)}
                      readOnly
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              
              {/* Quick Cash */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Quick Cash
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickCashOptions.map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setReceivedAmount(amount.toString())}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               hover:border-blue-500 dark:hover:border-blue-500 
                               hover:bg-blue-50 dark:hover:bg-blue-900/20 
                               text-gray-700 dark:text-gray-300 transition-all duration-200"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['cash', 'card', 'scan'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`
                        p-4 rounded-xl border-2 text-center transition-all duration-200
                        ${paymentMethod === method
                          ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                        }
                      `}
                    >
                      <div className="text-2xl mb-2">
                        {method === 'cash' && '💰'}
                        {method === 'card' && '💳'}
                        {method === 'scan' && '📱'}
                      </div>
                      <div className="font-medium capitalize text-gray-900 dark:text-white">{method}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Complete Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionBottomBar;