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
  User,
  DollarSign,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  X
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/ui/Modal';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    fetchCustomer();
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

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/customers/${id}`);
      
      if (res.data && res.data.success) {
        const customerData = res.data.data;
        setCustomer({
          ...customerData,
          joinedDate: customerData.createdAt ? new Date(customerData.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'N/A',
          lastActive: customerData.updatedAt ? new Date(customerData.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'N/A'
        });
        setError('');
      } else {
        setError('Customer not found');
      }
    } catch (err) {
      console.error("Error fetching customer:", err);
      setError('Failed to load customer details. Please try again.');
      // Demo data for testing
      setCustomer({
        id: id,
        name: 'Demo Customer',
        email: 'demo@example.com',
        phone: '+1234567890',
        address: '123 Main St, City, Country',
        status: 'active',
        totalOrders: 15,
        totalSpent: '1250.50',
        joinedDate: 'January 15, 2024',
        lastActive: 'March 10, 2024',
        notes: 'Regular customer with good purchase history.',
        avatar: '👤'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      navigate('/customers');
    } catch (error) {
      console.error("Error deleting customer:", error);
      setError('Failed to delete customer. Please try again.');
    }
  };

  const getAvatarEmoji = (name) => {
    if (!name) return '👤';
    const firstLetter = name.charAt(0).toUpperCase();
    if (firstLetter >= 'A' && firstLetter <= 'D') return '👨';
    if (firstLetter >= 'E' && firstLetter <= 'H') return '👩';
    if (firstLetter >= 'I' && firstLetter <= 'L') return '👨‍💼';
    if (firstLetter >= 'M' && firstLetter <= 'P') return '👩‍💼';
    return '👤';
  };

  if (loading) return <Loader />;

  if (!customer && !loading) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Customer Not Found</h2>
        <p className="text-gray-600 mb-4">The customer you're looking for doesn't exist.</p>
        <Link to="/customers">
          <Button>Back to Customers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen p-6`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            to="/customers"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Link>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold">
                {getAvatarEmoji(customer.name)}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{customer.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">Customer Details</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/customers/edit/${id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Customer
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
                    <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{customer.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{customer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{customer.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{customer.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {customer.notes && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notes</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{customer.notes}</p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Customer Details</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{customer.id}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Joined Date</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{customer.joinedDate}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Active</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{customer.lastActive}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      customer.status === 'active' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                    }`}>
                      {customer.status === 'active' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      {customer.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Purchase History</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {customer.totalOrders || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Orders</div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${customer.totalSpent || '0.00'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Spent</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                    <span>Good customer retention</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Customer Summary</h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                This customer has been a member since {customer.joinedDate}, 
                placed {customer.totalOrders || 0} orders, 
                and spent a total of ${customer.totalSpent || '0.00'}.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Customer"
      >
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete <span className="font-semibold">{customer.name}</span>?
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
              Delete Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerDetail;