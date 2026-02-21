import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  getCustomer, 
  createCustomer, 
  updateCustomer 
} from '../../utils/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loader from '../../components/common/Loader';
import { ArrowLeft, Save, User } from 'lucide-react';

const AddEditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchCustomer();
    }
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await getCustomer(id);
      setFormData(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError('Failed to load customer data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      if (isEditMode) {
        await updateCustomer(id, formData);
      } else {
        await createCustomer(formData);
      }
      
      navigate('/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
      setError(error.response?.data?.error || 'Failed to save customer. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={`min-h-screen ${isEditMode ? 'bg-gray-50 dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'} p-4 sm:p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="mb-4 sm:mb-6">
          <Link
            to="/customers"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Back to Customers
          </Link>
          
          <div className="flex items-center">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <User className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="ml-3 sm:ml-4">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {isEditMode ? 'Edit Customer' : 'Add New Customer'}
              </h1>
              <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">
                {isEditMode 
                  ? 'Update customer information and details' 
                  : 'Add a new customer to your system'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                Customer Information
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Name Field - Full width on mobile */}
                <div className="w-full">
                  <Input
                    label="Full Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="John Doe"
                    required
                    className="w-full text-sm sm:text-base"
                  />
                </div>
                
                {/* Email Field */}
                <div className="w-full">
                  <Input
                    label="Email Address *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="john@example.com"
                    required
                    className="w-full text-sm sm:text-base"
                  />
                </div>
                
                {/* Phone Field */}
                <div className="w-full">
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="+1 (555) 123-4567"
                    className="w-full text-sm sm:text-base"
                  />
                </div>
                
                {/* Address Field */}
                <div className="w-full">
                  <div className="mb-1 sm:mb-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address
                    </label>
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="123 Main St, City, State, ZIP Code"
                  />
                </div>
              </div>
            </div>
            
            {/* Form Actions - Mobile Optimized */}
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Fields marked with * are required
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/customers')}
                    disabled={saving}
                    className="w-full sm:w-auto text-sm sm:text-base order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base order-1 sm:order-2"
                  >
                    {saving ? (
                      <>
                        <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span className="text-sm sm:text-base">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="text-sm sm:text-base">{isEditMode ? 'Update Customer' : 'Create Customer'}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditCustomer;