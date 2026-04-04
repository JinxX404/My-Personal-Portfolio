import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Modal from 'components/ui/Modal';
import { useSkills } from 'context/SkillsContext';

const SkillsManager = () => {
  const {
    skillCategories,
    techStack,
    addCategory,
    updateCategory,
    deleteCategory,
    addSkill,
    updateSkill,
    deleteSkill,
    addTech,
    updateTech,
    deleteTech,
    resetToDefaults,
    resyncFromDatabase
  } = useSkills();

  const [activeTab, setActiveTab] = useState('categories');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingTech, setEditingTech] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    key: '',
    title: '',
    icon: 'Code',
    color: 'accent'
  });

  const [skillForm, setSkillForm] = useState({
    name: '',
    level: 50,
    icon: 'Code'
  });

  const [techForm, setTechForm] = useState('');

  const colorOptions = [
    'accent', 'success', 'cta', 'primary', 'warning', 'info',
    'violet', 'indigo', 'blue', 'teal', 'emerald', 'lime',
    'amber', 'orange', 'rose', 'pink', 'fuchsia', 'purple', 'cyan'
  ];

  const iconOptions = [
    'Code', 'Code2', 'Monitor', 'Server', 'Database', 'Cloud',
    'Settings', 'Heart', 'Zap', 'Globe', 'FileCode', 'Layout',
    'Palette', 'Smartphone', 'HardDrive', 'Share2', 'GitBranch',
    'Paintbrush', 'CheckCircle', 'Repeat', 'Users', 'Lightbulb',
    'MessageCircle', 'Calendar', 'BookOpen', 'Shuffle'
  ];

  // Category handlers
  const handleAddCategory = () => {
    if (categoryForm.key && categoryForm.title) {
      addCategory(categoryForm.key, {
        title: categoryForm.title,
        icon: categoryForm.icon,
        color: categoryForm.color,
        skills: []
      });
      setCategoryForm({ key: '', title: '', icon: 'Code', color: 'accent' });
      setShowCategoryModal(false);
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategory) {
      updateCategory(editingCategory, {
        title: categoryForm.title,
        icon: categoryForm.icon,
        color: categoryForm.color
      });
      setEditingCategory(null);
      setCategoryForm({ key: '', title: '', icon: 'Code', color: 'accent' });
      setShowCategoryModal(false);
    }
  };

  const handleDeleteCategory = (categoryKey) => {
    if (window.confirm(`Are you sure you want to delete "${skillCategories[categoryKey].title}"?`)) {
      deleteCategory(categoryKey);
    }
  };

  const openEditCategory = (categoryKey) => {
    const category = skillCategories[categoryKey];
    setCategoryForm({
      key: categoryKey,
      title: category.title,
      icon: category.icon,
      color: category.color
    });
    setEditingCategory(categoryKey);
    setShowCategoryModal(true);
  };

  // Skill handlers
  const handleAddSkill = () => {
    if (skillForm.name && selectedCategory) {
      addSkill(selectedCategory, skillForm);
      setSkillForm({ name: '', level: 50, icon: 'Code' });
      setShowSkillModal(false);
    }
  };

  const handleUpdateSkill = () => {
    if (editingSkill && selectedCategory) {
      updateSkill(selectedCategory, editingSkill.id, skillForm);
      setEditingSkill(null);
      setSkillForm({ name: '', level: 50, icon: 'Code' });
      setShowSkillModal(false);
    }
  };

  const handleDeleteSkill = (categoryKey, skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      deleteSkill(categoryKey, skillId);
    }
  };

  const openEditSkill = (categoryKey, skill) => {
    setSkillForm({
      name: skill.name,
      level: skill.level,
      icon: skill.icon
    });
    setEditingSkill(skill);
    setSelectedCategory(categoryKey);
    setShowSkillModal(true);
  };

  const openAddSkill = (categoryKey) => {
    setSkillForm({ name: '', level: 50, icon: 'Code' });
    setEditingSkill(null);
    setSelectedCategory(categoryKey);
    setShowSkillModal(true);
  };

  // Tech stack handlers
  const handleAddTech = () => {
    if (techForm.trim()) {
      addTech(techForm.trim());
      setTechForm('');
      setShowTechModal(false);
    }
  };

  const handleUpdateTech = () => {
    if (techForm.trim() && editingTech !== null) {
      updateTech(editingTech, techForm.trim());
      setTechForm('');
      setEditingTech(null);
      setShowTechModal(false);
    }
  };

  const handleDeleteTech = (index) => {
    if (window.confirm('Are you sure you want to delete this technology?')) {
      deleteTech(index);
    }
  };

  const openEditTech = (index, tech) => {
    setTechForm(tech);
    setEditingTech(index);
    setShowTechModal(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-800">Skills Management</h1>
              <p className="text-secondary-600 mt-1">Manage your skill categories, individual skills, and tech stack</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={async () => {
                  if (window.confirm('Resync all data from database? This will clear cached data and reload from Supabase.')) {
                    await resyncFromDatabase();
                    alert('Data resynced successfully!');
                  }
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                title="Clear cache and reload from database (fixes UUID mismatch errors)"
              >
                <Icon name="RefreshCw" size={18} strokeWidth={2} />
                <span className="font-medium">Resync from DB</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Reset all skills to default values?')) {
                    resetToDefaults();
                  }
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-warning-100 text-warning-700 rounded-lg hover:bg-warning-200 transition-colors"
              >
                <Icon name="RotateCcw" size={18} strokeWidth={2} />
                <span className="font-medium">Reset to Defaults</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 border-b border-primary-200">
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-secondary-600 hover:text-primary-800'
              }`}
            >
              Skill Categories
            </button>
            <button
              onClick={() => setActiveTab('techstack')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'techstack'
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-secondary-600 hover:text-primary-800'
              }`}
            >
              Tech Stack
            </button>
          </div>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setCategoryForm({ key: '', title: '', icon: 'Code', color: 'accent' });
                  setEditingCategory(null);
                  setShowCategoryModal(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors"
              >
                <Icon name="Plus" size={18} strokeWidth={2} />
                <span className="font-medium">Add Category</span>
              </button>
            </div>

            {/* Categories List */}
            <div className="grid gap-6">
              {Object.entries(skillCategories).map(([key, category]) => (
                <div key={key} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                        <Icon name={category.icon} size={24} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-primary-800">{category.title}</h3>
                        <p className="text-sm text-secondary-600">Key: {key}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openAddSkill(key)}
                        className="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                        title="Add Skill"
                      >
                        <Icon name="Plus" size={18} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => openEditCategory(key)}
                        className="p-2 text-accent hover:bg-accent-50 rounded-lg transition-colors"
                        title="Edit Category"
                      >
                        <Icon name="Edit" size={18} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(key)}
                        className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <Icon name="Trash2" size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </div>

                  {/* Skills in this category */}
                  <div className="space-y-3">
                    {category.skills?.length > 0 ? (
                      category.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <Icon name={skill.icon} size={18} strokeWidth={2} />
                            <span className="font-medium text-primary-800">{skill.name}</span>
                            <div className="flex-1 max-w-xs">
                              <div className="w-full bg-white rounded-full h-2">
                                <div
                                  className={`h-full bg-${category.color}-500 rounded-full`}
                                  style={{ width: `${skill.level}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-secondary-600">{skill.level}%</span>
                          </div>
                          <div className="flex items-center space-x-1 ml-4">
                            <button
                              onClick={() => openEditSkill(key, skill)}
                              className="p-1.5 text-accent hover:bg-accent-50 rounded transition-colors"
                            >
                              <Icon name="Edit" size={16} strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(key, skill.id)}
                              className="p-1.5 text-error-600 hover:bg-error-50 rounded transition-colors"
                            >
                              <Icon name="Trash2" size={16} strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-secondary-500 text-center py-4">No skills yet. Add some!</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Tab */}
        {activeTab === 'techstack' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setTechForm('');
                  setEditingTech(null);
                  setShowTechModal(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors"
              >
                <Icon name="Plus" size={18} strokeWidth={2} />
                <span className="font-medium">Add Technology</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-primary-800 mb-4">Technologies I Work With</h3>
              <div className="flex flex-wrap gap-3">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="group flex items-center space-x-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full hover:bg-accent-50 hover:text-accent-700 transition-all"
                  >
                    <span className="font-medium">{tech}</span>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditTech(index, tech)}
                        className="p-1 hover:bg-accent-100 rounded-full transition-colors"
                      >
                        <Icon name="Edit" size={14} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => handleDeleteTech(index)}
                        className="p-1 hover:bg-error-100 rounded-full transition-colors text-error-600"
                      >
                        <Icon name="X" size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => { setShowCategoryModal(false); setEditingCategory(null); setCategoryForm({ key: '', title: '', icon: 'Code', color: 'accent' }); }}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        footer={
          <>
            <button
              onClick={() => { setShowCategoryModal(false); setEditingCategory(null); setCategoryForm({ key: '', title: '', icon: 'Code', color: 'accent' }); }}
              className="flex-1 px-4 py-2 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
              className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors"
            >
              {editingCategory ? 'Update' : 'Add'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {!editingCategory && (
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Category Key</label>
              <input
                type="text"
                value={categoryForm.key}
                onChange={(e) => setCategoryForm({ ...categoryForm, key: e.target.value })}
                placeholder="e.g., frontend"
                className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Title</label>
            <input
              type="text"
              value={categoryForm.title}
              onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
              placeholder="e.g., Frontend Development"
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Icon</label>
            <select
              value={categoryForm.icon}
              onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Color</label>
            <select
              value={categoryForm.color}
              onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {colorOptions.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Skill Modal */}
      <Modal
        isOpen={showSkillModal}
        onClose={() => { setShowSkillModal(false); setEditingSkill(null); setSkillForm({ name: '', level: 50, icon: 'Code' }); }}
        title={editingSkill ? 'Edit Skill' : 'Add Skill'}
        footer={
          <>
            <button
              onClick={() => { setShowSkillModal(false); setEditingSkill(null); setSkillForm({ name: '', level: 50, icon: 'Code' }); }}
              className="flex-1 px-4 py-2 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingSkill ? handleUpdateSkill : handleAddSkill}
              className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors"
            >
              {editingSkill ? 'Update' : 'Add'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Skill Name</label>
            <input
              type="text"
              value={skillForm.name}
              onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
              placeholder="e.g., React.js"
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">
              Level: {skillForm.level}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={skillForm.level}
              onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Icon</label>
            <select
              value={skillForm.icon}
              onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Tech Modal */}
      <Modal
        isOpen={showTechModal}
        onClose={() => { setShowTechModal(false); setEditingTech(null); setTechForm(''); }}
        title={editingTech !== null ? 'Edit Technology' : 'Add Technology'}
        footer={
          <>
            <button
              onClick={() => { setShowTechModal(false); setEditingTech(null); setTechForm(''); }}
              className="flex-1 px-4 py-2 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingTech !== null ? handleUpdateTech : handleAddTech}
              className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors"
            >
              {editingTech !== null ? 'Update' : 'Add'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Technology Name</label>
            <input
              type="text"
              value={techForm}
              onChange={(e) => setTechForm(e.target.value)}
              placeholder="e.g., React"
              className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SkillsManager;
