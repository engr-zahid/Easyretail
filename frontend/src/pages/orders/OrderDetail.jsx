import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Printer,
  Download,
  ArrowLeft,
  User,
  Calendar,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Edit
} from 'lucide-react';
import { useDarkMode } from '../../context/DarkModeContext';
import Button from '../../components/ui/Button';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      fetchOrder();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const downloadInvoice = () => {
    // Implement PDF generation/download
    alert('Invoice download feature coming soon!');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'PENDING': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const statusSteps = [
    { status: 'PENDING', label: 'Order Placed' },
    { status: 'PROCESSING', label: 'Processing' },
    { status: 'COMPLETED', label: 'Completed' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/orders')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
              <p className="text-gray-500">Order Details</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={downloadInvoice}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={printInvoice}
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button
              onClick={() => navigate(`/orders/edit/${id}`)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <h2 className="text-xl font-bold mb-6">Order Status</h2>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isDarkMode 
                      ? `bg-${getStatusColor(order.status)}-900 text-${getStatusColor(order.status)}-300`
                      : `bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map(status => (
                    <Button
                      key={status}
                      variant={order.status === status ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusUpdate(status)}
                      disabled={updating || order.status === status}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600 ml-3"></div>
                {statusSteps.map((step, index) => (
                  <div key={step.status} className="flex items-center mb-8">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ${
                      getStepStatus(order.status, step.status, index)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">{step.label}</p>
                      <p className="text-sm text-gray-500">
                        {getStepDate(order, step.status)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <h2 className="text-xl font-bold mb-6">Order Items</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className="text-left py-3 font-medium">Product</th>
                      <th className="text-left py-3 font-medium">Price</th>
                      <th className="text-left py-3 font-medium">Quantity</th>
                      <th className="text-left py-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <Package className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-medium">{item.product?.name}</p>
                              <p className="text-sm text-gray-500">SKU: {item.product?.sku || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">${parseFloat(item.price).toFixed(2)}</td>
                        <td className="py-4">{item.quantity}</td>
                        <td className="py-4 font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Summary & Customer */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Date</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Number</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod || 'CASH'}</span>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between mb-3">
                    <span>Subtotal</span>
                    <span>${parseFloat(order.totalAmount).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between mb-3">
                    <span>Tax (10%)</span>
                    <span>${(parseFloat(order.totalAmount) * 0.1).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>Total</span>
                    <span className="text-green-600">
                      ${(parseFloat(order.totalAmount) * 1.1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Customer Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <h2 className="text-xl font-bold mb-6">Customer Information</h2>
              
              {order.customer ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{order.customer.name}</p>
                      <p className="text-gray-500">Customer</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{order.customer.phone || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{order.customer.email || 'N/A'}</span>
                    </div>
                    
                    {order.customer.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <span className="text-sm">{order.customer.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <User className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">Walk-in Customer</p>
                  <p className="text-sm text-gray-400">No customer account</p>
                </div>
              )}
            </motion.div>

            {/* Order Notes */}
            {order.notes && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
              >
                <h2 className="text-xl font-bold mb-6">Order Notes</h2>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {order.notes}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper functions
const getStatusColor = (status) => {
  switch(status) {
    case 'PENDING': return 'yellow';
    case 'PROCESSING': return 'blue';
    case 'COMPLETED': return 'green';
    case 'CANCELLED': return 'red';
    default: return 'gray';
  }
};

const getStepStatus = (orderStatus, stepStatus, stepIndex) => {
  const statusOrder = ['PENDING', 'PROCESSING', 'COMPLETED'];
  const orderIndex = statusOrder.indexOf(orderStatus);
  return stepIndex <= orderIndex;
};

const getStepDate = (order, stepStatus) => {
  if (stepStatus === 'PENDING') return formatDate(order.createdAt);
  if (stepStatus === 'PROCESSING' && order.status !== 'PENDING') 
    return formatDate(order.updatedAt);
  if (stepStatus === 'COMPLETED' && order.status === 'COMPLETED') 
    return formatDate(order.updatedAt);
  return 'Pending';
};

export default OrderDetail;