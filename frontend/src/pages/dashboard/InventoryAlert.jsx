import React from 'react';
import { FiAlertTriangle, FiPackage, FiClock, FiArrowUpRight } from 'react-icons/fi';

const InventoryAlert = () => {
  const alerts = [
    {
      id: 1,
      product: 'iPhone 14 64GB',
      sku: 'PT-001',
      currentStock: 8,
      minStock: 15,
      status: 'critical',
      lastOrder: '2024-01-10',
      category: 'Mobiles'
    },
    {
      id: 2,
      product: 'AirPods Pro',
      sku: 'PT-005',
      currentStock: 12,
      minStock: 20,
      status: 'warning',
      lastOrder: '2024-01-12',
      category: 'Headphones'
    },
    {
      id: 3,
      product: 'Red Nike Laser',
      sku: 'PT-004',
      currentStock: 22,
      minStock: 30,
      status: 'warning',
      lastOrder: '2024-01-08',
      category: 'Shoes'
    },
    {
      id: 4,
      product: 'MacBook Pro M2',
      sku: 'PT-002',
      currentStock: 5,
      minStock: 10,
      status: 'critical',
      lastOrder: '2024-01-05',
      category: 'Laptops'
    },
    {
      id: 5,
      product: 'Timex Black Silver',
      sku: 'PT-009',
      currentStock: 14,
      minStock: 25,
      status: 'warning',
      lastOrder: '2024-01-09',
      category: 'Watches'
    },
  ];

  const expiredProducts = [
    { name: 'Vitamin C Supplements', expired: '2024-01-15', quantity: 45 },
    { name: 'Protein Bars', expired: '2024-01-20', quantity: 120 },
    { name: 'Face Cream', expired: '2024-01-25', quantity: 32 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical': return <FiAlertTriangle className="w-4 h-4" />;
      case 'warning': return <FiClock className="w-4 h-4" />;
      default: return <FiPackage className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3">
              <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inventory Alerts</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Low stock and expiring items</p>
            </div>
          </div>
        </div>
        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-4 ${getStatusColor(alert.status)}`}>
                {getStatusIcon(alert.status)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{alert.product}</h4>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">SKU: {alert.sku}</span>
                  <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded">{alert.category}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end space-x-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Stock</p>
                  <p className={`text-lg font-bold ${
                    alert.status === 'critical' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {alert.currentStock}
                  </p>
                </div>
                <div className="w-24">
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        alert.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${(alert.currentStock / alert.minStock) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Min: {alert.minStock}</p>
                </div>
                <button className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                  <FiArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Expiring Soon</h4>
          <span className="text-sm text-red-600 dark:text-red-400">Within 30 days</span>
        </div>
        <div className="space-y-3">
          {expiredProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3">
                  <FiClock className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expires: {product.expired}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-red-600 dark:text-red-400 font-medium">{product.quantity} units</p>
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  Move to clearance
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Total inventory value: <span className="font-bold">$485,650</span>
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <span className="text-green-600 dark:text-green-400">+8.5%</span> from last month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAlert;