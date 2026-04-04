// src/pages/admin-dashboard/index.jsx
import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Icon from 'components/AppIcon';
import { useProjects } from 'context/ProjectsContext';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';

import MetricCard from './components/MetricCard';
import QuickActions from './components/QuickActions';
import RecentActivity from './components/RecentActivity';
import Sidebar from './components/Sidebar';
const PerformanceCharts = lazy(() => import('./components/PerformanceCharts'));

const AdminDashboard = () => {
  const { projects, getStats: getProjectStats, loading: projectsLoading } = useProjects();
  const { profile } = usePortfolioSettings();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState({
    publishedProjects: 0,
    drafts: 0
  });

  const [chartData, setChartData] = useState({
    composition: []
  });
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

  // Build recent activities from actual projects
  const recentActivities = React.useMemo(() => {
    const activities = [];
    
    // Add recent projects as activities
    projects.slice(0, 5).forEach((project) => {
      activities.push({
        id: `project-${project.id}`,
        type: 'project',
        message: `Project "${project.title}" - ${project.publishing_status || project.status}`,
        time: project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'Recently',
        status: project.publishing_status === 'draft' ? 'unread' : 'read'
      });
    });

    return activities;
  }, [projects]);


  // Load real metrics from contexts
  const loadMetrics = useCallback(async () => {
    setIsLoadingMetrics(true);
    
    try {
      const projectStats = await getProjectStats();

      setMetrics({
        publishedProjects: projectStats.success ? projectStats.data.published : projects.filter(p => p.publishing_status === 'published').length,
        drafts: (projectStats.success ? projectStats.data.draft : 0)
      });

      // Process Chart Data
      
      // Composition
      const compositionData = [
        { name: 'Projects', value: projects.filter(p => p.publishing_status === 'published').length },
        { name: 'Drafts', value: projects.filter(p => p.publishing_status === 'draft').length }
      ];

      setChartData({
        composition: compositionData
      });

    } catch (error) {
      console.error("Failed to load metrics", error);
      // Fallback to local counts
      setMetrics({
        publishedProjects: projects.filter(p => p.publishing_status === 'published').length,
        drafts: projects.filter(p => p.publishing_status === 'draft').length
      });
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [getProjectStats, projects]);

  useEffect(() => {
    if (!projectsLoading) {
      loadMetrics();
    }
  }, [projectsLoading, loadMetrics]);

  const isLoading = projectsLoading || isLoadingMetrics;

  return (
    <>
      {/* Top Header */}
      <header className="bg-white dark:bg-surface shadow-sm border-b border-primary-100 dark:border-primary-800">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-primary-800 dark:text-primary-200">Admin Dashboard</h1>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">Welcome back, {profile?.full_name || 'Admin'}! Here's what's happening with your portfolio.</p>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Published Projects"
            value={isLoading ? '...' : metrics.publishedProjects}
            change=""
            changeType="neutral"
            icon="Briefcase"
            description="Live portfolio projects"
          />
          <MetricCard
            title="Draft Projects"
            value={isLoading ? '...' : metrics.drafts}
            change=""
            changeType="neutral"
            icon="Edit3"
            description="Unpublished projects"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Content and Analytics Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          
          {/* Recent Activity */}
          <div>
            <RecentActivity 
              activities={recentActivities}
            />
          </div>

           {/* Performance Charts */}
            <div>
            {/* Disabled chart prop passing for now as we removed some data */}
            <Suspense fallback={<div>Loading chart...</div>}>
              <PerformanceCharts data={chartData} />
            </Suspense>
            </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;