import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Icon from 'components/AppIcon';
import { useReducedMotion } from 'hooks/useReducedMotion';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';

import HeroSection from './components/HeroSection';
import FeaturedWork from './components/FeaturedWork';
import SkillsVisualization from './components/SkillsVisualization';
import SocialProof from './components/SocialProof';
import FloatingCTA from './components/FloatingCTA';
import WhoAmI from './components/WhoAmI';

const Homepage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const { profile } = usePortfolioSettings();
  const cvUrl = profile?.cv_url || profile?.resume_url;

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-text-primary transition-theme">
      <Helmet>
        <title>Home — Full Stack Developer Portfolio</title>
        <meta name="description" content="Explore my portfolio of web development projects, skills, and experience in building modern digital solutions." />
        <meta property="og:title" content="Home — Full Stack Developer Portfolio" />
        <meta property="og:description" content="Explore my portfolio of web development projects, skills, and experience." />
      </Helmet>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-primary-100 dark:bg-primary-200/30 z-50 transition-theme">
        <div 
          className="h-full bg-gradient-to-r from-accent-500 via-accent-400 to-cta transition-all duration-300 ease-out dark:from-accent-400 dark:via-accent-500 dark:to-cta"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Hero Section */}
      <HeroSection shouldReduceMotion={shouldReduceMotion} />

      {/* Who Am I Section */}
      <WhoAmI />

      {/* Featured Work Section
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">
              Featured Work
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              A curated selection of projects that showcase my approach to solving complex problems through thoughtful design and robust development.
            </p>
          </div>
          <FeaturedWork />
        </div>
      </section> */}

      {/* Skills Visualization Section */}
      <section className="py-20 bg-surface dark:bg-surface transition-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 transition-theme">
              Technical Expertise
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              A comprehensive toolkit built through years of hands-on experience and continuous learning.
            </p>
          </div>
          <SkillsVisualization shouldReduceMotion={shouldReduceMotion} />
        </div>
      </section>

      {/* Latest Insights Section Removed */}

      {/* Social Proof Section
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SocialProof />
        </div>
      </section> */}

      {/* Call to Action Section */}
      <section className="py-20 bg-background dark:bg-background border-t border-border dark:border-border-strong transition-theme">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Let's collaborate to turn your ideas into exceptional digital experiences that users love and businesses depend on.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact-hub"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center space-x-2"
            >
              <Icon name="MessageCircle" size={20} strokeWidth={2} />
              <span>Start a Conversation</span>
            </Link>
            <Link
              to="/portfolio-gallery"
              className="inline-flex items-center justify-center space-x-2 border border-border dark:border-border-strong hover:border-accent hover:bg-accent/5 text-text-primary dark:text-text-primary font-semibold py-4 px-8 rounded-xl transition-all duration-300"
            >
              <Icon name="Eye" size={20} strokeWidth={2} />
              <span>Explore My Work</span>
            </Link>
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 border border-accent text-accent hover:bg-accent hover:text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300"
              >
                <Icon name="Download" size={20} strokeWidth={2} />
                <span>Download CV</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Floating CTA */}
      <FloatingCTA scrollProgress={scrollProgress} />
    </div>
  );
};

export default Homepage;