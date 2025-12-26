import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const SalesChart = ({ timeRange, storeFilter }) => {
  // Sample chart data based on time range
  const getChartData = () => {
    if (timeRange === 'today') {
      return [
        { time: '9 AM', sales: 4000, orders: 24, visitors: 2400 },
        { time: '10 AM', sales: 3000, orders: 19, visitors: 2210 },
        { time: '11 AM', sales: 5000, orders: 29, visitors: 2290 },
        { time: '12 PM', sales: 7800, orders: 39, visitors: 2000 },
        { time: '1 PM', sales: 6890, orders: 32, visitors: 2181 },
        { time: '2 PM', sales: 8390, orders: 42, visitors: 2500 },
        { time: '3 PM', sales: 7490, orders: 37, visitors: 2100 },
        { time: '4 PM', sales: 10300, orders: 51, visitors: 2400 },
        { time: '5 PM', sales: 9580, orders: 48, visitors: 2300 },
      ];
    } else if (timeRange === 'week') {
      return [
        { day: 'Mon', sales: 4000, orders: 240, visitors: 2400 },
        { day: 'Tue', sales: 3000, orders: 190, visitors: 2210 },
        { day: 'Wed', sales: 5000, orders: 290, visitors: 2290 },
        { day: 'Thu', sales: 7800, orders: 390, visitors: 2000 },
        { day: 'Fri', sales: 10890, orders: 520, visitors: 2181 },
        { day: 'Sat', sales: 13900, orders: 620, visitors: 2500 },
        { day: 'Sun', sales: 9490, orders: 370, visitors: 2100 },
      ];
    } else {
      return [
        { month: 'Jan', sales: 40000, orders: 1240, visitors: 12400 },
        { month: 'Feb', sales: 30000, orders: 1190, visitors: 12210 },
        { month: 'Mar', sales: 50000, orders: 1290, visitors: 12290 },
        { month: 'Apr', sales: 78000, orders: 1390, visitors: 12000 },
        { month: 'May', sales: 108900, orders: 1520, visitors: 12181 },
        { month: 'Jun', sales: 139000, orders: 1620, visitors: 12500 },
        { month: 'Jul', sales: 149000, orders: 1720, visitors: 13100 },
        { month: 'Aug', sales: 128900, orders: 1620, visitors: 12800 },
        { month: 'Sep', sales: 158000, orders: 1820, visitors: 13500 },
        { month: 'Oct', sales: 189000, orders: 1920, visitors: 14200 },
        { month: 'Nov', sales: 219000, orders: 2120, visitors: 15200 },
        { month: 'Dec', sales: 259000, orders: 2420, visitors: 16200 },
      ];
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-border dark:border-gray-700">
          <p className="font-semibold text-accent-800 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'sales' ? '$' : ''}{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-accent-800 dark:text-white mb-1">
            Sales Overview
          </h2>
          <p className="text-text-secondary dark:text-gray-400 text-sm">
            Revenue, orders, and customer trends
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-text-secondary dark:text-gray-400">Revenue</span>
          </div>
          <div className="flex items-center ml-4">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-text-secondary dark:text-gray-400">Orders</span>
          </div>
          <div className="flex items-center ml-4">
            <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
            <span className="text-sm text-text-secondary dark:text-gray-400">Visitors</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={getChartData()}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={timeRange === 'today' ? 'time' : timeRange === 'week' ? 'day' : 'month'}
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickFormatter={(value) => `$${value/1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
              strokeWidth={2}
              name="Orders"
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.1}
              strokeWidth={2}
              name="Visitors"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-4 border-t border-border dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-text-secondary dark:text-gray-400">Avg. Daily Sales</p>
          <p className="text-lg font-semibold text-accent-800 dark:text-white">$8,942</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary dark:text-gray-400">Total Orders</p>
          <p className="text-lg font-semibold text-accent-800 dark:text-white">1,234</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary dark:text-gray-400">Conversion Rate</p>
          <p className="text-lg font-semibold text-accent-800 dark:text-white">3.24%</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary dark:text-gray-400">Avg. Order Value</p>
          <p className="text-lg font-semibold text-accent-800 dark:text-white">$89.54</p>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;