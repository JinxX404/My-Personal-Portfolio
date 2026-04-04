import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';
import { useSkills } from 'context/SkillsContext';

const AboutStory = () => {
  const { profile, careerData } = usePortfolioSettings();
  const { skillCategories } = useSkills();
  const [activeTimelineItem, setActiveTimelineItem] = useState(null);
  const [visibleSections, setVisibleSections] = useState(new Set());

  const careerTimeline = careerData?.timeline || [];
  const careerValues = careerData?.values || [];
  const careerInterests = careerData?.interests || [];
  const philosophy = careerData?.philosophy || '';
  const mission = careerData?.mission || '';

  // Transform skillCategories context into the AboutStory format
  const skillsData = Object.values(skillCategories || {}).map(cat => ({
    category: cat.title,
    skills: (cat.skills || []).map(s => ({
      name: s.name,
      level: s.level || 50,
      years: 1
    }))
  }));



  // Scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-background dark:via-surface dark:to-background">
      <Helmet>
        <title>About Me — Moataz Mohammed, Backend Engineer</title>
        <meta name="description" content="Learn about my background, education, skills, and the values that drive my work as a software engineer." />
        <meta property="og:title" content="About Me — Moataz Mohammed" />
        <meta property="og:description" content="Learn about my background, education, skills, and values." />
      </Helmet>
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Profile Image */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative max-w-md mx-auto lg:max-w-none">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-accent-100 to-cta-100 p-2">
                  <Image
                    src={profile?.avatar || ''}
                    alt={profile?.full_name || 'Moataz Mohammed'}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-surface dark:bg-background rounded-xl p-4 shadow-lg border border-primary-200 dark:border-border-strong">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-primary-700">Available for projects</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Personal Introduction */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-primary-800 mb-2">
                  {profile?.full_name || 'Moataz Mohammed'}
                </h1>
                <p className="text-xl text-cta font-semibold mb-4">
                  {profile?.title || 'Developer'}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-secondary-600 mb-6">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} />
                    <span>{profile?.location || 'Assiut, Egypt'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} />
                    <span>{profile?.experience_years || '1+'} Years Experience</span>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-secondary-700">
                <p className="mb-4">{profile?.bio || ''}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/portfolio-gallery"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Icon name="Briefcase" size={18} />
                  <span>View My Work</span>
                </Link>
                <Link
                  to="/contact-hub"
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Icon name="MessageCircle" size={18} />
                  <span>Let's Connect</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            id="philosophy"
            data-animate
            initial="hidden"
            animate={visibleSections.has('philosophy') ? "visible" : "hidden"}
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-800 mb-6">
                My Philosophy
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-accent to-cta mx-auto mb-8"></div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <p className="text-lg text-secondary-700 leading-relaxed">
                {philosophy || 'I believe in thoughtful digital craftsmanship.'}
              </p>
              <div className="bg-gradient-to-r from-cta-50 to-accent-50 dark:from-cta-900/30 dark:to-accent-900/30 rounded-xl p-8 border border-cta-200 dark:border-cta-800">
                <p className="text-lg font-semibold text-primary-800 italic">
                  "{mission || 'To create meaningful digital experiences.'}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-50 dark:bg-primary-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            id="values"
            data-animate
            initial="hidden"
            animate={visibleSections.has('values') ? "visible" : "hidden"}
            variants={containerVariants}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-800 mb-4">
                Core Values
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                The principles that guide every project, decision, and interaction in my professional journey.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8">
              {careerValues.map((value, index) => (
                <div
                  key={value.title || `value-${index}`}
                  className="bg-surface dark:bg-background rounded-xl p-8 shadow-sm border border-primary-200 dark:border-border-strong hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent to-cta rounded-lg flex items-center justify-center">
                      <Icon name={value.icon} size={24} color="white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary-800 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-secondary-600 dark:text-secondary-400 mb-4 leading-relaxed">
                        {value.description}
                      </p>
                      {value.example && (
                        <div className="bg-accent-50 dark:bg-accent-900/30 rounded-lg p-4 border-l-4 border-accent">
                          <p className="text-sm text-accent-800 dark:text-accent-200 font-medium">
                            Real Example: {value.example}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            id="timeline"
            data-animate
            initial="hidden"
            animate={visibleSections.has('timeline') ? "visible" : "hidden"}
            variants={containerVariants}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-800 mb-4">
                Professional Journey
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Key milestones, achievements, and growth moments that shaped my career path.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-cta to-success hidden md:block"></div>

              <div className="space-y-8">
                {careerTimeline.map((item, index) => (
                  <div
                    key={item.id || `timeline-${index}`}
                    className={`relative flex items-start space-x-6 cursor-pointer transition-all duration-300 ${
                      activeTimelineItem === (item.id || index) ? 'transform scale-105' : ''
                    }`}
                    onClick={() => setActiveTimelineItem(activeTimelineItem === (item.id || index) ? null : (item.id || index))}
                  >
                    {/* Timeline Dot */}
                    <div className="flex-shrink-0 relative">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                        item.type === 'career' ? 'bg-accent border-accent-200' :
                        item.type === 'certification'? 'bg-cta border-cta-200' : 'bg-success border-success-200'
                      }`}>
                        <Icon 
                          name={
                            item.type === 'career' ? 'Briefcase' :
                            item.type === 'certification'? 'Award' : 'GraduationCap'
                          } 
                          size={24} 
                          color="white" 
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-surface dark:bg-background rounded-full px-2 py-1 text-xs font-bold text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-border-strong">
                        {item.year}
                      </div>
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 bg-surface dark:bg-background rounded-xl p-6 shadow-sm border border-primary-200 dark:border-border-strong hover:shadow-md transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-primary-800 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-cta font-semibold">{item.company}</p>
                        </div>
                        <Icon 
                          name={activeTimelineItem === item.id ? "ChevronUp" : "ChevronDown"} 
                          size={20} 
                          className="text-secondary-400"
                        />
                      </div>

                      <p className="text-secondary-600 mb-4">{item.description}</p>

                      {activeTimelineItem === (item.id || index) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          {item.achievements && item.achievements.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-primary-800 mb-2">Key Achievements:</h4>
                              <ul className="space-y-1">
                                {item.achievements.map((achievement, idx) => (
                                  <li key={idx} className="flex items-center space-x-2 text-secondary-600">
                                    <Icon name="CheckCircle" size={16} className="text-success" />
                                    <span>{achievement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {item.technologies && item.technologies.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-primary-800 mb-2">Technologies:</h4>
                              <div className="flex flex-wrap gap-2">
                                {item.technologies.map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-200 rounded-full text-sm font-medium"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-50 dark:bg-primary-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            id="skills"
            data-animate
            initial="hidden"
            animate={visibleSections.has('skills') ? "visible" : "hidden"}
            variants={containerVariants}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-800 mb-4">
                Skills & Expertise
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Technical capabilities developed through years of hands-on experience and continuous learning.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-8">
              {skillsData.map((category, index) => (
                <div key={category.category || `skill-cat-${index}`} className="bg-surface dark:bg-background rounded-xl p-8 shadow-sm border border-primary-200 dark:border-border-strong">
                  <h3 className="text-xl font-bold text-primary-800 mb-6 text-center">
                    {category.category}
                  </h3>
                  <div className="space-y-6">
                    {(category.skills || []).map((skill, skillIndex) => (
                      <div key={skill.name || `skill-${skillIndex}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-secondary-700">{skill.name}</span>
                          <span className="text-sm text-secondary-500">{skill.years}y</span>
                        </div>
                        <div className="w-full bg-primary-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-accent to-cta h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + skillIndex * 0.1 }}
                          ></motion.div>
                        </div>
                        <div className="text-xs text-secondary-500 mt-1 text-right">
                          {skill.level}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Personal Interests */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            id="interests"
            data-animate
            initial="hidden"
            animate={visibleSections.has('interests') ? "visible" : "hidden"}
            variants={containerVariants}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-800 mb-4">
                Off the Clock
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Personal interests and activities that fuel creativity and maintain work-life balance.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {careerInterests.map((interest, index) => (
                <div
                  key={interest.name || `interest-${index}`}
                  className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/30 dark:to-accent-900/30 rounded-xl p-6 text-center hover:shadow-md transition-all duration-300 border border-primary-200 dark:border-border-strong"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-cta rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name={interest.icon} size={28} color="white" />
                  </div>
                  <h3 className="text-lg font-bold text-primary-800 mb-3">
                    {interest.title}
                  </h3>
                  <p className="text-sm text-secondary-600 leading-relaxed">
                    {interest.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-800 to-accent-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Create Something Amazing?
              </h2>
              <p className="text-xl text-accent-100 mb-8 max-w-2xl mx-auto">
                Let's discuss how we can bring your ideas to life with thoughtful design and robust technology.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/portfolio-gallery"
                className="bg-white text-primary-800 hover:bg-primary-50 font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Icon name="Eye" size={18} />
                <span>View My Work</span>
              </Link>
              <Link
                to="/contact-hub"
                className="bg-cta hover:bg-cta-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Icon name="MessageCircle" size={18} />
                <span>Start a Conversation</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutStory;