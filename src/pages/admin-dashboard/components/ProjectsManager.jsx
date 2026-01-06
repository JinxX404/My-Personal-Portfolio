// src/pages/admin-dashboard/components/ProjectsManager.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useProjects } from 'context/ProjectsContext';

const ProjectsManager = () => {
  const {
    projects,
    loading,
    loadProjects,
    removeProject,
    togglePublish,
    toggleFeatured,
  } = useProjects();

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.publishing_status === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (projectId, projectTitle) => {
    if (window.confirm(`Are you sure you want to delete "${projectTitle}"?`)) {
      console.log('🗑️ Delete project clicked:', { projectId, projectTitle });
      const result = await removeProject(projectId);
      console.log('📊 Delete project result:', result);
      
      if (result.success) {
        console.log('✅ Project deleted successfully');
        loadProjects();
      } else {
        console.error('❌ Failed to delete project:', result.error);
        alert(`Failed to delete project: ${result.error}`);
      }
    }
  };

  const handleTogglePublish = async (projectId, currentStatus) => {
    console.log('🔄 Toggle publish clicked:', { projectId, currentStatus });
    const result = await togglePublish(projectId, currentStatus !== 'published');
    console.log('📊 Toggle publish result:', result);
    
    if (result.success) {
      console.log('✅ Publish toggled successfully');
      loadProjects();
    } else {
      console.error('❌ Failed to toggle publish:', result.error);
      alert(`Failed to ${currentStatus === 'published' ? 'unpublish' : 'publish'} project: ${result.error}`);
    }
  };

  const handleToggleFeatured = async (projectId, currentFeatured) => {
    console.log('⭐ Toggle featured clicked:', { projectId, currentFeatured });
    const result = await toggleFeatured(projectId, !currentFeatured);
    console.log('📊 Toggle featured result:', result);
    
    if (result.success) {
      console.log('✅ Featured toggled successfully');
      loadProjects();
    } else {
      console.error('❌ Failed to toggle featured:', result.error);
      alert(`Failed to toggle featured status: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <Icon name="Loader" size={32} className="animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-800">Projects Management</h1>
              <p className="text-secondary-600 mt-1">Manage your portfolio projects</p>
            </div>
            <Link
              to="/project-manager"
              className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors"
            >
              <Icon name="Plus" size={18} strokeWidth={2} />
              <span className="font-medium">New Project</span>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' ? 'bg-accent text-white' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('published')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'published' ? 'bg-success text-white' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'draft' ? 'bg-warning text-white' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                Drafts
              </button>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Icon name="Folder" size={48} className="mx-auto text-secondary-300 mb-4" />
              <h3 className="text-xl font-semibold text-primary-800 mb-2">No projects found</h3>
              <p className="text-secondary-600 mb-6">
                {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first project'}
              </p>
              <Link to="/project-manager" className="btn-primary inline-flex items-center space-x-2">
                <Icon name="Plus" size={18} />
                <span>Create Project</span>
              </Link>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-primary-800">{project.title}</h3>
                      {project.featured && (
                        <span className="px-2 py-1 bg-cta-100 text-cta-700 text-xs font-semibold rounded-full">
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        project.publishing_status === 'published'
                          ? 'bg-success-100 text-success-700'
                          : 'bg-warning-100 text-warning-700'
                      }`}>
                        {project.publishing_status}
                      </span>
                    </div>
                    <p className="text-secondary-600 mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies?.slice(0, 5).map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-accent-50 text-accent-700 text-xs font-medium rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-secondary-500">
                      <span className="flex items-center space-x-1">
                        <Icon name="Tag" size={14} />
                        <span>{project.category}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span>{new Date(project.created_at || Date.now()).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleToggleFeatured(project.id, project.featured)}
                      className={`p-2 rounded-lg transition-colors ${
                        project.featured
                          ? 'bg-cta-100 text-cta-700 hover:bg-cta-200'
                          : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                      }`}
                      title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <Icon name="Star" size={18} strokeWidth={2} />
                    </button>
                    <button
                      onClick={() => handleTogglePublish(project.id, project.publishing_status)}
                      className={`p-2 rounded-lg transition-colors ${
                        project.publishing_status === 'published'
                          ? 'bg-success-100 text-success-700 hover:bg-success-200'
                          : 'bg-warning-100 text-warning-700 hover:bg-warning-200'
                      }`}
                      title={project.publishing_status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      <Icon name={project.publishing_status === 'published' ? 'EyeOff' : 'Eye'} size={18} strokeWidth={2} />
                    </button>
                    <Link
                      to={`/project-manager?id=${project.id}`}
                      className="p-2 bg-accent-100 text-accent-700 hover:bg-accent-200 rounded-lg transition-colors"
                      title="Edit project"
                    >
                      <Icon name="Edit" size={18} strokeWidth={2} />
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id, project.title)}
                      className="p-2 bg-error-100 text-error-700 hover:bg-error-200 rounded-lg transition-colors"
                      title="Delete project"
                    >
                      <Icon name="Trash2" size={18} strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsManager;
