import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  X,
  Save,
  UserPlus,
  Building,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  UserCheck,
  UserX
} from 'lucide-react';

const CustomerList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [animateStats, setAnimateStats] = useState(false);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [deleteAnimation, setDeleteAnimation] = useState(false);
  const [addSuccessAnimation, setAddSuccessAnimation] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const addButtonRef = useRef(null);
  const addModalButtonRef = useRef(null);
  const editModalButtonRef = useRef(null);
  const deleteButtonRefs = useRef({});
  
  // Customers state
  const [customers, setCustomers] = useState([]);
  
  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';
  
// Fetch customers from backend - FIXED VERSION
const fetchCustomers = async () => {
  try {
    setIsLoading(true);
    console.log('🔄 Fetching customers from:', `${API_BASE_URL}/customers`);
    
    const res = await axios.get(`${API_BASE_URL}/customers`);
    console.log('📥 Raw API response:', res.data);
    
    // Your backend returns: { success: true, data: [...] }
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      const transformedCustomers = res.data.data.map(customer => ({
        id: customer.id,
        name: customer.name || 'Unnamed Customer',
        email: customer.email || 'No email',
        phone: customer.phone || 'No phone',
        address: customer.address || 'No address',
        status: customer.status || 'active',
        totalOrders: customer.totalOrders || 0,
        totalSpent: customer.totalSpent || '0.00',
        joinedDate: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        lastActive: customer.updatedAt ? new Date(customer.updatedAt).toLocaleDateString() : new Date().toLocaleDateString(),
        notes: customer.notes || '',
        avatar: '👤'
      }));
      
      setCustomers(transformedCustomers);
      setError('');
      console.log(`✅ Loaded ${transformedCustomers.length} real customers from database`);
    } else {
      console.error('❌ Invalid response format:', res.data);
      setCustomers([]);
      setError('Invalid response format from server');
      
      // Fallback to demo data for testing
      console.log('🔄 Falling back to demo data');
      setCustomers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          address: '123 Main St, City',
          status: 'active',
          totalOrders: 15,
          totalSpent: '1250.50',
          joinedDate: '2024-01-15',
          lastActive: '2024-03-10',
          notes: 'Regular customer',
          avatar: '👤'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1234567891',
          address: '456 Oak Ave, Town',
          status: 'active',
          totalOrders: 8,
          totalSpent: '850.75',
          joinedDate: '2024-02-20',
          lastActive: '2024-03-08',
          notes: 'Prefers email communication',
          avatar: '👩‍💼'
        }
      ]);
    }
  } catch (err) {
    console.error("❌ Error fetching customers:", err);
    setError('Failed to load customers. Please check if backend is running.');
    
    // Demo data for testing
    setCustomers([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St, City',
        status: 'active',
        totalOrders: 15,
        totalSpent: '1250.50',
        joinedDate: '2024-01-15',
        lastActive: '2024-03-10',
        notes: 'Regular customer',
        avatar: '👤'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        address: '456 Oak Ave, Town',
        status: 'active',
        totalOrders: 8,
        totalSpent: '850.75',
        joinedDate: '2024-02-20',
        lastActive: '2024-03-08',
        notes: 'Prefers email communication',
        avatar: '👩‍💼'
      }
    ]);
  } finally {
    setIsLoading(false);
  }
};
  // Initialize customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  // New customer state
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    notes: '',
    avatar: '👤'
  });
  
  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = (event) => {
      setIsDarkMode(event.detail);
    };
    
    window.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);
  
  useEffect(() => {
    if (customers.length > 0) {
      setAnimateStats(true);
      const timer = setTimeout(() => setAnimateStats(false), 800);
      return () => clearTimeout(timer);
    }
  }, [customers]);
  
  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(search.toLowerCase()) ||
                         customer.email.toLowerCase().includes(search.toLowerCase()) ||
                         customer.phone.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || customer.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  // Customer stats
  const customerStats = [
    { 
      label: 'Total Customers', 
      count: customers.length, 
      gradient: 'from-blue-400 to-cyan-400',
      darkGradient: 'from-blue-500 to-cyan-500',
      icon: <Users className="h-5 w-5" />,
      color: isDarkMode ? 'bg-blue-500' : 'bg-blue-400'
    },
    { 
      label: 'Active', 
      count: customers.filter(c => c.status === 'active').length, 
      gradient: 'from-emerald-400 to-green-400',
      darkGradient: 'from-emerald-500 to-green-500',
      icon: <UserCheck className="h-5 w-5" />,
      color: isDarkMode ? 'bg-emerald-500' : 'bg-emerald-400'
    },
    { 
      label: 'Inactive', 
      count: customers.filter(c => c.status === 'inactive').length, 
      gradient: 'from-amber-400 to-orange-400',
      darkGradient: 'from-amber-500 to-orange-500',
      icon: <UserX className="h-5 w-5" />,
      color: isDarkMode ? 'bg-amber-500' : 'bg-amber-400'
    }
  ];
  
  // Quick stats
  const quickStats = [
    {
      label: 'Avg Orders per Customer',
      value: customers.length > 0 
        ? (customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0) / customers.length).toFixed(1)
        : '0',
      icon: TrendingUp,
      color: 'text-blue-500'
    },
    {
      label: 'Avg Spending',
      value: customers.length > 0 
        ? `$${(customers.reduce((sum, c) => sum + parseFloat(c.totalSpent || 0), 0) / customers.length).toFixed(2)}`
        : '$0.00',
      icon: TrendingUp,
      color: 'text-emerald-500'
    }
  ];
  
