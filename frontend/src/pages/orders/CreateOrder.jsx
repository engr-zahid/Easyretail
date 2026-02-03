import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  X, 
  Search, 
  User,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useDarkMode } from '../../context/DarkModeContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../utils/api';

const CreateOrder = () => {
  const { isDarkMode } = useDarkMode();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const searchRef = useRef(null);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, {
          productId: product.id,
          productName: product.name,
          price: parseFloat(product.price),
          quantity: 1,
          stock: product.stock,
          image: product.image
        }];
      }
    });
    setSearchTerm('');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const product = cart.find(item => item.productId === productId);
    if (product && newQuantity > product.stock) {
      alert(`Only ${product.stock} items available in stock`);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      alert('Please add at least one product to the order');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerId: selectedCustomer?.id || null,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price.toString(),
        })),
        status: 'PENDING',
        notes,
        paymentMethod,
      };

      const response = await api.post('/orders', orderData);
      
      // Reset form
      setCart([]);
      setSelectedCustomer(null);
      setNotes('');
      setPaymentMethod('CASH');
      
      alert('Order created successfully!');
      window.location.href = `/orders/${response.data.data.id}`;
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New Order
          </h1>
          <p className="text-gray-500 mt-2">
            Add products to cart and complete the order
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Products */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            {/* Search Bar */}
            <motion.div variants={itemVariants}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  ref={searchRef}
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-700 hover:border-blue-500' 
                          : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg'
                      }`}
                      onClick={() => addToCart(product)}
                    >
                      <div className="aspect-square rounded-lg mb-3 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingBag className="w-12 h-12 text-blue-500" />
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-green-600">
                        ${parseFloat(product.price).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Stock: {product.stock}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Cart & Summary */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Customer Selection */}
            <motion.div variants={itemVariants}>
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Customer</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCustomerModal(true)}
                  >
                    {selectedCustomer ? 'Change' : 'Select'}
                  </Button>
                </div>
                
                {selectedCustomer ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-700">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedCustomer.name}</p>
                      <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <User className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No customer selected</p>
                    <p className="text-sm text-gray-400">Walk-in customer</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Cart Items */}
            <motion.div variants={itemVariants}>
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <h3 className="font-semibold mb-4">Order Items ({cart.length})</h3>
                
                <AnimatePresence>
                  {cart.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">Your cart is empty</p>
                      <p className="text-sm text-gray-400">Add products from the left</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {cart.map((item) => (
                        <motion.div
                          key={item.productId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-700"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{item.productName}</p>
                              <p className="text-green-600 font-bold">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div variants={itemVariants}>
              <div className={`p-4 rounded-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <h3 className="font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span className="font-medium">${calculateTax().toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-600">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-3">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['CASH', 'CARD', 'UPI', 'BANK_TRANSFER'].map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 rounded-lg border text-center transition-all ${
                          paymentMethod === method
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
                            : isDarkMode
                            ? 'border-gray-700 hover:border-gray-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {method.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-3">Order Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="3"
                    className={`w-full p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                    placeholder="Add any special instructions..."
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={cart.length === 0 || loading}
                  className="w-full mt-6 py-3 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Complete Order (${calculateTotal().toFixed(2)})
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Customer Selection Modal */}
      <Modal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        title="Select Customer"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search customers..."
            className="mb-4"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                  setShowCustomerModal(false);
                }}
                className={`w-full p-4 rounded-lg text-left border ${
                  !selectedCustomer
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : isDarkMode
                    ? 'border-gray-700 hover:border-gray-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Walk-in Customer</p>
                    <p className="text-sm text-gray-500">No customer account</p>
                  </div>
                </div>
              </button>
              
              {customers.map(customer => (
                <button
                  key={customer.id}
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setShowCustomerModal(false);
                  }}
                  className={`w-full p-4 rounded-lg text-left border ${
                    selectedCustomer?.id === customer.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isDarkMode
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                      <p className="text-xs text-gray-400">{customer.email}</p>
                    </div>
                    {selectedCustomer?.id === customer.id && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowCustomerModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default CreateOrder;