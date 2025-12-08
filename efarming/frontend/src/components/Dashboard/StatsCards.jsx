// src/components/Dashboard/StatsCards.jsx
import React from 'react';
import { Users, BookOpen, FileText, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const statItems = [
    {
      title: 'Total Farmers',
      value: stats?.totalFarmers || '0',
      icon: Users,
      color: 'bg-gradient-to-r from-primary-500 to-primary-600',
      change: '+12%',
    },
    {
      title: 'Knowledge Articles',
      value: stats?.totalArticles || '0',
      icon: BookOpen,
      color: 'bg-gradient-to-r from-secondary-500 to-secondary-600',
      change: '+8%',
    },
    {
      title: 'Active Schemes',
      value: stats?.pendingApplications || '0',
      icon: FileText,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      change: '+5%',
    },
    {
      title: 'Platform Growth',
      value: '24.8%',
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-amber-500 to-amber-600',
      change: '+2.4%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="card hover:shadow-2xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;