// Handle add customer - FIXED VERSION (send null instead of undefined)
const handleAddCustomer = async () => {
  if (!newCustomer.name.trim() || !newCustomer.email.trim()) {
    alert('Please fill in name and email');
    return;
  }

  try {
    setIsProcessing(true);
    
    // Prepare data for backend - use null instead of undefined
    const customerData = {
      name: newCustomer.name.trim(),
      email: newCustomer.email.trim(),
      phone: newCustomer.phone.trim() || null, // Use null instead of undefined
      address: newCustomer.address.trim() || null,
      notes: newCustomer.notes.trim() || null,
      // DO NOT send: avatar, totalOrders, totalSpent, joinedDate, lastActive
      // Backend will handle defaults
    };
    
    console.log('📤 Sending customer data to backend:', customerData);
    
    // Add to backend
    const response = await axios.post(`${API_BASE_URL}/customers`, customerData);
    console.log('✅ Customer creation response:', response.data);
    
    if (response.data.success) {
      // Get the created customer from response
      const createdCustomer = response.data.data;
      
      if (createdCustomer) {
        // Transform to match frontend format
        const transformedCustomer = {
          id: createdCustomer.id,
          name: createdCustomer.name || newCustomer.name,
          email: createdCustomer.email || newCustomer.email,
          phone: createdCustomer.phone || newCustomer.phone || 'No phone',
          address: createdCustomer.address || newCustomer.address || 'No address',
          status: createdCustomer.status || 'active',
          totalOrders: createdCustomer.totalOrders || 0,
          totalSpent: createdCustomer.totalSpent || '0.00',
          joinedDate: createdCustomer.createdAt ? new Date(createdCustomer.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          lastActive: createdCustomer.updatedAt ? new Date(createdCustomer.updatedAt).toLocaleDateString() : new Date().toLocaleDateString(),
          notes: createdCustomer.notes || '',
          avatar: '👤'
        };
        
        // Add to local state
        setCustomers(prev => [...prev, transformedCustomer]);
      } else {
        // Fallback if response doesn't have data
        console.warn('⚠️ Response missing customer data, using fallback');
        const fallbackCustomer = {
          id: `CUST-${Date.now()}`,
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone || 'No phone',
          address: newCustomer.address || 'No address',
          status: 'active',
          totalOrders: 0,
          totalSpent: '0.00',
          joinedDate: new Date().toLocaleDateString(),
          lastActive: new Date().toLocaleDateString(),
          notes: newCustomer.notes || '',
          avatar: '👤'
        };
        setCustomers(prev => [...prev, fallbackCustomer]);
      }
      
      // Show success animation
      setAddSuccessAnimation(true);
      setTimeout(() => setAddSuccessAnimation(false), 1500);
      
      // Reset form
      setShowAddModal(false);
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
        notes: '',
        avatar: '👤'
      });
      
      // Update stats
      setAnimateStats(true);
      setTimeout(() => setAnimateStats(false), 800);
      
      alert('✅ Customer added successfully!');
    } else {
      alert(`❌ Failed to add customer: ${response.data.message || response.data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("❌ Error adding customer:", error);
    console.error("❌ Error response data:", error.response?.data);
    console.error("❌ Error response status:", error.response?.status);
    
    // Show detailed error message
    if (error.response?.data?.error) {
      alert(`❌ Failed to add customer: ${error.response.data.error}`);
    } else if (error.response?.data?.message) {
      alert(`❌ Failed to add customer: ${error.response.data.message}`);
    } else if (error.message) {
      alert(`❌ Failed to add customer: ${error.message}`);
    } else {
      alert('❌ Failed to add customer. Please check backend logs.');
    }
  } finally {
    setIsProcessing(false);
  }
};
  
 // Handle edit customer - FIXED VERSION
const handleEditCustomer = async () => {
  if (selectedCustomer) {
    try {
      setIsProcessing(true);
      
      // Prepare update data (only fields that can be updated)
      const updateData = {
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone || undefined,
        address: selectedCustomer.address || undefined,
        notes: selectedCustomer.notes || undefined,
        status: selectedCustomer.status
      };
      
      console.log('📤 Updating customer:', selectedCustomer.id, updateData);
      
      const response = await axios.put(`${API_BASE_URL}/customers/${selectedCustomer.id}`, updateData);
      console.log('✅ Update response:', response.data);
      
      if (response.data.success) {
        // Update local state
        setCustomers(prev => prev.map(c => 
          c.id === selectedCustomer.id ? {
            ...c,
            ...selectedCustomer,
            lastActive: new Date().toLocaleDateString()
          } : c
        ));
        
        setShowEditModal(false);
        setSelectedCustomer(null);
        setAnimateStats(true);
        setTimeout(() => setAnimateStats(false), 800);
        
        alert('✅ Customer updated successfully!');
      } else {
        alert(`❌ Failed to update customer: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("❌ Error updating customer:", error);
      alert(`❌ Failed to update customer: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  }
};
  
  // Handle delete customer - FIXED VERSION
const handleDeleteCustomer = async () => {
  if (selectedCustomer) {
    try {
      setIsProcessing(true);
      const response = await axios.delete(`${API_BASE_URL}/customers/${selectedCustomer.id}`);
      
      console.log('✅ Delete response:', response.data);
      
      if (response.data.success) {
        // Remove from local state
        setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));
        
        setShowDeleteModal(false);
        setSelectedCustomer(null);
        setAnimateStats(true);
        setTimeout(() => setAnimateStats(false), 800);
        
        alert('✅ Customer deleted successfully!');
      } else {
        alert(`❌ Failed to delete customer: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("❌ Error deleting customer:", error);
      alert(`❌ Failed to delete customer: ${error.response?.data?.error || error.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  }
};
  // Handle export
  const handleExport = () => {
    if (customers.length === 0) {
      alert('No customers to export!');
      return;
    }
    
    const dataStr = JSON.stringify(customers, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'customers-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Handle clear all
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all customers? This cannot be undone.')) {
      // Clear all from backend
      customers.forEach(async customer => {
        try {
          await axios.delete(`${API_BASE_URL}/customers/${customer.id}`);
        } catch (error) {
          console.error(`Error deleting customer ${customer.id}:`, error);
        }
      });
      
      // Clear local state
      setCustomers([]);
      setSearch('');
      setStatusFilter('All Status');
      setCurrentPage(1);
      setAnimateStats(true);
      setTimeout(() => setAnimateStats(false), 800);
    }
  };
  
  // Handle reset filters
  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All Status');
    setCurrentPage(1);
  };
  
  // Calculate pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  
  // Get avatar emoji
  const getAvatarEmoji = (name) => {
    if (!name) return '👤';
    const firstLetter = name.charAt(0).toUpperCase();
    if (firstLetter >= 'A' && firstLetter <= 'D') return '👨';
    if (firstLetter >= 'E' && firstLetter <= 'H') return '👩';
    if (firstLetter >= 'I' && firstLetter <= 'L') return '👨‍💼';
    if (firstLetter >= 'M' && firstLetter <= 'P') return '👩‍💼';
    if (firstLetter >= 'Q' && firstLetter <= 'T') return '🧑‍💼';
    return '👤';
  };
  
  // Animation styles (same as ProductList)
  const animationStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-8px) rotate(2deg); }
      66% { transform: translateY(-4px) rotate(-2deg); }
    }
    
    @keyframes gentle-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.03); opacity: 0.9; }
    }
    
    @keyframes slide-up {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes border-glow {
      0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3), 0 0 10px rgba(59, 130, 246, 0.2); }
      50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 0 25px rgba(59, 130, 246, 0.3); }
    }
    
    @keyframes border-glow-dark {
      0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.4); }
      50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.7), 0 0 25px rgba(59, 130, 246, 0.5); }
    }
    
    @keyframes success-pop {
      0% { transform: scale(0); opacity: 0; }
      70% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }
    
    .animate-gentle-pulse {
      animation: gentle-pulse 3s ease-in-out infinite;
    }
    
    .animate-slide-up {
      animation: slide-up 0.5s ease-out;
    }
    
    .animate-fade-in {
      animation: fade-in 0.4s ease-out;
    }
    
    .animate-border-glow {
      animation: border-glow 2s ease-in-out infinite;
    }
    
    .animate-border-glow-dark {
      animation: border-glow-dark 2s ease-in-out infinite;
    }
    
    .animate-success-pop {
      animation: success-pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }
    
    .card-border {
      position: relative;
      background: linear-gradient(45deg, #3b82f6, #60a5fa, #93c5fd);
      background-size: 400% 400%;
      border-radius: 12px;
      padding: 2px;
      animation: warm-gradient 8s ease infinite;
    }
    
    .card-border-dark {
      position: relative;
      background: linear-gradient(45deg, #1d4ed8, #3b82f6, #60a5fa);
      background-size: 400% 400%;
      border-radius: 12px;
      padding: 2px;
      animation: warm-gradient 8s ease infinite;
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
      background: linear-gradient(45deg, #3b82f6, #60a5fa, #93c5fd);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      background-size: 200% 200%;
      animation: warm-gradient 4s ease infinite;
    }
    
    .gradient-text-dark {
      background: linear-gradient(45deg, #60a5fa, #93c5fd, #bfdbfe);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      background-size: 200% 200%;
      animation: warm-gradient 4s ease infinite;
    }
    
    .gradient-button {
      background: linear-gradient(45deg, #3b82f6, #60a5fa, #3b82f6);
      background-size: 200% 200%;
      animation: warm-gradient 3s ease infinite;
      position: relative;
      overflow: hidden;
    }
    
    .gradient-button-dark {
      background: linear-gradient(45deg, #1d4ed8, #3b82f6, #1d4ed8);
      background-size: 200% 200%;
      animation: warm-gradient 3s ease infinite;
      position: relative;
      overflow: hidden;
    }
    
    .page-number-active {
      background: linear-gradient(45deg, #3b82f6, #60a5fa, #3b82f6);
      background-size: 200% 200%;
      animation: warm-gradient 3s ease infinite;
      color: white;
      font-weight: bold;
    }
    
    .page-number-active-dark {
      background: linear-gradient(45deg, #1d4ed8, #3b82f6, #1d4ed8);
      background-size: 200% 200%;
      animation: warm-gradient 3s ease infinite;
      color: white;
      font-weight: bold;
    }
    
    @keyframes warm-gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .warm-bg {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%);
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
    
    .dark-input-bg:focus {
      background-color: #4b5563;
    }
    
    .dark-border-light {
      border-color: #6b7280;
    }
    
    .dark-placeholder::placeholder {
      color: #9ca3af;
    }
    
    .dark-modal-bg {
      background-color: rgba(0, 0, 0, 0.7);
    }
  `;
  
  if (isLoading) {
    return (
      <div className={`${isDarkMode ? 'warm-bg-dark' : 'warm-bg'} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading customers...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${isDarkMode ? 'warm-bg-dark' : 'warm-bg'} transition-all duration-300`}>
      <style>{animationStyles}</style>
      
      {/* Success animation overlay */}
      {addSuccessAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-success-pop">🎉</div>
            <div className="text-xl font-bold gradient-text animate-success-pop">
              Customer Added Successfully!
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div className="animate-slide-up">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'gradient-text-dark' : 'gradient-text'}`}>
              Customers Management
            </h1>
            <p className={`mt-2 text-lg flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              {customers.length === 0 ? 'No customers yet. Add your first customer!' : `Managing ${customers.length} customers`}
              <Sparkles className="h-4 w-4 text-blue-500 animate-float" />
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 animate-slide-up"
              style={{animationDelay: '0.1s'}}
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            {customers.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 animate-slide-up"
                style={{animationDelay: '0.2s'}}
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </button>
            )}
            <button 
              ref={addButtonRef}
              onClick={() => setShowAddModal(true)}
              className={`flex items-center gap-2 px-4 py-2.5 ${isDarkMode ? 'gradient-button-dark' : 'gradient-button'} text-white font-bold rounded-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 animate-slide-up`}
              style={{animationDelay: '0.3s'}}
            >
              {isAddingCustomer ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Add Customer
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-6 pb-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {customerStats.map((stat, index) => (
            <div 
              key={stat.label}
              className={`${isDarkMode ? 'card-border-dark' : 'card-border'} ${isDarkMode ? 'animate-border-glow-dark' : 'animate-border-glow'}`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'} group cursor-pointer transition-all duration-300 hover:scale-105`}>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {stat.count}
                      </div>
                      <div className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {stat.label}
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color} text-white transform transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        animateStats ? 'animate-pulse' : ''
                      }`}
                      style={{ 
                        width: `${(stat.count / (customers.length || 1)) * 100}%`,
                        background: `linear-gradient(to right, ${stat.gradient})`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Search and Filters */}
        {customers.length > 0 && (
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} mb-6`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      <input
                        type="text"
                        placeholder="Search customers by name, email, or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder border-blue-800 focus:ring-blue-400' : 'border-blue-200 bg-white'}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder border-blue-800 focus:ring-blue-400' : 'border-blue-200 bg-white'}`}
                    >
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                    <button 
                      onClick={handleResetFilters}
                      className={`flex items-center gap-2 px-4 py-3 font-medium rounded-lg transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-blue-900 hover:bg-blue-800 text-blue-100' : 'bg-blue-100 hover:bg-blue-200 text-blue-800 hover:text-blue-900'}`}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Customers Table */}
        {customers.length > 0 ? (
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} mb-8`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className={`p-5 border-b ${isDarkMode ? 'border-blue-800' : 'border-blue-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>All Customers</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {filteredCustomers.length === customers.length 
                        ? 'Showing all customers' 
                        : `Filtered: ${filteredCustomers.length} of ${customers.length} customers`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleClearAll}
                      className={`p-2 rounded-lg border transition-all duration-300 hover:scale-105 ${isDarkMode ? 'border-gray-700 bg-gray-800 hover:bg-red-900/30' : 'border-gray-300 bg-gray-50 hover:bg-red-50/50'}`}
                    >
                      <Trash2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Showing <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{paginatedCustomers.length}</span> of{' '}
                      <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{filteredCustomers.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Customer
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Contact
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Address
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Status
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Orders
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                    {paginatedCustomers.map((customer) => (
                      <tr key={customer.id} className={`${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white text-lg">
                              {getAvatarEmoji(customer.name)}
                            </div>
                            <div className="min-w-0">
                              <div className={`font-medium text-sm truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{customer.name}</div>
                              <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Joined: {customer.joinedDate}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{customer.email}</div>
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{customer.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm max-w-xs truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{customer.address}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            customer.status === 'active' 
                              ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700')
                              : (isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700')
                          }`}>
                            {customer.status === 'active' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {customer.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {customer.totalOrders} orders
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              ${customer.totalSpent} spent
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setShowViewModal(true);
                              }}
                              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-50/50'}`}
                            >
                              <Eye className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setShowEditModal(true);
                              }}
                              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-50/50'}`}
                            >
                              <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </button>
                            <button 
                              ref={el => deleteButtonRefs.current[customer.id] = el}
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setShowDeleteModal(true);
                              }}
                              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50/50'}`}
                            >
                              <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className={`p-5 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                    Page <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{currentPage}</span> of{' '}
                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{totalPages}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={`p-2 rounded-lg border transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'border-gray-700 bg-gray-800 hover:bg-blue-900/30 text-gray-300 hover:text-gray-100' : 'border-gray-300 bg-gray-50 hover:bg-blue-50/50 text-gray-700 hover:text-gray-900'}`}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-sm ${
                          currentPage === index + 1
                            ? (isDarkMode ? 'page-number-active-dark' : 'page-number-active')
                            : (isDarkMode ? 'border border-gray-700 bg-gray-800 text-gray-300 hover:bg-blue-900/30 hover:text-gray-100' : 'border border-gray-300 bg-gray-50 text-gray-700 hover:bg-blue-50/50 hover:text-gray-900')
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={`p-2 rounded-lg border transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'border-gray-700 bg-gray-800 hover:bg-blue-900/30 text-gray-300 hover:text-gray-100' : 'border-gray-300 bg-gray-50 hover:bg-blue-50/50 text-gray-700 hover:text-gray-900'}`}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} mb-8`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-8 text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-200/30 to-cyan-200/30 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center mb-4 animate-float">
                  <Users className="h-10 w-10 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'gradient-text-dark' : 'gradient-text'}`}>
                  No Customers Yet
                </h3>
                <p className={`mb-6 max-w-md mx-auto ${isDarkMode ? 'text-blue-300/70' : 'text-blue-800/70'}`}>
                  Get started by adding your first customer. Manage contacts, track orders, and build relationships.
                </p>
                <button 
                  ref={addButtonRef}
                  onClick={() => setShowAddModal(true)}
                  className={`inline-flex items-center gap-2 px-6 py-3 ${isDarkMode ? 'gradient-button-dark' : 'gradient-button'} text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  <UserPlus className="h-5 w-5" />
                  Add Your First Customer
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Stats */}
        {customers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'}`}>
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                <div className="p-6">
                  <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Customer Insights</h3>
                  <div className="space-y-4">
                    {quickStats.map((stat, index) => (
                      <div key={stat.label} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50/30 to-cyan-50/30 dark:from-blue-900/20 dark:to-cyan-900/20">
                        <div className="flex items-center gap-3">
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{stat.label}</span>
                        </div>
                        <span className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'}`}>
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                <div className="p-6">
                  <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm"
                    >
                      <UserPlus className="h-4 w-4" />
                      Add New Customer
                    </button>
                    <button 
                      onClick={handleExport}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-lg border transition-all duration-300 hover:scale-105 text-sm ${isDarkMode ? 'bg-gray-800 hover:bg-blue-900/30 text-gray-300 hover:text-gray-100 border-gray-700' : 'bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-gray-900 border-gray-300'}`}
                    >
                      <Download className="h-4 w-4" />
                      Export Customers
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Modal */}
      {showDeleteModal && selectedCustomer && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'dark-modal-bg' : 'bg-black/50'} backdrop-blur-sm p-4`}>
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} w-full max-w-md`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 dark:from-red-500/30 dark:to-rose-500/30 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Delete Customer</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>This action cannot be undone</p>
                  </div>
                </div>
                
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
                  Are you sure you want to delete <span className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>"{selectedCustomer.name}"</span>? 
                  All customer data will be permanently removed.
                </p>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedCustomer(null);
                    }}
                    className={`px-4 py-2.5 font-medium rounded-lg border transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800 hover:bg-blue-900/30 text-gray-300 hover:text-gray-100 border-gray-700' : 'bg-gray-50 hover:bg-blue-50/50 text-gray-700 hover:text-gray-900 border-gray-300'}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setDeleteAnimation(true);
                      setTimeout(() => {
                        handleDeleteCustomer();
                        setDeleteAnimation(false);
                      }, 500);
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow hover:scale-105"
                  >
                    <Trash2 className="inline h-4 w-4 mr-2" />
                    Delete Customer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Modal */}
      {showAddModal && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'dark-modal-bg' : 'bg-black/50'} backdrop-blur-sm p-4`}>
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} w-full max-w-md`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-6 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 flex items-center justify-center">
                      <UserPlus className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Add New Customer</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create a new customer entry</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({...prev, name: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer(prev => ({...prev, email: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({...prev, phone: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Address
                    </label>
                    <textarea
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer(prev => ({...prev, address: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      rows="3"
                      placeholder="Enter address"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <select
                      value={newCustomer.status}
                      onChange={(e) => setNewCustomer(prev => ({...prev, status: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Notes
                    </label>
                    <textarea
                      value={newCustomer.notes}
                      onChange={(e) => setNewCustomer(prev => ({...prev, notes: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      rows="3"
                      placeholder="Enter any notes"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className={`px-4 py-2.5 font-medium rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    Cancel
                  </button>
                  <button
                    ref={addModalButtonRef}
                    onClick={handleAddCustomer}
                    disabled={isProcessing}
                    className={`px-4 py-2.5 ${isDarkMode ? 'gradient-button-dark' : 'gradient-button'} text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50`}
                  >
                    {isProcessing ? (
                      <Loader2 className="inline h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="inline h-4 w-4 mr-2" />
                    )}
                    {isProcessing ? 'Adding...' : 'Add Customer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Modal */}
      {showEditModal && selectedCustomer && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'dark-modal-bg' : 'bg-black/50'} backdrop-blur-sm p-4`}>
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} w-full max-w-md`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-6 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 dark:from-blue-500/30 dark:to-cyan-500/30 flex items-center justify-center">
                      <Edit className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Edit Customer</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Update customer information</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedCustomer(null);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={selectedCustomer.name}
                      onChange={(e) => setSelectedCustomer(prev => ({...prev, name: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={selectedCustomer.email}
                      onChange={(e) => setSelectedCustomer(prev => ({...prev, email: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={selectedCustomer.phone}
                      onChange={(e) => setSelectedCustomer(prev => ({...prev, phone: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Address
                    </label>
                    <textarea
                      value={selectedCustomer.address}
                      onChange={(e) => setSelectedCustomer(prev => ({...prev, address: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <select
                      value={selectedCustomer.status}
                      onChange={(e) => setSelectedCustomer(prev => ({...prev, status: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Notes
                    </label>
                    <textarea
                      value={selectedCustomer.notes}
                      onChange={(e) => setSelectedCustomer(prev => ({...prev, notes: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      rows="3"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedCustomer(null);
                    }}
                    className={`px-4 py-2.5 font-medium rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    Cancel
                  </button>
                  <button
                    ref={editModalButtonRef}
                    onClick={handleEditCustomer}
                    disabled={isProcessing}
                    className={`px-4 py-2.5 ${isDarkMode ? 'gradient-button-dark' : 'gradient-button'} text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50`}
                  >
                    {isProcessing ? (
                      <Loader2 className="inline h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="inline h-4 w-4 mr-2" />
                    )}
                    {isProcessing ? 'Updating...' : 'Update Customer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Modal */}
      {showViewModal && selectedCustomer && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'dark-modal-bg' : 'bg-black/50'} backdrop-blur-sm p-4`}>
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} w-full max-w-md`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xl">
                      {getAvatarEmoji(selectedCustomer.name)}
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedCustomer.name}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Customer Details</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedCustomer(null);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</div>
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedCustomer.email}</div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</div>
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedCustomer.phone || 'Not provided'}</div>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Address</div>
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedCustomer.address || 'Not provided'}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Joined</div>
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedCustomer.joinedDate}</div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'}`}>
                      <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</div>
                      <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                        selectedCustomer.status === 'active' 
                          ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700')
                          : (isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700')
                      }`}>
                        {selectedCustomer.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-emerald-50/50'}`}>
                      <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Orders</div>
                      <div className={`text-lg font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>{selectedCustomer.totalOrders}</div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-emerald-50/50'}`}>
                      <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Spent</div>
                      <div className={`text-lg font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>${selectedCustomer.totalSpent}</div>
                    </div>
                  </div>
                  
                  {selectedCustomer.notes && (
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'}`}>
                      <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Notes</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedCustomer.notes}</div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedCustomer(null);
                    }}
                    className={`flex-1 px-4 py-2.5 font-medium rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setShowEditModal(true);
                    }}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium rounded-lg transition-colors"
                  >
                    <Edit className="inline h-4 w-4 mr-2" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;