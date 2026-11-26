// src/pages/admin-dashboard/index.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from 'context/ProjectsContext';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';
import { listMessages, MESSAGES_CHANGED_EVENT } from 'services/messagesService';

import MetricCard from './components/MetricCard';
import RecentActivity from './components/RecentActivity';
import ContentChecklist from './components/ContentChecklist';
import ArabicChecklist from './components/ArabicChecklist';
import { useSkills } from 'context/SkillsContext';
import { fetchAllFaqs, fetchAllServices } from 'services/servicesService';

const formatDay = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

const STATUS_LABELS = {
  published: 'Published',
  draft: 'Draft',
  in_progress: 'In progress',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { projects, loading: projectsLoading } = useProjects();
  const { profile, careerData, settings } = usePortfolioSettings();
  const { skillCategories } = useSkills();
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [faqs, setFaqs] = useState([]);

  // Services and FAQ only feed the Arabic checklist; empty before migration 009.
  useEffect(() => {
    let active = true;
    Promise.all([fetchAllServices(), fetchAllFaqs()]).then(([s, f]) => {
      if (!active) return;
      setServices(s.success ? s.data : []);
      setFaqs(f.success ? f.data : []);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const load = () =>
      listMessages().then((result) => {
        if (!active) return;
        setMessages(result.success ? result.data : []);
        setMessagesLoading(false);
      });
    load();
    window.addEventListener(MESSAGES_CHANGED_EVENT, load);
    return () => {
      active = false;
      window.removeEventListener(MESSAGES_CHANGED_EVENT, load);
    };
  }, []);

  const metrics = useMemo(() => ({
    published: projects.filter((p) => p.publishing_status === 'published').length,
    drafts: projects.filter((p) => p.publishing_status === 'draft').length,
    featured: projects.filter((p) => p.featured && p.publishing_status === 'published').length,
    newMessages: messages.filter((m) => (m.status || 'new') === 'new').length,
  }), [projects, messages]);

  // Project edits and incoming messages in one timeline, newest first.
  const recentActivities = useMemo(() => {
    const projectItems = projects.map((project) => ({
      id: `project-${project.id}`,
      type: 'project',
      title: project.title,
      detail: STATUS_LABELS[project.publishing_status] || project.publishing_status || 'Project',
      at: project.updated_at || project.created_at,
      to: `/project-manager?id=${project.id}`,
    }));
    const messageItems = messages.map((message) => ({
      id: `message-${message.id}`,
      type: 'form',
      title: message.subject || 'New message',
      detail: `Message from ${message.name}`,
      at: message.created_at,
      to: '/messages-manager',
    }));
    return [...projectItems, ...messageItems]
      .sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0))
      .slice(0, 6)
      .map((item) => ({ ...item, time: formatDay(item.at) }));
  }, [projects, messages]);

  const loadingValue = (value, isLoading) => (isLoading ? '...' : value);

  return (
    <>
      {/* Top Header */}
      <header className="bg-white dark:bg-surface shadow-sm border-b border-primary-100 dark:border-border">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-primary-800 dark:text-text-primary">Admin Dashboard</h1>
            <p className="text-sm text-secondary-600 dark:text-text-secondary mt-1">
              Welcome back, <span dir="auto">{profile?.full_name || 'Admin'}</span>. Here is where the portfolio stands.
            </p>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Published Projects"
            value={loadingValue(metrics.published, projectsLoading)}
            icon="Briefcase"
            description="Live on the portfolio"
            onClick={() => navigate('/projects-manager')}
          />
          <MetricCard
            title="Featured"
            value={loadingValue(metrics.featured, projectsLoading)}
            icon="Star"
            description="Shown first on the home page"
            onClick={() => navigate('/projects-manager')}
          />
          <MetricCard
            title="Drafts"
            value={loadingValue(metrics.drafts, projectsLoading)}
            icon="Edit3"
            description="Not visible to visitors"
            onClick={() => navigate('/projects-manager')}
          />
          <MetricCard
            title="New Messages"
            value={loadingValue(metrics.newMessages, messagesLoading)}
            icon="Inbox"
            description="From the contact form"
            onClick={() => navigate('/messages-manager')}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <RecentActivity activities={recentActivities} />
          <ContentChecklist projects={projects} profile={profile} careerData={careerData} />
        </div>

        <div className="mb-8">
          <ArabicChecklist projects={projects} settings={settings} skillCategories={skillCategories} services={services} faqs={faqs} />
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
