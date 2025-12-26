import React from 'react';
import { 
  FiShoppingCart, 
  FiPackage, 
  FiUsers, 
  FiDollarSign, 
  FiPrinter, 
  FiSettings,
  FiBarChart2,
  FiFileText
} from 'react-icons/fi';

const QuickActions = () => {
  const actions = [
    {
      icon: <FiShoppingCart className="w-5 h-5" />,
      title: 'New Sale',
      description: 'Start a new POS transaction',
      color: 'bg-blue-500',
      link: '/pos'
    },
    {
      icon: <FiPackage className="w-5 h-5" />,
      title: 'Add Product',
      description: 'Add new inventory item',
      color: 'bg-green-500',
      link: '/inventory/add'
    },
    {
      icon: <FiUsers className="w-5 h-5" />,
      title: 'Add Customer',
      description: 'Create new customer profile',
      color: 'bg-purple-500',
      link: '/customers/add'
    },
    {
      icon: <FiDollarSign className="w-5 h-5" />,
      title: 'Create Invoice',
      description: 'Generate customer invoice',
      color: 'bg-yellow-500',
      link: '/invoices/create'
    },
    {
      icon: <FiPrinter className="w-5 h-5" />,
      title: 'Print Report',
      description: 'Generate daily sales report',
      color: 'bg-red-500',
      link: '/reports'
    },
    {
      icon: <FiBarChart2 className="w-5 h-5" />,
      title: 'View Analytics',
      description: 'Business performance insights',
      color: 'bg-indigo-500',
      link: '/analytics'
    },
    {
      icon: <FiFileText className="w-5 h-5" />,
      title: 'Stock Transfer',
      description: 'Transfer between warehouses',
      color: 'bg-pink-500',
      link: '/inventory/transfer'
    },
    {
      icon: <FiSettings className="w-5 h-5" />,
      title: 'POS Settings',
      description: 'Configure POS terminal',
      color: 'bg-gray-500',
      link: '/settings/pos'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Frequently used shortcuts</p>
        </div>
        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300">
          View All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <a
            key={index}
            href={action.link}
            className="group block p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`${action.color} p-3 rounded-full text-white mb-3 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{action.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Pro Tip</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Press <kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs">Ctrl + N</kbd> for new sale
            </p>
          </div>
          <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300">
            Set Hotkeys
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;