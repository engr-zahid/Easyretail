import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const SalesOverview = () => {
  const [timeRange, setTimeRange] = useState('monthly');

  const monthlyData = [
    { month: 'Jan', revenue: 45000, orders: 320, avgOrder: 140.6 },
    { month: 'Feb', revenue: 52000, orders: 380, avgOrder: 136.8 },
    { month: 'Mar', revenue: 61000, orders: 420, avgOrder: 145.2 },
    { month: 'Apr', revenue: 58000, orders: 410, avgOrder: 141.5 },
    { month: 'May', revenue: 72000, orders: 490, avgOrder: 146.9 },
    { month: 'Jun', revenue: 69000, orders: 470, avgOrder: 146.8 },
    { month: 'Jul', revenue: 78000, orders: 520, avgOrder: 150.0 },
  ];

  const weeklyData = [
    { day: 'Mon', revenue: 8500, orders: 65 },
    { day: 'Tue', revenue: 9200, orders: 72 },
    { day: 'Wed', revenue: 8800, orders: 68 },
    { day: 'Thu', revenue: 10500, orders: 78 },
    { day: 'Fri', revenue: 12500, orders: 92 },
    { day: 'Sat', revenue: 14200, orders: 105 },
    { day: 'Sun', revenue: 9800, orders: 75 },
  ];

  const data = timeRange === 'monthly' ? monthlyData : weeklyData;
  const xAxisKey = timeRange === 'monthly' ? 'month' : 'day';

  const metrics = [
    { label: 'Total Revenue', value: '$385,000', change: '+12.5%', trend: 'up', color: 'text-green-600' },
    { label: 'Total Orders', value: '3,010', change: '+8.2%', trend: 'up', color: 'text-blue-600' },
    { label: 'Avg. Order Value', value: '$127.90', change: '+4.1%', trend: 'up', color: 'text-purple-600' },
    { label: 'Conversion Rate', value: '24.7%', change: '-1.2%', trend: 'down', color: 'text-red-600' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Overview</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Revenue and order trends</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          {['weekly', 'monthly', 'quarterly'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-lg capitalize ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              <div className={`flex items-center ${metric.color}`}>
                {metric.trend === 'up' ? (
                  <FiTrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <FiTrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">{metric.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey={xAxisKey} stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue ($)"
              stroke="#3B82F6"
              fill="url(#colorRevenue)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Peak Sales Hours</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Best performing time slots</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-white">2:00 PM - 5:00 PM</p>
            <p className="text-sm text-green-600 dark:text-green-400">+35% above average</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;