import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { useSkills } from 'context/SkillsContext';

const SkillsVisualization = ({ shouldReduceMotion }) => {
  const { skillCategories, techStack } = useSkills();
  const [activeCategory, setActiveCategory] = useState(() => {
    // Get first category key dynamically
    const keys = Object.keys(skillCategories);
    return keys.length > 0 ? keys[0] : 'frontend';
  });

  const getColorClasses = (color) => {
    const colorMap = {
      accent: 'bg-accent text-white',
      success: 'bg-success text-white',
      cta: 'bg-cta text-white',
      primary: 'bg-primary text-white',
      warning: 'bg-warning text-white',
      info: 'bg-info text-white',
      dark: 'bg-dark text-white',
      light: 'bg-light text-white',
      muted: 'bg-muted text-white',
      secondary: 'bg-secondary text-white',
      tertiary: 'bg-tertiary text-white',

      violet: 'bg-violet-600 dark:bg-violet-500 text-white',
      indigo: 'bg-indigo-600 dark:bg-indigo-500 text-white',
      blue: 'bg-blue-600 dark:bg-blue-500 text-white',
      teal: 'bg-teal-600 dark:bg-teal-500 text-white',
      emerald: 'bg-emerald-600 dark:bg-emerald-500 text-white',
      lime: 'bg-lime-600 dark:bg-lime-500 text-white',
      amber: 'bg-amber-600 dark:bg-amber-500 text-white',
      orange: 'bg-orange-600 dark:bg-orange-500 text-white',
      rose: 'bg-rose-600 dark:bg-rose-500 text-white',
      pink: 'bg-pink-600 dark:bg-pink-500 text-white',
      fuchsia: 'bg-fuchsia-600 dark:bg-fuchsia-500 text-white',
      purple: 'bg-purple-600 dark:bg-purple-500 text-white',
      cyan: 'bg-cyan-600 dark:bg-cyan-500 text-white',
      
    };
    return colorMap[color] || 'bg-accent text-white';
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const newAnimatedSkills = {};
      const category = skillCategories[activeCategory];
      if (category && category.skills) {
        category.skills.forEach((skill, index) => {
          setTimeout(() => {
            setAnimatedSkills(prev => ({
              ...prev,
              [skill.name]: skill.level
            }));
          }, index * 100);
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory, skillCategories]);

const currentCategory = skillCategories[activeCategory] || { title: '', icon: 'Code', color: 'accent', skills: [] };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {Object.entries(skillCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
              activeCategory === key
                ? getColorClasses(category.color)
                : 'bg-white dark:bg-white/10 text-text-secondary dark:text-white/70 hover:bg-primary-50 dark:hover:bg-white/20 shadow-md dark:shadow-lg dark:shadow-black/20 border border-secondary-200 dark:border-white/10'
            }`}
          >
            <Icon name={category.icon} size={20} strokeWidth={2} />
            <span>{category.title}</span>
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="bg-surface dark:bg-surface rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/30 border border-border dark:border-white/10 p-8 lg:p-12">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 ${getColorClasses(currentCategory.color)} rounded-full mb-4`}>
            <Icon name={currentCategory.icon} size={32} color="white" strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold text-text-primary dark:text-white">
            {currentCategory.title}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {currentCategory.skills.map((skill, index) => (
            <div
              key={skill.name}
              className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-white/10 rounded-xl border border-secondary-200 dark:border-white/10 hover:border-accent-500 dark:hover:border-accent-400 hover:shadow-md transition-all duration-300 cursor-default"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon 
                name={skill.icon} 
                size={18} 
                strokeWidth={2} 
                className="text-accent-500 dark:text-accent-400 flex-shrink-0"
              />
              <span className="font-semibold text-text-primary dark:text-white text-sm truncate">
                {skill.name}
              </span>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        {/* <div className="mt-8 pt-8 border-t border-primary-100">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className={`text-2xl font-bold text-${currentCategory.color}`}>8+</div>
              <div className="text-sm text-secondary-600">Years Experience</div>
            </div>
            <div>
              <div className={`text-2xl font-bold text-${currentCategory.color}`}>50+</div>
              <div className="text-sm text-secondary-600">Projects Completed</div>
            </div>
            <div>
              <div className={`text-2xl font-bold text-${currentCategory.color}`}>15+</div>
              <div className="text-sm text-secondary-600">Technologies Mastered</div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Tech Stack Cloud */}
      <div className="mt-12 text-center">
        <h4 className="text-xl font-bold text-text-primary dark:text-white mb-6">
          Technologies I Work With
        </h4>
        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((tech, index) => (
            <span
              key={tech}
              className="px-4 py-2 bg-white dark:bg-white/10 text-primary-700 dark:text-white/80 rounded-full text-sm font-medium hover:bg-accent-50 dark:hover:bg-accent-900/30 hover:text-accent-700 dark:hover:text-accent-400 shadow-sm border border-secondary-200 dark:border-white/10 transition-all duration-200 cursor-default"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsVisualization;