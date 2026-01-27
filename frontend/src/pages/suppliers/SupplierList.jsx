import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Truck,
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
  Building,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Package,
  DollarSign,
  Briefcase
} from 'lucide-react';

const SupplierList = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [animateStats, setAnimateStats] = useState(false);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
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
  
  // Suppliers state
  const [suppliers, setSuppliers] = useState([]);
  
  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api';
  
  // Fetch suppliers from backend
  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/suppliers`);
      
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        const transformedSuppliers = res.data.data.map(supplier => ({
          id: supplier.id,
          name: supplier.name || 'Unnamed Supplier',
          company: supplier.company || 'Individual Supplier',
          email: supplier.email || 'No email',
          phone: supplier.phone || 'No phone',
          address: supplier.address || 'No address',
          status: supplier.status || 'active',
          totalProducts: supplier.totalProducts || Math.floor(Math.random() * 100),
          totalOrders: supplier.totalOrders || Math.floor(Math.random() * 50),
          reliability: supplier.reliability || 'High',
          joinedDate: supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
          lastOrder: supplier.updatedAt ? new Date(supplier.updatedAt).toLocaleDateString() : new Date().toLocaleDateString(),
          notes: supplier.notes || '',
          avatar: supplier.avatar || '🏢'
        }));
        
        setSuppliers(transformedSuppliers);
        setError('');
      } else {
        setSuppliers([]);
      }
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError('Failed to load suppliers. Please check if backend is running.');
      // Demo data for testing
      setSuppliers([
        {
          id: '1',
          name: 'John Supplier',
          company: 'ABC Supplies Inc.',
          email: 'john@abcsupplies.com',
          phone: '+1234567890',
          address: '123 Business Ave, City',
          status: 'active',
          totalProducts: 45,
          totalOrders: 23,
          reliability: 'High',
          joinedDate: '2024-01-15',
          lastOrder: '2024-03-10',
          notes: 'Reliable wholesale supplier',
          avatar: '🏢'
        },
        {
          id: '2',
          name: 'Jane Wholesale',
          company: 'Global Imports Ltd',
          email: 'jane@globalimports.com',
          phone: '+1234567891',
          address: '456 Trade St, Town',
          status: 'active',
          totalProducts: 78,
          totalOrders: 15,
          reliability: 'Medium',
          joinedDate: '2024-02-20',
          lastOrder: '2024-03-08',
          notes: 'Good for bulk orders',
          avatar: '🏭'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);
  
  // New supplier state
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    notes: '',
    avatar: '🏢'
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
    if (suppliers.length > 0) {
      setAnimateStats(true);
      const timer = setTimeout(() => setAnimateStats(false), 800);
      return () => clearTimeout(timer);
    }
  }, [suppliers]);
  
  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(search.toLowerCase()) ||
                         supplier.company.toLowerCase().includes(search.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(search.toLowerCase()) ||
                         supplier.phone.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || supplier.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  // Supplier stats
  const supplierStats = [
    { 
      label: 'Total Suppliers', 
      count: suppliers.length, 
      gradient: 'from-green-400 to-emerald-400',
      darkGradient: 'from-green-500 to-emerald-500',
      icon: <Truck className="h-5 w-5" />,
      color: isDarkMode ? 'bg-green-500' : 'bg-green-400'
    },
    { 
      label: 'Active', 
      count: suppliers.filter(s => s.status === 'active').length, 
      gradient: 'from-emerald-400 to-teal-400',
      darkGradient: 'from-emerald-500 to-teal-500',
      icon: <CheckCircle className="h-5 w-5" />,
      color: isDarkMode ? 'bg-emerald-500' : 'bg-emerald-400'
    },
    { 
      label: 'Products', 
      count: suppliers.reduce((sum, s) => sum + (s.totalProducts || 0), 0), 
      gradient: 'from-amber-400 to-orange-400',
      darkGradient: 'from-amber-500 to-orange-500',
      icon: <Package className="h-5 w-5" />,
      color: isDarkMode ? 'bg-amber-500' : 'bg-amber-400'
    }
  ];
  
  // Quick stats
  const quickStats = [
    {
      label: 'Avg Products per Supplier',
      value: suppliers.length > 0 
        ? (suppliers.reduce((sum, s) => sum + (s.totalProducts || 0), 0) / suppliers.length).toFixed(1)
        : '0',
      icon: TrendingUp,
      color: 'text-emerald-500'
    },
    {
      label: 'Active Orders',
      value: suppliers.reduce((sum, s) => sum + (s.totalOrders || 0), 0),
      icon: TrendingUp,
      color: 'text-blue-500'
    }
  ];
  
  // Handle add supplier
  const handleAddSupplier = async () => {
    if (newSupplier.name && newSupplier.email) {
      try {
        setIsProcessing(true);
        
        const supplierToAdd = {
          ...newSupplier,
          totalProducts: 0,
          totalOrders: 0,
          reliability: 'High',
          joinedDate: new Date().toISOString(),
          lastOrder: new Date().toISOString()
        };
        
        // Add to backend
        const response = await axios.post(`${API_BASE_URL}/suppliers`, supplierToAdd);
        
        if (response.data.success) {
          // Add to local state
          setSuppliers(prev => [...prev, {
            ...supplierToAdd,
            id: response.data.data?.id || `SUPP-${Date.now()}`
          }]);
          
          // Show success animation
          setAddSuccessAnimation(true);
          setTimeout(() => setAddSuccessAnimation(false), 1500);
          
          setShowAddModal(false);
          setNewSupplier({
            name: '',
            company: '',
            email: '',
            phone: '',
            address: '',
            status: 'active',
            notes: '',
            avatar: '🏢'
          });
          
          // Update stats
          setAnimateStats(true);
          setTimeout(() => setAnimateStats(false), 800);
        }
      } catch (error) {
        console.error("Error adding supplier:", error);
        alert('Failed to add supplier. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      alert('Please fill in name and email');
    }
  };
  
  // Handle edit supplier
  const handleEditSupplier = async () => {
    if (selectedSupplier) {
      try {
        setIsProcessing(true);
        await axios.put(`${API_BASE_URL}/suppliers/${selectedSupplier.id}`, selectedSupplier);
        
        // Update local state
        setSuppliers(prev => prev.map(s => 
          s.id === selectedSupplier.id ? selectedSupplier : s
        ));
        
        setShowEditModal(false);
        setSelectedSupplier(null);
        setAnimateStats(true);
        setTimeout(() => setAnimateStats(false), 800);
      } catch (error) {
        console.error("Error updating supplier:", error);
        alert('Failed to update supplier. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  // Handle delete supplier
  const handleDeleteSupplier = async () => {
    if (selectedSupplier) {
      try {
        setIsProcessing(true);
        await axios.delete(`${API_BASE_URL}/suppliers/${selectedSupplier.id}`);
        
        // Remove from local state
        setSuppliers(prev => prev.filter(s => s.id !== selectedSupplier.id));
        
        setShowDeleteModal(false);
        setSelectedSupplier(null);
        setAnimateStats(true);
        setTimeout(() => setAnimateStats(false), 800);
      } catch (error) {
        console.error("Error deleting supplier:", error);
        alert('Failed to delete supplier. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  // Handle export
  const handleExport = () => {
    if (suppliers.length === 0) {
      alert('No suppliers to export!');
      return;
    }
    
    const dataStr = JSON.stringify(suppliers, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'suppliers-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  // Handle clear all
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all suppliers? This cannot be undone.')) {
      // Clear all from backend
      suppliers.forEach(async supplier => {
        try {
          await axios.delete(`${API_BASE_URL}/suppliers/${supplier.id}`);
        } catch (error) {
          console.error(`Error deleting supplier ${supplier.id}:`, error);
        }
      });
      
      // Clear local state
      setSuppliers([]);
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
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);
  
  // Get avatar emoji
  const getAvatarEmoji = (company) => {
    if (!company) return '🏢';
    if (company.includes('Inc') || company.includes('Corp')) return '🏢';
    if (company.includes('Ltd') || company.includes('Limited')) return '🏭';
    if (company.includes('Global') || company.includes('World')) return '🌍';
    if (company.includes('Tech') || company.includes('Digital')) return '💻';
    if (company.includes('Food') || company.includes('Restaurant')) return '🍕';
    return '🏢';
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
      0%, 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.3), 0 0 10px rgba(16, 185, 129, 0.2); }
      50% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.5), 0 0 25px rgba(16, 185, 129, 0.3); }
    }
    
    @keyframes border-glow-dark {
      0%, 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.5), 0 0 10px rgba(16, 185, 129, 0.4); }
      50% { box-shadow: 0 0 15px rgba(16, 185, 129, 0.7), 0 0 25px rgba(16, 185, 129, 0.5); }
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
      background: linear-gradient(45deg, #10b981, #34d399, #6ee7b7);
      background-size: 400% 400%;
      border-radius: 12px;
      padding: 2px;
      animation: warm-gradient 8s ease infinite;
    }
    
    .card-border-dark {
      position: relative;
      background: linear-gradient(45deg, #047857, #10b981, #34d399);
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
      background: linear-gradient(45deg, #10b981, #34d399, #6ee7b7);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      background-size: 200% 200%;
      animation: warm-gradient 4s ease infinite;
    }
    
    .gradient-text-dark {
      background: linear-gradient(45deg, #34d399, #6ee7b7, #a7f3d0);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      background-size: 200% 200%;
      animation: warm-gradient 4s ease infinite;
    }
    
    .gradient-button {
      background: linear-gradient(45deg, #10b981, #34d399, #10b981);
      background-size: 200% 200%;
      animation: warm-gradient 3s ease infinite;
      position: relative;
      overflow: hidden;
    }
    
    .gradient-button-dark {
      background: linear-gradient(45deg, #047857, #10b981, #047857);
      background-size: 200% 200%;
      animation: warm-gradient 3s ease infinite;
      position: relative;
      overflow: hidden;
    }
    
    .page-number-active {
      background: linear-gradient(45deg, #10b981, #34d399, #10b981);
      background-size: 200% 200%;
      animation: warm-gradient 3s ease infinite;
      color: white;
      font-weight: bold;
    }
    
    .page-number-active-dark {
      background: linear-gradient(45deg, #047857, #10b981, #047857);
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
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading suppliers...</p>
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
              Supplier Added Successfully!
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <div className="animate-slide-up">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'gradient-text-dark' : 'gradient-text'}`}>
              Suppliers Management
            </h1>
            <p className={`mt-2 text-lg flex items-center gap-2 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
              {suppliers.length === 0 ? 'No suppliers yet. Add your first supplier!' : `Managing ${suppliers.length} suppliers`}
              <Sparkles className="h-4 w-4 text-green-500 animate-float" />
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 animate-slide-up"
              style={{animationDelay: '0.1s'}}
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            {suppliers.length > 0 && (
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
              {isAddingSupplier ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Supplier
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-6 pb-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {supplierStats.map((stat, index) => (
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
                        width: `${(stat.count / (suppliers.length || 1)) * 100}%`,
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
        {suppliers.length > 0 && (
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} mb-6`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
                      <input
                        type="text"
                        placeholder="Search suppliers by name, company, email, or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder border-green-800 focus:ring-green-400' : 'border-green-200 bg-white'}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder border-green-800 focus:ring-green-400' : 'border-green-200 bg-white'}`}
                    >
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                    <button 
                      onClick={handleResetFilters}
                      className={`flex items-center gap-2 px-4 py-3 font-medium rounded-lg transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-green-900 hover:bg-green-800 text-green-100' : 'bg-green-100 hover:bg-green-200 text-green-800 hover:text-green-900'}`}
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
        
        {/* Suppliers Table */}
        {suppliers.length > 0 ? (
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} mb-8`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className={`p-5 border-b ${isDarkMode ? 'border-green-800' : 'border-green-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>All Suppliers</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {filteredSuppliers.length === suppliers.length 
                        ? 'Showing all suppliers' 
                        : `Filtered: ${filteredSuppliers.length} of ${suppliers.length} suppliers`}
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
                      Showing <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{paginatedSuppliers.length}</span> of{' '}
                      <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{filteredSuppliers.length}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Supplier
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Contact
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Products
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Status
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Reliability
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                    {paginatedSuppliers.map((supplier) => (
                      <tr key={supplier.id} className={`${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center text-white text-lg">
                              {getAvatarEmoji(supplier.company)}
                            </div>
                            <div className="min-w-0">
                              <div className={`font-medium text-sm truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{supplier.name}</div>
                              <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{supplier.company}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{supplier.email}</div>
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{supplier.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {supplier.totalProducts} products
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {supplier.totalOrders} orders
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            supplier.status === 'active' 
                              ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700')
                              : (isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700')
                          }`}>
                            {supplier.status === 'active' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {supplier.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            supplier.reliability === 'High' 
                              ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700')
                              : supplier.reliability === 'Medium'
                              ? (isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700')
                              : (isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700')
                          }`}>
                            {supplier.reliability === 'High' ? '⭐ High' :
                             supplier.reliability === 'Medium' ? '⭐ Medium' : '⭐ Low'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedSupplier(supplier);
                                setShowViewModal(true);
                              }}
                              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'hover:bg-green-900/30' : 'hover:bg-green-50/50'}`}
                            >
                              <Eye className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedSupplier(supplier);
                                setShowEditModal(true);
                              }}
                              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'hover:bg-green-900/30' : 'hover:bg-green-50/50'}`}
                            >
                              <Edit className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </button>
                            <button 
                              ref={el => deleteButtonRefs.current[supplier.id] = el}
                              onClick={() => {
                                setSelectedSupplier(supplier);
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
                      className={`p-2 rounded-lg border transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'border-gray-700 bg-gray-800 hover:bg-green-900/30 text-gray-300 hover:text-gray-100' : 'border-gray-300 bg-gray-50 hover:bg-green-50/50 text-gray-700 hover:text-gray-900'}`}
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
                            : (isDarkMode ? 'border border-gray-700 bg-gray-800 text-gray-300 hover:bg-green-900/30 hover:text-gray-100' : 'border border-gray-300 bg-gray-50 text-gray-700 hover:bg-green-50/50 hover:text-gray-900')
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={`p-2 rounded-lg border transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'border-gray-700 bg-gray-800 hover:bg-green-900/30 text-gray-300 hover:text-gray-100' : 'border-gray-300 bg-gray-50 hover:bg-green-50/50 text-gray-700 hover:text-gray-900'}`}
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
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-green-200/30 to-emerald-200/30 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-4 animate-float">
                  <Truck className="h-10 w-10 text-green-500 dark:text-green-400" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'gradient-text-dark' : 'gradient-text'}`}>
                  No Suppliers Yet
                </h3>
                <p className={`mb-6 max-w-md mx-auto ${isDarkMode ? 'text-green-300/70' : 'text-green-800/70'}`}>
                  Get started by adding your first supplier. Manage vendors, track inventory, and streamline procurement.
                </p>
                <button 
                  ref={addButtonRef}
                  onClick={() => setShowAddModal(true)}
                  className={`inline-flex items-center gap-2 px-6 py-3 ${isDarkMode ? 'gradient-button-dark' : 'gradient-button'} text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
                >
                  <Plus className="h-5 w-5" />
                  Add Your First Supplier
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Stats */}
        {suppliers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'}`}>
              <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
                <div className="p-6">
                  <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Supplier Insights</h3>
                  <div className="space-y-4">
                    {quickStats.map((stat, index) => (
                      <div key={stat.label} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50/30 to-emerald-50/30 dark:from-green-900/20 dark:to-emerald-900/20">
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
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Supplier
                    </button>
                    <button 
                      onClick={handleExport}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-medium rounded-lg border transition-all duration-300 hover:scale-105 text-sm ${isDarkMode ? 'bg-gray-800 hover:bg-green-900/30 text-gray-300 hover:text-gray-100 border-gray-700' : 'bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-gray-900 border-gray-300'}`}
                    >
                      <Download className="h-4 w-4" />
                      Export Suppliers
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Modal */}
      {showDeleteModal && selectedSupplier && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'dark-modal-bg' : 'bg-black/50'} backdrop-blur-sm p-4`}>
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} w-full max-w-md`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 dark:from-red-500/30 dark:to-rose-500/30 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Delete Supplier</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>This action cannot be undone</p>
                  </div>
                </div>
                
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
                  Are you sure you want to delete <span className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>"{selectedSupplier.name}"</span>? 
                  All supplier data will be permanently removed.
                </p>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedSupplier(null);
                    }}
                    className={`px-4 py-2.5 font-medium rounded-lg border transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800 hover:bg-green-900/30 text-gray-300 hover:text-gray-100 border-gray-700' : 'bg-gray-50 hover:bg-green-50/50 text-gray-700 hover:text-gray-900 border-gray-300'}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setDeleteAnimation(true);
                      setTimeout(() => {
                        handleDeleteSupplier();
                        setDeleteAnimation(false);
                      }, 500);
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow hover:scale-105"
                  >
                    <Trash2 className="inline h-4 w-4 mr-2" />
                    Delete Supplier
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
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 flex items-center justify-center">
                      <Plus className="h-5 w-5 text-green-500 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Add New Supplier</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create a new supplier entry</p>
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
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      value={newSupplier.name}
                      onChange={(e) => setNewSupplier(prev => ({...prev, name: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      placeholder="Enter contact name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={newSupplier.company}
                      onChange={(e) => setNewSupplier(prev => ({...prev, company: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={newSupplier.email}
                      onChange={(e) => setNewSupplier(prev => ({...prev, email: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
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
                      value={newSupplier.phone}
                      onChange={(e) => setNewSupplier(prev => ({...prev, phone: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Address
                    </label>
                    <textarea
                      value={newSupplier.address}
                      onChange={(e) => setNewSupplier(prev => ({...prev, address: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      rows="3"
                      placeholder="Enter address"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <select
                      value={newSupplier.status}
                      onChange={(e) => setNewSupplier(prev => ({...prev, status: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
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
                      value={newSupplier.notes}
                      onChange={(e) => setNewSupplier(prev => ({...prev, notes: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
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
                    onClick={handleAddSupplier}
                    disabled={isProcessing}
                    className={`px-4 py-2.5 ${isDarkMode ? 'gradient-button-dark' : 'gradient-button'} text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50`}
                  >
                    {isProcessing ? (
                      <Loader2 className="inline h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="inline h-4 w-4 mr-2" />
                    )}
                    {isProcessing ? 'Adding...' : 'Add Supplier'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Modal */}
      {showEditModal && selectedSupplier && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'dark-modal-bg' : 'bg-black/50'} backdrop-blur-sm p-4`}>
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} w-full max-w-md`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-6 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 dark:from-green-500/30 dark:to-emerald-500/30 flex items-center justify-center">
                      <Edit className="h-5 w-5 text-green-500 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Edit Supplier</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Update supplier information</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedSupplier(null);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      value={selectedSupplier.name}
                      onChange={(e) => setSelectedSupplier(prev => ({...prev, name: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={selectedSupplier.company}
                      onChange={(e) => setSelectedSupplier(prev => ({...prev, company: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={selectedSupplier.email}
                      onChange={(e) => setSelectedSupplier(prev => ({...prev, email: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={selectedSupplier.phone}
                      onChange={(e) => setSelectedSupplier(prev => ({...prev, phone: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Address
                    </label>
                    <textarea
                      value={selectedSupplier.address}
                      onChange={(e) => setSelectedSupplier(prev => ({...prev, address: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <select
                      value={selectedSupplier.status}
                      onChange={(e) => setSelectedSupplier(prev => ({...prev, status: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
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
                      value={selectedSupplier.notes}
                      onChange={(e) => setSelectedSupplier(prev => ({...prev, notes: e.target.value}))}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${isDarkMode ? 'dark-input-bg dark-border-light dark-placeholder' : 'border-gray-300'}`}
                      rows="3"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedSupplier(null);
                    }}
                    className={`px-4 py-2.5 font-medium rounded-lg transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    Cancel
                  </button>
                  <button
                    ref={editModalButtonRef}
                    onClick={handleEditSupplier}
                    disabled={isProcessing}
                    className={`px-4 py-2.5 ${isDarkMode ? 'gradient-button-dark' : 'gradient-button'} text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50`}
                  >
                    {isProcessing ? (
                      <Loader2 className="inline h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="inline h-4 w-4 mr-2" />
                    )}
                    {isProcessing ? 'Updating...' : 'Update Supplier'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Modal */}
      {showViewModal && selectedSupplier && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'dark-modal-bg' : 'bg-black/50'} backdrop-blur-sm p-4`}>
          <div className={`${isDarkMode ? 'card-border-dark' : 'card-border'} w-full max-w-md`}>
            <div className={`${isDarkMode ? 'card-inner-dark' : 'card-inner'}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center text-white text-xl">
                      {getAvatarEmoji(selectedSupplier.company)}
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedSupplier.name}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedSupplier.company}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedSupplier(null);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50/50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</div>
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedSupplier.email}</div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50/50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</div>
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedSupplier.phone || 'Not provided'}</div>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50/50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Address</div>
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedSupplier.address || 'Not provided'}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50/50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Joined</div>
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selectedSupplier.joinedDate}</div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50/50'}`}>
                      <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</div>
                      <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                        selectedSupplier.status === 'active' 
                          ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700')
                          : (isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700')
                      }`}>
                        {selectedSupplier.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-emerald-50/50'}`}>
                      <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Products</div>
                      <div className={`text-lg font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>{selectedSupplier.totalProducts}</div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-emerald-50/50'}`}>
                      <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Orders</div>
                      <div className={`text-lg font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>{selectedSupplier.totalOrders}</div>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50/50'}`}>
                    <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Reliability</div>
                    <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                      selectedSupplier.reliability === 'High' 
                        ? (isDarkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700')
                        : selectedSupplier.reliability === 'Medium'
                        ? (isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-700')
                        : (isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700')
                    }`}>
                      {selectedSupplier.reliability === 'High' ? '⭐ High Reliability' :
                       selectedSupplier.reliability === 'Medium' ? '⭐ Medium Reliability' : '⭐ Low Reliability'}
                    </span>
                  </div>
                  
                  {selectedSupplier.notes && (
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50/50'}`}>
                      <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Notes</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedSupplier.notes}</div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-300 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedSupplier(null);
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
                    className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white font-medium rounded-lg transition-colors"
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

export default SupplierList;