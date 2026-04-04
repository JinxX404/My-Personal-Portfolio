import React, { useState } from 'react';
import { 
  BarChart, Bar, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Icon from 'components/AppIcon';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const PerformanceCharts = ({ data }) => {
  const [activeChart, setActiveChart] = useState('composition');

  const composition = data?.composition || [];

  const chartTabs = [
    { id: 'composition', name: 'Published vs Drafts', icon: 'FileText' }
  ];

  const renderCompositionChart = () => {
    if (composition.length === 0) {
      return <div className="flex h-full items-center justify-center text-sm text-secondary-500">No data available</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={composition} margin={{ top: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                {composition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Drafts' ? '#e2e8f0' : '#38a169'} />
                ))}
            </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="card-header shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Icon name="BarChart3" size={20} strokeWidth={2} className="text-accent" />
            <h2 className="text-lg font-semibold text-primary-800 dark:text-primary-200">Performance & Analytics</h2>
          </div>
          
          <div className="flex items-center space-x-1 bg-primary-50 dark:bg-primary-900/30 rounded-lg p-1 self-start sm:self-auto">
            {chartTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeChart === tab.id
                    ? 'bg-white dark:bg-surface text-accent-600 shadow-sm'
                    : 'text-secondary-600 hover:text-primary-600'
                }`}
                title={tab.name}
              >
                <Icon name={tab.icon} size={16} strokeWidth={2} />
                <span className="hidden md:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="card-content flex-1 min-h-[300px]">
        {renderCompositionChart()}
      </div>
    </div>
  );
};

export default PerformanceCharts;
