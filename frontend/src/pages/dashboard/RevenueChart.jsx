import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const RevenueChart = ({ dateRange }) => {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState('area'); // 'area', 'line', or 'bar'
  
  // Sample data based on date range
  const getChartData = () => {
    const baseData = {
      today: [
        { time: '9 AM', revenue: 1200, orders: 14, profit: 300 },
        { time: '10 AM', revenue: 1800, orders: 22, profit: 450 },
        { time: '11 AM', revenue: 2400, orders: 28, profit: 600 },
        { time: '12 PM', revenue: 3200, orders: 35, profit: 800 },
        { time: '1 PM', revenue: 2800, orders: 31, profit: 700 },
        { time: '2 PM', revenue: 3500, orders: 38, profit: 875 },
        { time: '3 PM', revenue: 4200, orders: 45, profit: 1050 },
        { time: '4 PM', revenue: 3800, orders: 41, profit: 950 },
        { time: '5 PM', revenue: 3100, orders: 34, profit: 775 },
        { time: '6 PM', revenue: 2500, orders: 29, profit: 625 }
      ],
      week: [
        { day: 'Mon', revenue: 8500, orders: 95, profit: 2125 },
        { day: 'Tue', revenue: 9200, orders: 102, profit: 2300 },
        { day: 'Wed', revenue: 10500, orders: 118, profit: 2625 },
        { day: 'Thu', revenue: 9800, orders: 108, profit: 2450 },
        { day: 'Fri', revenue: 12500, orders: 138, profit: 3125 },
        { day: 'Sat', revenue: 14500, orders: 158, profit: 3625 },
        { day: 'Sun', revenue: 11000, orders: 122, profit: 2750 }
      ],
      month: [
        { week: 'Week 1', revenue: 38500, orders: 425, profit: 9625 },
        { week: 'Week 2', revenue: 42000, orders: 462, profit: 10500 },
        { week: 'Week 3', revenue: 45500, orders: 498, profit: 11375 },
        { week: 'Week 4', revenue: 48000, orders: 525, profit: 12000 }
      ],
      year: [
        { month: 'Jan', revenue: 152000, orders: 1685, profit: 38000 },
        { month: 'Feb', revenue: 148000, orders: 1642, profit: 37000 },
        { month: 'Mar', revenue: 165000, orders: 1825, profit: 41250 },
        { month: 'Apr', revenue: 158000, orders: 1750, profit: 39500 },
        { month: 'May', revenue: 172000, orders: 1905, profit: 43000 },
        { month: 'Jun', revenue: 168000, orders: 1860, profit: 42000 },
        { month: 'Jul', revenue: 175000, orders: 1935, profit: 43750 },
        { month: 'Aug', revenue: 182000, orders: 2010, profit: 45500 },
        { month: 'Sep', revenue: 178000, orders: 1970, profit: 44500 },
        { month: 'Oct', revenue: 185000, orders: 2045, profit: 46250 },
        { month: 'Nov', revenue: 192000, orders: 2120, profit: 48000 },
        { month: 'Dec', revenue: 210000, orders: 2315, profit: 52500 }
      ]
    };

    return baseData[dateRange] || baseData.today;
  };

  const data = getChartData();
  const xAxisKey = dateRange === 'today' ? 'time' : dateRange === 'week' ? 'day' : dateRange === 'month' ? 'week' : 'month';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-border dark:border-gray-700">
          <p className="font-semibold text-text-primary dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' || entry.name === 'profit' ? '$' : ''}{entry.value.toLocaleString()}
              {entry.name === 'revenue' && ' revenue'}
              {entry.name === 'orders' && ' orders'}
              {entry.name === 'profit' && ' profit'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">Revenue Overview</h3>
          <p className="text-text-secondary dark:text-gray-400">
            {dateRange === 'today' ? "Today's performance" : 
             dateRange === 'week' ? "Weekly performance" : 
             dateRange === 'month' ? "Monthly performance" : 
             "Yearly performance"}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-3 sm:mt-0">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${chartType === 'area' 
              ? 'bg-primary-500 dark:bg-amber-500 text-white' 
              : 'bg-muted-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400 hover:bg-muted-200 dark:hover:bg-gray-600'
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${chartType === 'line' 
              ? 'bg-primary-500 dark:bg-amber-500 text-white' 
              : 'bg-muted-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400 hover:bg-muted-200 dark:hover:bg-gray-600'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${chartType === 'bar' 
              ? 'bg-primary-500 dark:bg-amber-500 text-white' 
              : 'bg-muted-100 dark:bg-gray-700 text-text-secondary dark:text-gray-400 hover:bg-muted-200 dark:hover:bg-gray-600'
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#9ca3af" 
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.2}
                strokeWidth={2}
                name="Revenue"
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.2}
                strokeWidth={2}
                name="Profit"
              />
            </AreaChart>
          ) : chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#9ca3af" 
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Profit"
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.3} />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="#9ca3af" 
                fontSize={12}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                name="Revenue"
              />
              <Bar 
                dataKey="profit" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                name="Profit"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between mt-6 pt-6 border-t border-border dark:border-gray-700">
        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-text-secondary dark:text-gray-400">Revenue</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-text-secondary dark:text-gray-400">Profit</span>
          </div>
        </div>
        
        <div className="text-sm text-text-secondary dark:text-gray-400">
          Total: <span className="font-semibold text-text-primary dark:text-white">
            ${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
          </span> revenue • 
          <span className="ml-2 font-semibold text-green-600 dark:text-emerald-400">
            +{((data[data.length - 1].revenue - data[0].revenue) / data[0].revenue * 100).toFixed(1)}%
          </span> growth
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;