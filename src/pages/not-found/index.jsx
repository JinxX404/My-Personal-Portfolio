import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-primary-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-accent to-cta rounded-full flex items-center justify-center animate-bounce">
              <Icon name="Search" size={32} color="white" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-secondary-600 mb-6 max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off into the digital void.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            to="/homepage"
            className="btn-primary flex items-center space-x-2 px-6 py-3"
          >
            <Icon name="Home" size={18} strokeWidth={2} />
            <span>Back to Home</span>
          </Link>
          
          <Link
            to="/portfolio-gallery"
            className="btn-secondary flex items-center space-x-2 px-6 py-3"
          >
            <Icon name="Briefcase" size={18} strokeWidth={2} />
            <span>View Portfolio</span>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="text-sm text-secondary-500">
          <p className="mb-4">Or try one of these popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/about-story" 
              className="text-accent hover:text-accent-700 transition-colors duration-200"
            >
              About
            </Link>
            <Link 
              to="/blog-insights" 
              className="text-accent hover:text-accent-700 transition-colors duration-200"
            >
              Blog
            </Link>
            <Link 
              to="/contact-hub" 
              className="text-accent hover:text-accent-700 transition-colors duration-200"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent-100 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-cta-100 rounded-full opacity-50 animate-pulse animation-delay-400"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-success-100 rounded-full opacity-50 animate-pulse animation-delay-200"></div>
      </div>
    </div>
  );
};

export default NotFound;