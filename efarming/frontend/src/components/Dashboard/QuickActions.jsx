// src/components/Dashboard/QuickActions.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CloudSun, Sprout, BookOpen, Award, PlusCircle, Settings } from 'lucide-react';

const QuickActions = ({ isAdmin = false }) => {
  const actions = [
    {
      title: 'Check Weather',
      description: 'Get real-time weather updates',
      icon: CloudSun,
      color: 'from-blue-500 to-cyan-500',
      path: '/weather',
    },
    {
      title: 'Crop Recommendations',
      description: 'AI-powered agriculture advice',
      icon: Sprout,
      color: 'from-emerald-500 to-green-500',
      path: '/agriculture',
    },
    {
      title: 'Knowledge Hub',
      description: 'Articles, videos & guides',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-500',
      path: '/knowledge',
    },
    {
      title: 'Government Schemes',
      description: 'Find eligible schemes',
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      path: '/schemes',
    },
  ];

  const adminActions = [
    {
      title: 'Add Content',
      description: 'Create new articles or videos',
      icon: PlusCircle,
      color: 'from-primary-500 to-primary-600',
      path: '/knowledge/create',
    },
    {
      title: 'Manage Schemes',
      description: 'Add or update government schemes',
      icon: Award,
      color: 'from-secondary-500 to-secondary-600',
      path: '/schemes/create',
    },
    {
      title: 'Settings',
      description: 'Platform configuration',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      path: '/admin/dashboard',
    },
  ];

  const displayActions = isAdmin ? [...actions, ...adminActions] : actions;

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              to={action.path}
              className="group relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="h-2 w-2 rounded-full bg-primary-500 group-hover:animate-pulse-gentle"></div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
              <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;