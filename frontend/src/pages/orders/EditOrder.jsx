import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  ShoppingCart,
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useDarkMode } from '../../context/DarkModeContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../utils/api';

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('PENDING');
  const [notes, setNotes] = useState('');
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/${id}`);
      const orderData = response.data.data;
      setOrder(orderData);
      setItems(orderData.items || []);
      setStatus(orderData.status);
      setNotes(orderData.notes || '');
      setCustomer(orderData.customer || null);
    } catch (error) {
      console.error('Error fetching order:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...items];
    updatedItems[index].quantity = parseInt(newQuantity) || 1;
    setItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update order status and notes
      await api.patch(`/orders/${id}/status`, { status });
      
      // Update order notes (you might need a separate endpoint for this)
      // For now, we'll update it in the status update if your backend supports it
      await api.patch(`/orders/${id}`, { 
        status, 
        notes,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      });

      navigate(`/orders/${id}`);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Order not found</h3>
        <Button onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/orders/${id}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Order</h1>
              <p className="text-gray-500">{order.orderNumber}</p>
            </div>
          </div>
          
          <Button
            type="submit"
            form="edit-order-form"
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <form id="edit-order-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Order Items */}
            <div className="lg:col-span-2">
              <div className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <h2 className="text-xl font-bold mb-6">Order Items</h2>
                
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No items in this order</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.product?.name || 'Product'}</h4>
                            <p className="text-gray-500 text-sm">
                              Price: ${parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(index, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(index, e.target.value)}
                              className="w-20 text-center"
                            />
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(index, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          
                          <div className="text-right w-24">
                            <p className="font-bold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Total */}
                    <div className="pt-4 border-t">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-green-600">
                          ${calculateTotal()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Details */}
            <div className="space-y-6">
              {/* Status */}
              <div className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <h2 className="text-xl font-bold mb-6">Order Status</h2>
                
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>

              {/* Customer Info */}
              <div className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <h2 className="text-xl font-bold mb-6">Customer</h2>
                
                {customer ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Name</label>
                      <p className="font-medium">{customer.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Contact</label>
                      <p className="font-medium">{customer.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium">{customer.email || 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Walk-in Customer
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}>
                <h2 className="text-xl font-bold mb-6">Order Notes</h2>
                
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="4"
                  className={`w-full p-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  }`}
                  placeholder="Add any notes or special instructions..."
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditOrder;