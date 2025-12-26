import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const StorePerformance = () => {
  const storeData = [
    { name: 'Freshmart', sales: 12500, customers: 450, efficiency: 85 },
    { name: 'Grocery Apex', sales: 8900, customers: 320, efficiency: 78 },
    { name: 'Grocery Bevy', sales: 11200, customers: 410, efficiency: 82 },
    { name: 'Grocery Eden', sales: 7600, customers: 280, efficiency: 75 },
    { name: 'Super Mart', sales: 15400, customers: 520, efficiency: 90 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Store Performance</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly sales across stores</p>
        </div>
        <select className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2">
          <option>Last 30 days</option>
          <option>Last Quarter</option>
          <option>Last Year</option>
        </select>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={storeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Legend />
            <Bar dataKey="sales" name="Sales ($)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="customers" name="Customers" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Top Performing Store</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Freshmart</p>
            </div>
            <div className="text-green-600 dark:text-green-400 font-bold">+15.4%</div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Transaction Value</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">$42.50</p>
            </div>
            <div className="text-blue-600 dark:text-blue-400 font-bold">+8.2%</div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">24.7%</p>
            </div>
            <div className="text-purple-600 dark:text-purple-400 font-bold">+3.1%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePerformance;