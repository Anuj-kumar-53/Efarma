// src/components/Weather/ForecastChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ForecastChart = ({ data }) => {
  if (!data || !Array.isArray(data)) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No forecast data available
      </div>
    );
  }

  const chartData = data.slice(0, 7).map((day) => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    maxTemp: day.maxTemp,
    minTemp: day.minTemp,
    rainChance: day.precipitationChance,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-sm text-blue-600">
            Max: {payload[0].value}°C
          </p>
          <p className="text-sm text-blue-400">
            Min: {payload[1].value}°C
          </p>
          <p className="text-sm text-cyan-600">
            Rain: {payload[2].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            label={{ 
              value: '°C', 
              angle: -90, 
              position: 'insideLeft',
              offset: 10,
              fontSize: 12 
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="maxTemp"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Max Temp"
          />
          <Line
            type="monotone"
            dataKey="minTemp"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Min Temp"
          />
          <Line
            type="monotone"
            dataKey="rainChance"
            stroke="#06b6d4"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Rain Chance"
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-6 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Max Temperature</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-6 bg-blue-300 rounded"></div>
          <span className="text-sm text-gray-600">Min Temperature</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-6 bg-cyan-500 rounded" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #06b6d4 5px, #06b6d4 10px)' }}></div>
          <span className="text-sm text-gray-600">Rain Chance</span>
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;