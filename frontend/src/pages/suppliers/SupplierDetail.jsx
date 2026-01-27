import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      const res = await axios.get(`http://localhost:5000/api/suppliers/${id}`);
      
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
      await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
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
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Supplier Not Found</h2>
        <p className="text-gray-600 mb-4">The supplier you're looking for doesn't exist.</p>
        <Link to="/suppliers">
          <Button>Back to Suppliers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen p-6`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            to="/suppliers"
            className="inline-flex items-center text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Suppliers
          </Link>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center text-white text-2xl font-bold">
                {getAvatarEmoji(supplier.company)}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{supplier.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">Supplier Details</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/suppliers/edit/${id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Supplier
              </Button>
              <Button
                variant="danger"
                onClick={() => setDeleteModal(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Information</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <Building className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Contact Name</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{supplier.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <Building className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{supplier.company || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{supplier.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{supplier.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{supplier.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {supplier.notes && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notes</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{supplier.notes}</p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Supplier Details</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Supplier ID</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{supplier.id}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Joined Date</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{supplier.joinedDate}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Order</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{supplier.lastOrder}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      supplier.status === 'active' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                    }`}>
                      {supplier.status === 'active' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      {supplier.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Performance Metrics</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {supplier.totalProducts || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Products</div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {supplier.totalOrders || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Orders</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reliability Rating</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
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
            </div>
            
            <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">Supplier Summary</h3>
              <p className="text-green-700 dark:text-green-400 text-sm">
                This supplier has been providing {supplier.totalProducts || 0} products since {supplier.joinedDate}.
                {supplier.reliability === 'High' ? ' Highly reliable partner.' : 
                 supplier.reliability === 'Medium' ? ' Moderately reliable.' : ' Monitor reliability.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Supplier"
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete <span className="font-semibold">{supplier.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
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