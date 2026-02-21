import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Building,
  Truck,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  X
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/ui/Modal';

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    fetchSupplier();
  }, [id]);

  useEffect(() => {
    const handleThemeChange = (event) => {
      setIsDarkMode(event.detail);
    };
    
    window.addEventListener('themeChange', handleThemeChange);
    
    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  const fetchSupplier = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/suppliers/${id}`);
      
      if (res.data && res.data.success) {
        const supplierData = res.data.data;
        setSupplier({
          ...supplierData,
          joinedDate: supplierData.createdAt ? new Date(supplierData.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'N/A',
          lastOrder: supplierData.updatedAt ? new Date(supplierData.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'N/A'
        });
        setError('');
      } else {
        setError('Supplier not found');
      }
    } catch (err) {
      console.error("Error fetching supplier:", err);
      setError('Failed to load supplier details. Please try again.');
      // Demo data for testing
      setSupplier({
        id: id,
        name: 'Demo Supplier',
        company: 'Demo Company Inc.',
        email: 'demo@example.com',
        phone: '+1234567890',
        address: '123 Business St, City, Country',
        status: 'active',
        totalProducts: 45,
        totalOrders: 23,
        reliability: 'High',
        joinedDate: 'January 15, 2024',
        lastOrder: 'March 10, 2024',
        notes: 'Reliable supplier with good track record.',
        avatar: '🏢'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/suppliers/${id}`);
      navigate('/suppliers');
    } catch (error) {
      console.error("Error deleting supplier:", error);
      setError('Failed to delete supplier. Please try again.');
    }
  };

  const getAvatarEmoji = (company) => {
    if (!company) return '🏢';
    if (company.includes('Inc') || company.includes('Corp')) return '🏢';
    if (company.includes('Ltd') || company.includes('Limited')) return '🏭';
    if (company.includes('Global') || company.includes('World')) return '🌍';
    return '🏢';
  };

  if (loading) return <Loader />;

  if (!supplier && !loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 sm:p-6`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className={`text-lg sm:text-xl font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Supplier Not Found</h2>
          <p className={`text-sm sm:text-base mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>The supplier you're looking for doesn't exist.</p>
          <Link to="/suppliers">
            <Button>Back to Suppliers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen p-4 sm:p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="mb-4 sm:mb-6">
          <Link
            to="/suppliers"
            className="inline-flex items-center text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Back to Suppliers
          </Link>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                {getAvatarEmoji(supplier.company)}
              </div>
              <div className="ml-3 sm:ml-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{supplier.name}</h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Supplier Details</p>
              </div>
            </div>
            
            <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => navigate(`/suppliers/edit/${id}`)}
                className="flex-1 sm:flex-initial text-sm sm:text-base"
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="xs:inline">Edit</span>
              </Button>
              <Button
                variant="danger"
                onClick={() => setDeleteModal(true)}
                className="flex-1 sm:flex-initial text-sm sm:text-base"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="xs:inline">Delete</span>
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Main Content - Mobile Optimized Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Information</h2>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  {/* Contact Name */}
                  <div className="flex items-start">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                      <Building className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Contact Name</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words">{supplier.name}</p>
                    </div>
                  </div>
                  
                  {/* Company */}
                  <div className="flex items-start">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                      <Building className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Company</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words">{supplier.company || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-start">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words">{supplier.email}</p>
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div className="flex items-start">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                      <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words">{supplier.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div className="flex items-start">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                      <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Address</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words">{supplier.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notes Section */}
            {supplier.notes && (
              <div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Notes</h2>
                </div>
                <div className="p-4 sm:p-6">
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">{supplier.notes}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Details & Metrics */}
          <div>
            {/* Supplier Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Supplier Details</h2>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Supplier ID</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words">{supplier.id}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="ml-3 sm:ml-4 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Joined Date</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words">{supplier.joinedDate}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Last Order</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">{supplier.lastOrder}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">Status</p>
                    <span className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                      supplier.status === 'active' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                    }`}>
                      {supplier.status === 'active' ? (
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      {supplier.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Performance Metrics */}
            <div className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">Performance Metrics</h2>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center p-2 sm:p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                      {supplier.totalProducts || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Products</div>
                  </div>
                  
                  <div className="text-center p-2 sm:p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {supplier.totalOrders || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Orders</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2">Reliability Rating</p>
                  <span className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                    supplier.reliability === 'High' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : supplier.reliability === 'Medium'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {supplier.reliability === 'High' ? '⭐ High' :
                     supplier.reliability === 'Medium' ? '⭐ Medium' : '⭐ Low'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Summary Card */}
            <div className="mt-4 sm:mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-green-900 dark:text-green-300 mb-2">Supplier Summary</h3>
              <p className="text-xs sm:text-sm text-green-700 dark:text-green-400">
                This supplier has been providing {supplier.totalProducts || 0} products since {supplier.joinedDate}.
                {supplier.reliability === 'High' ? ' Highly reliable partner.' : 
                 supplier.reliability === 'Medium' ? ' Moderately reliable.' : ' Monitor reliability.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal - Mobile Optimized */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Supplier"
      >
        <div className="p-4 sm:p-6">
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete <span className="font-semibold">{supplier?.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal(false)}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              Delete Supplier
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SupplierDetail;