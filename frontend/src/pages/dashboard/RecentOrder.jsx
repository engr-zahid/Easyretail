import React from 'react';
import { CheckCircle, Clock, XCircle, Truck, CreditCard, DollarSign } from 'lucide-react';

const RecentOrders = () => {
  const orders = [
    {
      id: '#ORD-001',
      customer: 'John Smith',
      amount: 245.99,
      status: 'completed',
      payment: 'Credit Card',
      date: 'Today, 10:24 AM',
      items: 3,
    },
    {
      id: '#ORD-002',
      customer: 'Emma Wilson',
      amount: 89.50,
      status: 'pending',
      payment: 'Cash',
      date: 'Today, 09:45 AM',
      items: 2,
    },
    {
      id: '#ORD-003',
      customer: 'Robert Johnson',
      amount: 456.75,
      status: 'processing',
      payment: 'Online',
      date: 'Today, 09:12 AM',
      items: 5,
    },
    {
      id: '#ORD-004',
      customer: 'Sarah Davis',
      amount: 120.00,
      status: 'cancelled',
      payment: 'Credit Card',
      date: 'Yesterday, 04:30 PM',
      items: 1,
    },
    {
      id: '#ORD-005',
      customer: 'Michael Brown',
      amount: 789.25,
      status: 'completed',
      payment: 'Bank Transfer',
      date: 'Yesterday, 02:15 PM',
      items: 7,
    },
    {
      id: '#ORD-006',
      customer: 'Lisa Anderson',
      amount: 65.99,
      status: 'pending',
      payment: 'Cash',
      date: 'Yesterday, 11:45 AM',
      items: 2,
    },
    {
      id: '#ORD-007',
      customer: 'David Miller',
      amount: 345.60,
      status: 'processing',
      payment: 'Credit Card',
      date: 'Nov 24, 09:30 AM',
      items: 4,
    },
    {
      id: '#ORD-008',
      customer: 'Jennifer Taylor',
      amount: 199.99,
      status: 'completed',
      payment: 'Online',
      date: 'Nov 24, 08:15 AM',
      items: 3,
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'processing':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      case 'processing':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return '';
    }
  };

  const getPaymentIcon = (payment) => {
    switch (payment) {
      case 'Credit Card':
        return <CreditCard className="h-3 w-3" />;
      case 'Cash':
        return <DollarSign className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-accent-800 dark:text-white mb-1">
            Recent Orders
          </h2>
          <p className="text-text-secondary dark:text-gray-400 text-sm">
            Latest transactions and order status
          </p>
        </div>
        <button className="text-sm text-primary-600 dark:text-amber-400 hover:text-primary-700 dark:hover:text-amber-300 font-medium">
          View All →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary dark:text-gray-400">
                Order ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary dark:text-gray-400">
                Customer
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary dark:text-gray-400">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary dark:text-gray-400">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary dark:text-gray-400">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order.id}
                className="border-b border-border dark:border-gray-700 hover:bg-muted-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-accent-800 dark:text-white">{order.id}</div>
                  <div className="text-xs text-text-muted dark:text-gray-500 flex items-center mt-1">
                    <span className="mr-2">🛒</span>
                    {order.items} items
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-accent-800 dark:text-white">{order.customer}</div>
                  <div className="text-xs text-text-muted dark:text-gray-500 flex items-center mt-1">
                    {getPaymentIcon(order.payment)}
                    <span className="ml-1">{order.payment}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-lg text-accent-800 dark:text-white">
                    ${order.amount.toFixed(2)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-text-secondary dark:text-gray-400">{order.date}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t border-border dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">156</div>
            <div className="text-sm text-text-secondary dark:text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">24</div>
            <div className="text-sm text-text-secondary dark:text-gray-400">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">18</div>
            <div className="text-sm text-text-secondary dark:text-gray-400">Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">7</div>
            <div className="text-sm text-text-secondary dark:text-gray-400">Cancelled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;