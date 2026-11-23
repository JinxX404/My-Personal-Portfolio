import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import ThemeToggle from './ThemeToggle';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { profile } = usePortfolioSettings();

  const navigationItems = [
    { name: 'Home', path: '/homepage', icon: 'Home' },
    { name: 'Portfolio', path: '/portfolio-gallery', icon: 'Briefcase' },
    { name: 'About', path: '/about-story', icon: 'User' },
    { name: 'Contact', path: '/contact-hub', icon: 'Mail' }
  ];

  // Throttle scroll handler for performance
  const throttledHandleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          throttledHandleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [throttledHandleScroll]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('mobile-nav-open', isMobileMenuOpen);
    return () => document.documentElement.classList.remove('mobile-nav-open');
  }, [isMobileMenuOpen]);

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-theme ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-glass border-border/70 dark:border-border-strong/40 shadow-md'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/homepage" 
            className="flex items-center gap-3 group transition-theme"
            onClick={closeMobileMenu}
          >
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-accent-500 via-accent-400 to-accent-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                <Icon 
                  name="Code2" 
                  size={20} 
                  color="white" 
                  strokeWidth={2.5}
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full animate-pulse-soft"></div>
            </div>
            <div className="hidden sm:block">
              <span className="block text-xl font-bold text-text-primary group-hover:text-accent-500 transition-colors duration-200">
                {profile?.full_name || 'Moataz Mohammed'}
              </span>
              <p className="text-xs text-text-secondary font-mono transition-theme">{profile?.title || 'Full-Stack .NET Developer'}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-theme group ${
                  isActivePath(item.path)
                    ? 'text-accent-500 bg-accent-500/10 dark:text-accent-text dark:bg-accent-subtle'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/60 dark:hover:bg-background/60'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={item.icon} 
                    size={16} 
                    strokeWidth={2}
                  />
                  <span>{item.name}</span>
                </div>
                {isActivePath(item.path) && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-accent-500 rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button + Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            <Link
              to="/contact-hub"
              className="btn-primary text-sm px-5 py-2 rounded-xl"
            >
              Let's Talk
            </Link>
          </div>

          {/* Mobile theme toggle + menu button */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="p-2.5 rounded-lg text-text-primary hover:text-accent-500 hover:bg-surface/80 dark:hover:bg-background/60 transition-theme dark:hover:text-accent-text"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon
                name={isMobileMenuOpen ? "X" : "Menu"}
                size={24}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden transition-all duration-300 ease-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100' :'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="bg-surface/95 dark:bg-background/95 backdrop-blur-glass border-t border-border dark:border-border-strong/50 transition-theme">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navigationItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-theme ${
                  isActivePath(item.path)
                    ? 'text-accent-500 bg-accent-500/10 border border-accent-500/20 dark:text-accent-text dark:bg-accent-subtle dark:border-accent-fill/40'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/70 dark:hover:bg-background/60'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon 
                  name={item.icon} 
                  size={20} 
                  strokeWidth={2}
                />
                <span>{item.name}</span>
                {isActivePath(item.path) && (
                  <div className="ml-auto w-2 h-2 bg-cta rounded-full"></div>
                )}
              </Link>
            ))}
            
            {/* Mobile CTA */}
            <div className="pt-4 border-t border-border dark:border-border-strong/40 transition-theme">
              <Link
                to="/contact-hub"
                onClick={closeMobileMenu}
                className="flex items-center justify-center space-x-2 w-full btn-primary"
              >
                <Icon name="MessageCircle" size={18} strokeWidth={2} />
                <span>Let's Talk</span>
              </Link>
              <ThemeToggle variant="row" className="mt-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm z-[-1] transition-theme"
          onClick={closeMobileMenu}
        ></div>
      )}
    </header>
  );
};

export default Header;