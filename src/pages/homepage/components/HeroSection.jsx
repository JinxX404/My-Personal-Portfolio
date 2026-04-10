import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';
import { useProjects } from 'context/ProjectsContext';

const HeroSection = ({ shouldReduceMotion }) => {
  const { profile, freelanceProjects } = usePortfolioSettings();
  const { projects } = useProjects();
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const cvUrl = profile?.cv_url || profile?.resume_url;

  const codeSnippets = [
    {
      language: 'JavaScript',
      code: `const createAmazingExperience = () => {
  const passion = 'problem-solving';
  const skills = ['React', 'Node.js', 'Design'];
  
  return skills.map(skill => 
    passion + skill + 'innovation' ).join(' = success');
};

console.log(createAmazingExperience());`,
      output: '// Output: Exceptional digital solutions'
    },
    {
      language: 'CSS',
      code: `.digital-craftsperson {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  --creativity: infinite;
  --attention-to-detail: 100%;
  --problem-solving: always-on;
  
  background: linear-gradient(
    45deg, passion, expertise
  );
}`,
      output: '/* Result: Beautiful, functional interfaces */'
    },
    {
      language: 'React',
      code: `function ProblemSolver({ challenge }) {
  const [solution, setSolution] = useState(null);
  
  useEffect(() => {
    const solve = async () => {
      const result = await analyzeAndSolve(challenge);
      setSolution(result);
    };
    solve();
  }, [challenge]);
  
  return <Innovation solution={solution} />;
}`,
      output: '// Returns: Scalable, maintainable solutions'
    }
  ];

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setIsTyping(false);
      setTimeout(() => {
        setCurrentCodeIndex((prev) => (prev + 1) % codeSnippets.length);
        setIsTyping(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [codeSnippets, shouldReduceMotion]);

  const currentSnippet = codeSnippets[currentCodeIndex];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background dark:bg-background text-text-primary transition-theme overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-70 dark:opacity-60">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-500/20 dark:bg-accent-500/25 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-72 h-72 bg-cta-400/20 dark:bg-cta-400/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-200"></div>
        <div className="absolute -bottom-8 left-32 w-72 h-72 bg-success/15 dark:bg-success-500/25 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-400"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Interactive Code Demo */}
          <div className="order-2 lg:order-1">
            <div className="glass-panel rounded-2xl overflow-hidden border border-border dark:border-border-strong/40">
              {/* Terminal Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-surface/70 dark:bg-background/50 border-b border-border dark:border-border-strong/40">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-error-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                </div>
                <div className="text-sm text-text-secondary font-mono">
                  {currentSnippet.language}
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Play" size={16} className="text-success-500" strokeWidth={2} />
                  <span className="text-xs text-success-500">Running</span>
                </div>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm bg-background/70 dark:bg-background/50 transition-theme">
                <pre className={`text-text-secondary dark:text-secondary-200 transition-opacity duration-500 ${isTyping ? 'opacity-100' : 'opacity-70'}`}>
                  <code>{currentSnippet.code}</code>
                </pre>
                <div className="mt-4 pt-4 border-t border-border dark:border-border-strong/40">
                  <p className="text-success-500 text-xs">{currentSnippet.output}</p>
                </div>
              </div>

              {/* Language Indicators */}
              <div className="px-6 pb-4">
                <div className="flex space-x-2">
                  {codeSnippets.map((snippet, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCodeIndex(index)}
                      className={`px-3 py-1 text-xs rounded-full transition-all duration-300 border border-transparent ${
                        index === currentCodeIndex
                          ? 'bg-accent-500 text-white shadow-md'
                          : 'bg-surface text-text-secondary hover:text-text-primary hover:border-border dark:bg-background/60 dark:text-text-secondary'
                      }`}
                    >
                      {snippet.language}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Hero Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left transition-theme">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-accent-500/10 text-accent-500 rounded-full text-sm font-medium mb-4">
                <Icon name="Code2" size={16} strokeWidth={2} className="mr-2" />
                {profile?.availability === 'available' ? 'Available for new opportunities' : 
                 profile?.availability === 'busy' ? 'Limited availability' : 'Currently unavailable'}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-text-primary dark:text-white">
                {profile?.title ? (
                  profile.title.split(' ').map((word, index) => (
                    <span key={index} className="block">{word}</span>
                  ))
                ) : (
                  <>
                    <span className="block">Full Stack</span>
                    <span className="block">Developer</span>
                  </>
                )}
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {profile?.tagline || 'Crafting digital experiences that matter through innovative solutions and thoughtful design.'}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <Link
                to="/portfolio-gallery"
                className="btn-primary text-base px-6 py-3 inline-flex items-center justify-center space-x-2"
              >
                <Icon name="Eye" size={18} strokeWidth={2} />
                <span>View My Work</span>
              </Link>
              <Link
                to="/contact-hub"
                className="btn-secondary text-base px-6 py-3 inline-flex items-center justify-center space-x-2"
              >
                <Icon name="MessageCircle" size={18} strokeWidth={2} />
                <span>Let's Connect</span>
              </Link>
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-base px-6 py-3 inline-flex items-center justify-center space-x-2"
                >
                  <Icon name="Download" size={18} strokeWidth={2} />
                  <span>Download CV</span>
                </a>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-accent-500">{profile?.experience_years || '1+'}</div>
                <div className="text-sm text-text-secondary">Years Experience</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-accent-500">{projects?.filter(p => p.publishing_status === 'published').length || 0}+</div>
                <div className="text-sm text-text-secondary">Projects Delivered</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-success">{freelanceProjects}+</div>
                <div className="text-sm text-text-secondary">Freelance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center text-primary-200">
            <span className="text-sm mb-2">Scroll to explore</span>
            <Icon name="ChevronDown" size={24} strokeWidth={2} />
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;