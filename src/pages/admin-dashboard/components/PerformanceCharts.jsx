import React, { useState } from 'react';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import Icon from 'components/AppIcon';

const PerformanceCharts = ({ data }) => {
  const [activeChart, setActiveChart] = useState('views');

  // Safely default data if missing
  const topPosts = data?.topPosts || [];
  const categoryDist = data?.categoryDist || [];
  const composition = data?.composition || [];

  const chartTabs = [
    { id: 'views', name: 'Top Posts', icon: 'TrendingUp' },
    { id: 'categories', name: 'Categories', icon: 'PieChart' },
    { id: 'composition', name: 'Composition', icon: 'FileText' }
  ];

  /* --- Renderers --- */

  // 1. Top Posts (Bar Chart)
  // Shows which individual posts have the most views
  const renderViewsChart = () => {
    if (topPosts.length === 0) {
      return <div className="flex h-full items-center justify-center text-sm text-secondary-500">No view data available</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topPosts} layout="vertical" margin={{ left: 50, right: 30, top: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" stroke="#64748b" fontSize={12} />
          <YAxis 
            dataKey="title" 
            type="category" 
            width={100} 
            stroke="#64748b" 
            fontSize={11} 
            tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
          />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="views" fill="#3182ce" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // 2. Categories (Pie Chart)
  // Shows distribution of blogs by category
  const renderCategoryChart = () => {
    if (categoryDist.length === 0) {
      return <div className="flex h-full items-center justify-center text-sm text-secondary-500">No category data</div>;
    }

    const COLORS = ['#3182ce', '#ed8936', '#38a169', '#805ad5', '#e53e3e', '#d69e2e'];

    return (
      <div className="flex flex-col md:flex-row items-center justify-center h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryDist}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryDist.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs md:w-1/3 p-4">
            {categoryDist.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length]}}></div>
                    <span className="text-secondary-700 truncate">{entry.name} ({entry.value})</span>
                </div>
            ))}
        </div>
      </div>
    );
  };

  // 3. Composition (Bar Stack or Simple Bar)
  // Shows ratio of Blogs vs Projects vs Drafts
  const renderCompositionChart = () => {
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
            <Bar dataKey="value" fill="#38a169" radius={[4, 4, 0, 0]} barSize={40}>
                {
                    composition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Drafts' ? '#e2e8f0' : '#38a169'} />
                    ))
                }
            </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'views': return renderViewsChart();
      case 'categories': return renderCategoryChart();
      case 'composition': return renderCompositionChart();
      default: return renderViewsChart();
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="card-header shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Icon name="BarChart3" size={20} strokeWidth={2} color="#3182ce" />
            <h2 className="text-lg font-semibold text-primary-800">Performance & Analytics</h2>
          </div>
          
          <div className="flex items-center space-x-1 bg-primary-50 rounded-lg p-1 self-start sm:self-auto">
            {chartTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveChart(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeChart === tab.id
                    ? 'bg-white text-accent-600 shadow-sm'
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
        {renderChart()}
      </div>
    </div>
  );
};

export default PerformanceCharts;