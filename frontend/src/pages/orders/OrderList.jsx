import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Search, 
  Eye, 
  Trash2, 
  CheckCircle,
  XCircle,
  Clock,
  Package,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Plus,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  Sparkles,
  Loader2,
  FileText,
  User,
  Calendar,
  X as XIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const OrderList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [paymentFilter, setPaymentFilter] = useState('All Payments');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  // Real data state
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  // New order state
  const [newOrder, setNewOrder] = useState({
    customerId: '',
    items: [],
    paymentMethod: 'CASH',
    notes: ''
  });
  
  // Current item being added
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: 1
  });
  
  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';
  
  // Stats state
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });

 const fetchData = async () => {
  try {
    setIsLoading(true);
    console.log('📡 Fetching ALL data from backend...');
    
    // Fetch orders FIRST to debug
    try {
      console.log(`📋 Fetching orders from: ${API_BASE_URL}/orders`);
      const ordersRes = await axios.get(`${API_BASE_URL}/orders`);
      console.log('📦 Orders API raw response:', ordersRes.data);
      
      let ordersData = [];
      
      if (ordersRes.data.success && ordersRes.data.orders) {
        ordersData = ordersRes.data.orders;
        console.log(`✅ Found ${ordersData.length} orders in 'orders' field`);
      } else if (ordersRes.data.success && ordersRes.data.data) {
        ordersData = ordersRes.data.data;
        console.log(`✅ Found ${ordersData.length} orders in 'data' field`);
      } else if (Array.isArray(ordersRes.data)) {
        ordersData = ordersRes.data;
        console.log(`✅ Found ${ordersData.length} orders as array root`);
      }
      
      if (ordersData.length > 0) {
        console.log('📝 Sample order:', ordersData[0]);
      }
      
      setOrders(ordersData);
      calculateManualStats(ordersData);
      
    } catch (orderError) {
      console.error('❌ Error fetching orders:', orderError);
      setOrders([]);
      calculateManualStats([]);
    }
    
    // Fetch products
    try {
      console.log('📦 Fetching products...');
      const productsRes = await axios.get(`${API_BASE_URL}/products`);
      
      if (productsRes.data.success) {
        const productsData = productsRes.data.products || productsRes.data.data || [];
        console.log(`✅ Loaded ${productsData.length} products`);
        setProducts(productsData);
      }
    } catch (productError) {
      console.error('❌ Error fetching products:', productError);
    }
    
    // Fetch customers
    try {
      console.log('👥 Fetching customers...');
      const customersRes = await axios.get(`${API_BASE_URL}/customers`);
      
      if (customersRes.data.success) {
        const customersData = customersRes.data.data || customersRes.data.customers || [];
        console.log(`✅ Loaded ${customersData.length} customers from database`);
        if (customersData.length > 0) {
          console.log('👥 Sample customer:', customersData[0]);
        }
        setCustomers(customersData);
      }
    } catch (customerError) {
      console.error('❌ Error fetching customers:', customerError);
    }
    
  } catch (error) {
    console.error('❌ Error in fetchData:', error);
  } finally {
    setIsLoading(false);
  }
};
  
  // Calculate stats manually
  const calculateManualStats = (ordersList = orders) => {
    const totalOrders = ordersList.length;
    const completedOrders = ordersList.filter(order => order.status === 'COMPLETED').length;
    const pendingOrders = ordersList.filter(order => 
      order.status === 'PENDING' || order.status === 'PROCESSING'
    ).length;
    const totalRevenue = ordersList
      .filter(order => order.status === 'COMPLETED')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    setStats({
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue
    });
  };
  
  useEffect(() => {
    fetchData();
    
    // Listen for theme changes
    const handleThemeChange = (event) => {
      setIsDarkMode(event.detail);
    };
    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);
  
  // Filter orders
  const filteredOrders = orders.filter(order => {
    const orderNumber = order.orderNumber || '';
    const customerName = order.customer?.name || '';
    const orderId = order.id || '';
    
    const matchesSearch = 
      orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      orderId.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'All Payments' || order.paymentMethod === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });
  
  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return { bg: 'bg-emerald-500', text: 'text-emerald-700', darkText: 'text-emerald-300' };
      case 'PROCESSING': return { bg: 'bg-blue-500', text: 'text-blue-700', darkText: 'text-blue-300' };
      case 'PENDING': return { bg: 'bg-amber-500', text: 'text-amber-700', darkText: 'text-amber-300' };
      case 'CANCELLED': return { bg: 'bg-red-500', text: 'text-red-700', darkText: 'text-red-300' };
      case 'REFUNDED': return { bg: 'bg-purple-500', text: 'text-purple-700', darkText: 'text-purple-300' };
      default: return { bg: 'bg-gray-500', text: 'text-gray-700', darkText: 'text-gray-300' };
    }
  };
  
  // Payment method icons
  const getPaymentIcon = (method) => {
    switch (method) {
      case 'CASH': return '💵';
      case 'CREDIT_CARD': return '💳';
      case 'DEBIT_CARD': return '🏦';
      case 'ONLINE_PAYMENT': return '🌐';
      case 'BANK_TRANSFER': return '📤';
      default: return '💰';
    }
  };
  
  // Status stats
  const statusStats = [
    { 
      label: 'Completed', 
      count: orders.filter(o => o.status === 'COMPLETED').length, 
      icon: '✅',
      status: 'COMPLETED'
    },
    { 
      label: 'Processing', 
      count: orders.filter(o => o.status === 'PROCESSING').length, 
      icon: '🔄',
      status: 'PROCESSING'
    },
    { 
      label: 'Pending', 
      count: orders.filter(o => o.status === 'PENDING').length, 
      icon: '⏳',
      status: 'PENDING'
    },
    { 
      label: 'Cancelled', 
      count: orders.filter(o => o.status === 'CANCELLED').length, 
      icon: '❌',
      status: 'CANCELLED'
    }
  ];
  
const handleCreateOrder = async () => {
  console.log('🚀 Starting order creation...');
  
  if (newOrder.items.length === 0) {
    alert('Please add at least one item to the order');
    return;
  }
  
  setIsProcessing(true);
  
  try {
    const orderData = {
      customerId: newOrder.customerId || null,
      items: newOrder.items.map(item => ({
        productId: item.productId,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price)
      })),
      paymentMethod: newOrder.paymentMethod || 'CASH',
      notes: newOrder.notes || ''
    };

    console.log('📤 Sending order data to backend:', JSON.stringify(orderData, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);
    
    console.log('✅ Backend POST response status:', response.status);
    console.log('📊 Full response data:', response.data);
    console.log('🔍 Order object keys:', Object.keys(response.data.order || {}));
    console.log('🔍 Order object values:', response.data.order);
    
    if (response.data && response.data.success) {
      const backendOrder = response.data.order;
      
      // Check what fields are missing
      const missingFields = [];
      const requiredFields = ['id', 'orderNumber', 'totalAmount', 'status', 'createdAt'];
      
      requiredFields.forEach(field => {
        if (!backendOrder[field]) {
          missingFields.push(field);
        }
      });
      
      console.log('❌ Missing fields in backend response:', missingFields);
      
      if (backendOrder) {
        // Create a proper order object even with missing fields
        const tempId = `temp-${Date.now()}`;
        const totalAmount = newOrder.items.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        );
        
        const formattedOrder = {
          // Use backend data or fallback
          id: backendOrder.id || backendOrder._id || tempId,
          orderNumber: backendOrder.orderNumber || `ORD-${Date.now().toString().slice(-8)}`,
          customerId: backendOrder.customerId || newOrder.customerId,
          customer: backendOrder.customer || 
                  (newOrder.customerId ? 
                    customers.find(c => c.id === newOrder.customerId) : 
                    { name: 'Walk-in Customer' }
                  ),
          totalAmount: backendOrder.totalAmount || totalAmount,
          status: backendOrder.status || 'PENDING',
          paymentMethod: backendOrder.paymentMethod || newOrder.paymentMethod,
          paymentStatus: backendOrder.paymentStatus || 'PENDING',
          orderItems: backendOrder.orderItems || backendOrder.items || newOrder.items,
          notes: backendOrder.notes || newOrder.notes,
          createdAt: backendOrder.createdAt || new Date().toISOString(),
          updatedAt: backendOrder.updatedAt || new Date().toISOString(),
          // Debug info
          _debug: {
            hasId: !!backendOrder.id,
            hasOrderNumber: !!backendOrder.orderNumber,
            hasTotalAmount: !!backendOrder.totalAmount,
            hasStatus: !!backendOrder.status,
            hasCreatedAt: !!backendOrder.createdAt,
            backendResponse: backendOrder
          }
        };
        
        console.log('📋 Formatted order with debug info:', formattedOrder);
        
        // Add to state
        setOrders(prev => [formattedOrder, ...prev]);
        
        // Update stats
        calculateManualStats();
        
        // Reset form
        setNewOrder({
          customerId: '',
          items: [],
          paymentMethod: 'CASH',
          notes: ''
        });
        setCurrentItem({
          productId: '',
          quantity: 1
        });
        
        // Close modal
        setShowCreateModal(false);
        
        if (missingFields.length > 0) {
          alert(`⚠️ Order created but backend returned incomplete data. Missing: ${missingFields.join(', ')}`);
        } else {
          alert(`✅ Order #${formattedOrder.orderNumber} created successfully!`);
        }
        
        // Force refresh after delay
        setTimeout(fetchData, 1000);
      }
    }
    
  } catch (error) {
    console.error('❌ Error creating order:', error);
    alert(`❌ Error: ${error.response?.data?.message || error.message}`);
  } finally {
    setIsProcessing(false);
  }
};

 // Handle delete order
const handleDeleteOrder = async () => {
  if (!selectedOrder) return;
  
  setIsProcessing(true);
  try {
    const response = await axios.delete(`${API_BASE_URL}/orders/${selectedOrder.id}`);
    
    if (response.data.success) {
      // Remove from local state immediately
      setOrders(prev => prev.filter(order => order.id !== selectedOrder.id));
      
      setShowDeleteModal(false);
      setSelectedOrder(null);
      
      // Refresh stats
      calculateManualStats();
      
      alert('✅ Order deleted successfully!');
    } else {
      alert('❌ Failed to delete order: ' + response.data.message);
    }
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    alert('❌ Failed to delete order: ' + (error.response?.data?.message || error.message));
  } finally {
    setIsProcessing(false);
  }
};
  
  // Handle update status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/orders/${orderId}/status`, { status: newStatus });
      if (response.data.success) {
        // Update local state immediately
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        alert('✅ Order status updated!');
      } else {
        alert('❌ Failed to update status: ' + response.data.message);
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      alert('❌ Failed to update status: ' + (error.response?.data?.message || error.message));
    }
  };
  
  // Add item to new order
  const handleAddItem = () => {
    if (!currentItem.productId) {
      alert('Please select a product');
      return;
    }
    
    const product = products.find(p => p.id === currentItem.productId);
    if (!product) {
      alert('Selected product not found in database');
      return;
    }
    
    const quantity = parseInt(currentItem.quantity) || 1;
    if (product.quantity < quantity) {
      alert(`Insufficient stock. Available: ${product.quantity}, Requested: ${quantity}`);
      return;
    }
    
    // Check if product already exists in order
    const existingItemIndex = newOrder.items.findIndex(item => item.productId === currentItem.productId);
    
    if (existingItemIndex > -1) {
      const updatedItems = [...newOrder.items];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      
      if (product.quantity < newQuantity) {
        alert(`Cannot add more. Available stock: ${product.quantity}, Total in cart: ${newQuantity}`);
        return;
      }
      
      updatedItems[existingItemIndex].quantity = newQuantity;
      updatedItems[existingItemIndex].subtotal = updatedItems[existingItemIndex].quantity * product.price;
      setNewOrder(prev => ({
        ...prev,
        items: updatedItems
      }));
    } else {
      const newItem = {
        productId: currentItem.productId,
        productName: product.name,
        quantity: quantity,
        price: product.price,
        subtotal: product.price * quantity
      };
      
      setNewOrder(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
    }
    
    // Reset current item
    setCurrentItem({
      productId: '',
      quantity: 1
    });
  };
  
  // Remove item from new order
  const handleRemoveItem = (index) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };
  
  // Update item quantity in new order
  const handleUpdateItemQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(index);
      return;
    }
    
    const item = newOrder.items[index];
    const product = products.find(p => p.id === item.productId);
    
    if (product && product.quantity < newQuantity) {
      alert(`Insufficient stock. Available: ${product.quantity}`);
      return;
    }
    
    const updatedItems = [...newOrder.items];
    updatedItems[index].quantity = newQuantity;
    updatedItems[index].subtotal = updatedItems[index].price * newQuantity;
    
    setNewOrder(prev => ({
      ...prev,
      items: updatedItems
    }));
  };
  
  // Calculate new order total
  const calculateOrderTotal = () => {
    return newOrder.items.reduce((total, item) => total + item.subtotal, 0);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };
  
  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };
  
  // Get product stock
  const getProductStock = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.quantity : 0;
  };
  
  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  
  // Animation styles
  const animationStyles = `
    @keyframes slide-up {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes gradient-border {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .animate-slide-up {
      animation: slide-up 0.5s ease-out;
    }
    
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
    
    .hover-lift:hover {
      transform: translateY(-2px);
      transition: transform 0.3s ease;
    }
    
    .card-border {
      position: relative;
      background: linear-gradient(45deg, #ff6b6b, #ffa726, #ffca28, #66bb6a, #42a5f5, #ab47bc);
      background-size: 400% 400%;
      border-radius: 12px;
      padding: 2px;
      animation: gradient-border 3s ease infinite;
    }
    
    .card-border-dark {
      position: relative;
      background: linear-gradient(45deg, #ff8a00, #ffb74d, #ffd54f, #81c784, #64b5f6, #ba68c8);
      background-size: 400% 400%;
      border-radius: 12px;
      padding: 2px;
      animation: gradient-border 3s ease infinite;
    }
    
    .card-inner {
      background: white;
      border-radius: 10px;
      width: 100%;
      height: 100%;
    }
    
    .card-inner-dark {
      background: #1f2937;
      border-radius: 10px;
      width: 100%;
      height: 100%;
    }
    
    .gradient-text {
      background: linear-gradient(45deg, #ff6b6b, #ffa726, #ffca28);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    
    .gradient-text-dark {
      background: linear-gradient(45deg, #ff8a00, #ffb74d, #ffd54f);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    
    .warm-bg {
      background: linear-gradient(135deg, #fff8e1 0%, #fff3cd 50%, #ffeaa7 100%);
      min-height: 100vh;
    }
    
    .warm-bg-dark {
      background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%);
      min-height: 100vh;
    }
    
    .dark-input-bg {
      background-color: #374151;
      color: #f9fafb;
    }
    
    .dark-border-light {
      border-color: #6b7280;
    }
    
    .dark-placeholder::placeholder {
      color: #9ca3af;
    }
    
    .glow-shadow {
      box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
    }
    
    .glow-shadow-dark {
      box-shadow: 0 0 20px rgba(255, 138, 0, 0.3);
    }
  `;
  
  if (isLoading) {
    return (
      <div className={`${isDarkMode ? 'warm-bg-dark' : 'warm-bg'} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'warm-bg-dark' : 'warm-bg'} transition-all duration-300 min-h-screen`}>
      <style>{animationStyles}</style>
      
      {/* Main Container */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="animate-slide-up">
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDarkMode ? 'gradient-text-dark' : 'gradient-text'}`}>
                Order Management
              </h1>
              <p className={`mt-2 text-sm sm:text-base flex items-center gap-2 ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                Managing {stats.totalOrders} orders with ${stats.totalRevenue.toFixed(2)} total revenue
                <Sparkles className="h-4 w-4 text-amber-500" />
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => fetchData()}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover-lift"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover-lift"
              >
                <Plus className="h-4 w-4" />
                <span>New Order</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} animate-slide-up`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Orders</p>
                    <h3 className={`text-2xl sm:text-3xl font-bold mt-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stats.totalOrders}
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <ShoppingCart className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Total Revenue */}
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} animate-slide-up`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
                    <h3 className={`text-2xl sm:text-3xl font-bold mt-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      ${stats.totalRevenue.toFixed(2)}
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10">
                    <DollarSign className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Completed Orders */}
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} animate-slide-up`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
                    <h3 className={`text-2xl sm:text-3xl font-bold mt-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stats.completedOrders}
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pending Orders */}
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} animate-slide-up`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                    <h3 className={`text-2xl sm:text-3xl font-bold mt-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {stats.pendingOrders}
                    </h3>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <Clock className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Distribution */}
        <div className="mb-8">
          <h2 className={`text-lg sm:text-xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Order Status Distribution
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statusStats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`${isDarkMode ? 'card-border-dark' : 'card-border'} animate-slide-up hover-lift cursor-pointer`}
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => setStatusFilter(stat.status)}
              >
                <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {stat.label}
                        </p>
                        <h3 className={`text-xl sm:text-2xl font-bold mt-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          {stat.count}
                        </h3>
                      </div>
                      <span className="text-xl">{stat.icon}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} mb-6`}>
          <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
            <div className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders by number, customer, or ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                  >
                    <option>All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                  <select 
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                  >
                    <option>All Payments</option>
                    <option value="CASH">Cash</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="ONLINE_PAYMENT">Online Payment</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                  <button 
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('All Status');
                      setPaymentFilter('All Payments');
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'}`}>
          <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
            {/* Table Header */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h2 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    Recent Orders
                  </h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {filteredOrders.length} orders
                  </p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 sm:mt-0 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 hover-lift"
                >
                  <Plus className="h-4 w-4" />
                  Create Order
                </button>
              </div>
            </div>
            
            {/* Orders List */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Order #</span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Customer</span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Amount</span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Status</span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Payment</span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Date</span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Actions</span>
                    </th>
                  </tr>
                </thead>
              {/* In your Orders Table - find the tbody section */}
<tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
  {paginatedOrders.map((order, index) => {
    const statusColor = getStatusColor(order.status);
    return (
      <tr 
        key={order.id || order._id || `order-${index}`}
        className={`animate-slide-up ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} hover-lift`}
        style={{animationDelay: `${index * 0.05}s`}}
      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div>
                            <div className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {order.orderNumber || `ORD-${order.id?.slice(0, 8) || 'N/A'}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.orderItems?.length || 0} items
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <div className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {order.customer?.name || 'Walk-in Customer'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.customer?.email || 'No email'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            ${order.totalAmount?.toFixed(2) || '0.00'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            isDarkMode 
                              ? `${statusColor.bg}/20 ${statusColor.darkText}`
                              : `${statusColor.bg}/10 ${statusColor.text}`
                          }`}>
                            {order.status === 'COMPLETED' && <CheckCircle className="h-3 w-3" />}
                            {order.status === 'PROCESSING' && <Package className="h-3 w-3" />}
                            {order.status === 'PENDING' && <Clock className="h-3 w-3" />}
                            {order.status === 'CANCELLED' && <XCircle className="h-3 w-3" />}
                            {order.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getPaymentIcon(order.paymentMethod)}</span>
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                              {order.paymentMethod?.replace('_', ' ') || 'Cash'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTime(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowViewModal(true);
                              }}
                              className="p-2 rounded-lg hover:bg-blue-500/10 transition-colors hover-lift"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4 text-blue-500" />
                            </button>
                            {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                                className="p-2 rounded-lg hover:bg-green-500/10 transition-colors hover-lift"
                                title="Mark as Completed"
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors hover-lift"
                              title="Delete Order"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-amber-200/30 to-orange-200/30 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center mb-4">
                  <ShoppingCart className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'gradient-text-dark' : 'gradient-text'}`}>
                  No Orders Found
                </h3>
                <p className={`mb-4 max-w-md mx-auto ${isDarkMode ? 'text-amber-300/70' : 'text-amber-800/70'}`}>
                  {search || statusFilter !== 'All Status' || paymentFilter !== 'All Payments' 
                    ? 'Try changing your filters to see more orders.'
                    : 'Get started by creating your first order!'}
                </p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover-lift"
                >
                  <Plus className="h-5 w-5" />
                  Create First Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Create Order Modal */}
      {showCreateModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm p-4 animate-fade-in`}>
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'}`}>
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'} max-h-[85vh] overflow-y-auto`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <Plus className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Create New Order
                        </h3>
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Select products and customer from database
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg hover-lift"
                    >
                      <XIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Products Section */}
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Add Products from Database
                        </h4>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-2">
                              <select
                                value={currentItem.productId}
                                onChange={(e) => {
                                  const product = products.find(p => p.id === e.target.value);
                                  setCurrentItem({
                                    productId: e.target.value,
                                    quantity: 1,
                                    price: product?.price || 0
                                  });
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                              >
                                <option value="">Select a product from database</option>
                                {products.map(product => (
                                  <option key={product.id} value={product.id}>
                                    {product.name} - ${product.price} (Stock: {product.quantity})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <input
                                type="number"
                                value={currentItem.quantity}
                                onChange={(e) => setCurrentItem({
                                  ...currentItem,
                                  quantity: parseInt(e.target.value) || 1
                                })}
                                min="1"
                                max={getProductStock(currentItem.productId)}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                                placeholder="Qty"
                              />
                            </div>
                          </div>
                          <button
                            onClick={handleAddItem}
                            disabled={!currentItem.productId || currentItem.quantity < 1}
                            className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                          >
                            Add to Order
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            Selected Products ({newOrder.items.length})
                          </h4>
                          {newOrder.items.length > 0 && (
                            <div className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              Total: ${calculateOrderTotal().toFixed(2)}
                            </div>
                          )}
                        </div>
                        {newOrder.items.length === 0 ? (
                          <div className={`p-8 text-center rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                              No products added yet. Select products from database above.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {newOrder.items.map((item, index) => (
                              <div 
                                key={index}
                                className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} animate-slide-up hover-lift`}
                                style={{animationDelay: `${index * 0.1}s`}}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                      {item.productName}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      ${item.price.toFixed(2)} each
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleUpdateItemQuantity(index, item.quantity - 1)}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded hover-lift"
                                      >
                                        <ChevronDown className="h-4 w-4" />
                                      </button>
                                      <span className="font-medium w-8 text-center">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => handleUpdateItemQuantity(index, item.quantity + 1)}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded hover-lift"
                                      >
                                        <ChevronUp className="h-4 w-4" />
                                      </button>
                                    </div>
                                    <div className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                      ${item.subtotal.toFixed(2)}
                                    </div>
                                    <button
                                      onClick={() => handleRemoveItem(index)}
                                      className="p-1 hover:bg-red-500/10 rounded hover-lift"
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Order Details */}
                    <div className="space-y-6">
                      <div>
                        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Select Customer from Database
                        </h4>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                        <select
  value={newOrder.customerId}
  onChange={(e) => setNewOrder({...newOrder, customerId: e.target.value})}
  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${isDarkMode ? 'dark-input-bg dark-border-light' : 'border-gray-300'}`}
>
  <option value="">Walk-in Customer (No specific customer)</option>
  {customers.map(customer => (
    <option key={customer.id} value={customer.id}>
      {customer.name} - {customer.email || 'No email'} 
      {customer.phone ? ` (${customer.phone})` : ''}
    </option>
  ))}
</select>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Payment Method
                        </h4>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                          <select
                            value={newOrder.paymentMethod}
                            onChange={(e) => setNewOrder({...newOrder, paymentMethod: e.target.value})}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                          >
                            <option value="CASH">Cash</option>
                            <option value="CREDIT_CARD">Credit Card</option>
                            <option value="DEBIT_CARD">Debit Card</option>
                            <option value="ONLINE_PAYMENT">Online Payment</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Order Summary
                        </h4>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                              <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                ${calculateOrderTotal().toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between border-t pt-3">
                              <span className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Total</span>
                              <span className={`font-bold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                ${calculateOrderTotal().toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Notes
                        </h4>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                          <textarea
                            value={newOrder.notes}
                            onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                            rows="3"
                            placeholder="Add any notes about this order..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className={`font-bold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Total: ${calculateOrderTotal().toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {newOrder.items.length} items • Customer: {
                            newOrder.customerId 
                              ? customers.find(c => c.id === newOrder.customerId)?.name || 'Selected'
                              : 'Walk-in'
                          }
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowCreateModal(false)}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors hover-lift"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateOrder}
                          disabled={newOrder.items.length === 0 || isProcessing}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover-lift"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Create Order with Database Data
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOrder && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm p-4 animate-fade-in`}>
          <div className="relative w-full max-w-md">
            <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'}`}>
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        Delete Order
                      </h3>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                        This action cannot be undone
                      </p>
                    </div>
                  </div>
                  
                  <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Are you sure you want to delete order{' '}
                    <span className="font-bold">{selectedOrder.orderNumber || `#${selectedOrder.id?.slice(0, 8)}`}</span>?
                  </p>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors hover-lift"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteOrder}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-lg transition-all duration-300 hover-lift"
                    >
                      <Trash2 className="inline h-4 w-4 mr-2" />
                      Delete Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm p-4 animate-fade-in`}>
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'}`}>
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'} max-h-[85vh] overflow-y-auto`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Order Details
                        </h3>
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                          {selectedOrder.orderNumber || `Order #${selectedOrder.id?.slice(0, 8)}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg hover-lift"
                    >
                      <XIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Summary */}
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Order Items
                        </h4>
                        <div className="space-y-3">
                          {selectedOrder.orderItems?.map((item, index) => (
                            <div 
                              key={index}
                              className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} animate-slide-up`}
                              style={{animationDelay: `${index * 0.1}s`}}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                    {item.product?.name || `Product ${index + 1}`}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ${item.price?.toFixed(2) || '0.00'} × {item.quantity || 1}
                                  </div>
                                </div>
                                <div className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                  ${item.subtotal?.toFixed(2) || '0.00'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Info */}
                    <div className="space-y-6">
                      <div>
                        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Order Summary
                        </h4>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Subtotal</span>
                              <span className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                ${selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                            <div className="flex justify-between border-t pt-3">
                              <span className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Total</span>
                              <span className={`font-bold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                ${selectedOrder.totalAmount?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          Order Status
                        </h4>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                              getStatusColor(selectedOrder.status).bg + '/20 ' + 
                              (isDarkMode ? getStatusColor(selectedOrder.status).darkText : getStatusColor(selectedOrder.status).text)
                            }`}>
                              {selectedOrder.status || 'PENDING'}
                            </span>
                            <Calendar className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="text-sm text-gray-500">
                            Created: {formatDate(selectedOrder.createdAt)} {formatTime(selectedOrder.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setShowViewModal(false);
                          setShowDeleteModal(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-lg transition-colors hover-lift"
                      >
                        Delete Order
                      </button>
                      {selectedOrder.status !== 'COMPLETED' && selectedOrder.status !== 'CANCELLED' && (
                        <button
                          onClick={() => {
                            handleUpdateStatus(selectedOrder.id, 'COMPLETED');
                            setShowViewModal(false);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all duration-300 hover-lift"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;