import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const AboutStory = () => {
  const [activeTimelineItem, setActiveTimelineItem] = useState(null);
  const [visibleSections, setVisibleSections] = useState(new Set());

  // Mock data for personal information
  const personalInfo = {
    name: "Moataz Mohammed",
    title: "Backend Engineer",
    location: "Assiut, Egypt",
    experience: "1+ Years",
    profileImage: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpreview.redd.it%2Fswxzho8udhn71.jpg%3Fauto%3Dwebp%26s%3Dc283a63d039de4b428aea7c55f7b6722fbaddd14&f=1&nofb=1&ipt=8aec085f671e2169d525f14c9d6cf3250263f58adb06b35af99f856c6e2fc601",
    biography: `I’m a recent graduate in Information Technology from Egyptian E-Learning University, specializing in software engineering. I’m passionate about backend development and have a strong interest in .NET technologies.
My goal is to grow as a software engineer and create impactful, innovative solutions that solve real problems and make a difference. I’m always looking for opportunities to learn and improve.`,
    philosophy: `I believe in thoughtful digital craftsmanship – where every line of code, every interaction, and every design decision serves a purpose. Technology should enhance human capability, not complicate it.`,
    mission: "To create digital experiences that are not just functional, but delightful, accessible, and meaningful to the people who interact with them."
  };

  // Mock timeline data
  const timelineData = [
    // {
    //   id: 1,
    //   year: "2024",
    //   title: "Senior Full-Stack Developer",
    //   company: "TechForward Inc.",
    //   type: "career",
    //   description: "Leading frontend architecture for enterprise applications, mentoring junior developers, and driving technical innovation across multiple product teams.",
    //   achievements: ["Led team of 6 developers", "Improved app performance by 40%", "Implemented design system"],
    //   technologies: ["React", "TypeScript", "Node.js", "AWS"]
    // },
    // {
    //   id: 2,
    //   year: "2023",
    //   title: "AWS Solutions Architect Certification",
    //   company: "Amazon Web Services",
    //   type: "certification",
    //   description: "Achieved professional-level certification in cloud architecture and solutions design.",
    //   achievements: ["Cloud architecture expertise", "Serverless applications", "DevOps practices"],
    //   technologies: ["AWS", "Lambda", "CloudFormation", "Docker"]
    // },
    // {
    //   id: 3,
    //   year: "2022",
    //   title: "Frontend Team Lead",
    //   company: "Digital Innovations Co.",
    //   type: "career",
    //   description: "Transitioned to leadership role, establishing frontend best practices and mentoring team members while continuing hands-on development.",
    //   achievements: ["Established coding standards", "Reduced bug reports by 60%", "Launched 3 major products"],
    //   technologies: ["React", "Vue.js", "GraphQL", "Jest"]
    // },
    // {
    //   id: 4,
    //   year: "2020",
    //   title: "React Developer Certification",
    //   company: "Meta (Facebook)",
    //   type: "certification",
    //   description: "Completed advanced React certification program focusing on modern patterns and performance optimization.",
    //   achievements: ["Advanced React patterns", "Performance optimization", "Testing strategies"],
    //   technologies: ["React", "Redux", "Testing Library", "Webpack"]
    // },
    // {
    //   id: 5,
    //   year: "2019",
    //   title: "Full-Stack Developer",
    //   company: "StartupHub",
    //   type: "career",
    //   description: "Joined early-stage startup to build products from ground up, wearing multiple hats and learning rapid development cycles.",
    //   achievements: ["Built 5 products from scratch", "Scaled to 10K+ users", "Implemented CI/CD"],
    //   technologies: ["JavaScript", "Python", "PostgreSQL", "Docker"]
    // },
    {
      id: 6,
      year: "2025",
      title: "Bachelor's degree in Information Technology",
      company: "Egyptian E-Learning University, Egypt",
      type: "education",
      description: "Bachelor\'s degree in IT",
      achievements: ["Graduate with distinction with honors"],
      technologies: ["Java", "C#", "Python", "DSA","Django Rest Framework","Docker", "Redis"]
    }
  ];

  // Mock skills data
  const skillsData = [
    {
      category: "Frontend Development",
      skills: [
        { name: "React/Next.js", level: 50, years: 1 },
        { name: "TypeScript", level: 50, years: 1 },
        // { name: "Vue.js", level: 85, years: 3 },
        { name: "CSS/Tailwind", level: 50, years: 1 },
        { name: "HTML", level: 95, years: 3 },
        { name: "JavaScript", level: 60, years: 3 },
      ]
    },
    {
      category: "Backend Development",
      skills: [
        { name: "Django Rest Framework", level: 70, years: 1 },
        { name: "Python", level: 82, years: 2 },
        { name: "PostgreSQL", level: 85, years: 1 },
        { name: "RestAPI", level: 60, years: 1 },
        { name: "Java", level: 80, years: 4 },
        { name: "MS SQL SERVER", level: 60, years: 2 },
        { name: "MongoDB", level: 70, years: 1 }
      ]
    },
    {
      category: "DevOps & Tools",
      skills: [
        // { name: "AWS", level: 85, years: 3 },
        { name: "Docker", level: 80, years: 1 },
        { name: "Git", level: 90, years: 3 },
        // { name: "CI/CD", level: 82, years: 4 }
      ]
    }
  ];

  // Mock values data
  const valuesData = [
    {
      icon: "Heart",
      title: "User-Centric Design",
      description: "Every decision starts with understanding the human behind the screen. I believe technology should enhance lives, not complicate them.",
      example: "Redesigned a complex dashboard that reduced user task completion time by 65% through intuitive information architecture."
    },
    {
      icon: "Zap",
      title: "Performance Excellence",
      description: "Fast, efficient, and scalable solutions that perform beautifully under pressure. Every millisecond matters in user experience.",
      example: "Optimized a React application that improved load times from 8 seconds to under 2 seconds, increasing user retention by 40%."
    },
    {
      icon: "Shield",
      title: "Quality & Reliability",
      description: "Building robust systems with comprehensive testing, clear documentation, and maintainable code that stands the test of time.",
      example: "Implemented testing strategy that achieved 95% code coverage and reduced production bugs by 80% over 12 months."
    },
    {
      icon: "Users",
      title: "Collaborative Growth",
      description: "Great products are built by great teams. I believe in knowledge sharing, mentoring, and lifting others as we climb.",
      example: "Mentored 12 junior developers over 3 years, with 10 receiving promotions and 2 becoming team leads themselves."
    }
  ];

  // Mock personal interests
  const personalInterests = [
    {
      icon: "Camera",
      title: "Photography",
      description: "Capturing moments and exploring composition teaches me about visual storytelling and attention to detail."
    },
    {
      icon: "Mountain",
      title: "Hiking",
      description: "Trail running and hiking help me think through complex problems and maintain work-life balance."
    },
    {
      icon: "BookOpen",
      title: "Teaching",
      description: "Volunteer coding instructor at local community center, helping others discover the joy of programming."
    },
    {
      icon: "Coffee",
      title: "Coffee Roasting",
      description: "The precision and patience required in coffee roasting mirrors the attention to detail I bring to code."
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
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
                    src={personalInfo.profileImage}
                    alt={personalInfo.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg border border-primary-200">
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
                  {personalInfo.name}
                </h1>
                <p className="text-xl text-cta font-semibold mb-4">
                  {personalInfo.title}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-secondary-600 mb-6">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} />
                    <span>{personalInfo.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} />
                    <span>{personalInfo.experience}</span>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-secondary-700">
                <p className="mb-4">{personalInfo.biography}</p>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
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
                {personalInfo.philosophy}
              </p>
              <div className="bg-gradient-to-r from-cta-50 to-accent-50 rounded-xl p-8 border border-cta-200">
                <p className="text-lg font-semibold text-primary-800 italic">
                  "{personalInfo.mission}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-50">
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
              {valuesData.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-sm border border-primary-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-accent to-cta rounded-lg flex items-center justify-center">
                      <Icon name={value.icon} size={24} color="white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary-800 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-secondary-600 mb-4 leading-relaxed">
                        {value.description}
                      </p>
                      <div className="bg-accent-50 rounded-lg p-4 border-l-4 border-accent">
                        <p className="text-sm text-accent-800 font-medium">
                          Real Example: {value.example}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
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
                {timelineData.map((item, index) => (
                  <div
                    key={item.id}
                    className={`relative flex items-start space-x-6 cursor-pointer transition-all duration-300 ${
                      activeTimelineItem === item.id ? 'transform scale-105' : ''
                    }`}
                    onClick={() => setActiveTimelineItem(activeTimelineItem === item.id ? null : item.id)}
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
                      <div className="absolute -top-2 -right-2 bg-white rounded-full px-2 py-1 text-xs font-bold text-primary-800 border border-primary-200">
                        {item.year}
                      </div>
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-primary-200 hover:shadow-md transition-all duration-300">
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

                      {activeTimelineItem === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
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
                          <div>
                            <h4 className="font-semibold text-primary-800 mb-2">Technologies:</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.technologies.map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-50">
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
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-primary-200">
                  <h3 className="text-xl font-bold text-primary-800 mb-6 text-center">
                    {category.category}
                  </h3>
                  <div className="space-y-6">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex}>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
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
              {personalInterests.map((interest, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 text-center hover:shadow-md transition-all duration-300 border border-primary-200"
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