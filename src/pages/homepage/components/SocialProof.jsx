import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const SocialProof = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechFlow Inc.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      content: "Working with this digital craftsperson was an absolute game-changer for our product. The attention to detail and technical expertise delivered results that exceeded our expectations. Our user engagement increased by 60% after the redesign.",
      rating: 5,
      project: "E-commerce Platform Redesign"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "CTO",
      company: "HealthTech Solutions",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      content: "The healthcare dashboard project was complex, but the execution was flawless. The developer understood our unique requirements and delivered a solution that our medical professionals love using. Highly recommended for any serious project.",
      rating: 5,
      project: "Healthcare Dashboard"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Founder",
      company: "PropTech Innovations",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      content: "From concept to deployment, every aspect of our real estate platform was handled with professionalism and expertise. The scalable architecture and intuitive design have been crucial to our rapid growth and user satisfaction.",
      rating: 5,
      project: "Real Estate Platform"
    }
  ];

  const clientLogos = [
    {
      name: "TechFlow Inc.",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "HealthTech Solutions",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "PropTech Innovations",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "FinanceFlow",
      logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "DataViz Pro",
      logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "CloudSync",
      logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  const achievements = [
    {
      icon: "Award",
      title: "Industry Recognition",
      description: "Featured in top development showcases"
    },
    {
      icon: "Users",
      title: "Happy Clients",
      description: "100% client satisfaction rate"
    },
    {
      icon: "TrendingUp",
      title: "Proven Results",
      description: "Average 40% performance improvement"
    },
    {
      icon: "Clock",
      title: "On-Time Delivery",
      description: "Always meeting project deadlines"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? "text-warning-500 fill-current" : "text-gray-300"}
        strokeWidth={1}
      />
    ));
  };

  return (
    <div className="space-y-16">
      {/* Client Testimonials */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">
          What Clients Say
        </h2>
        <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-12">
          Don't just take my word for it. Here's what industry leaders and satisfied clients have to say about working together.
        </p>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-50 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cta-50 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center">
                  <Icon name="Quote" size={32} className="text-accent-600" strokeWidth={2} />
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  {renderStars(testimonials[currentTestimonial].rating)}
                </div>
                <blockquote className="text-lg md:text-xl text-secondary-700 leading-relaxed mb-6 italic">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="text-sm text-accent-600 font-medium mb-4">
                  Project: {testimonials[currentTestimonial].project}
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center justify-center space-x-4">
                <Image
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="text-left">
                  <div className="font-bold text-primary-800">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-secondary-600">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div className="text-accent-600 font-medium">
                    {testimonials[currentTestimonial].company}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-accent-600 scale-125' :'bg-primary-200 hover:bg-primary-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Client Logos */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-primary-800 mb-8">
          Trusted by Industry Leaders
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {clientLogos.map((client, index) => (
            <div
              key={index}
              className="group flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Image
                src={client.logo}
                alt={client.name}
                className="h-12 w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-cta-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon 
                name={achievement.icon} 
                size={32} 
                className="text-accent-600" 
                strokeWidth={2} 
              />
            </div>
            <h4 className="text-lg font-bold text-primary-800 mb-2">
              {achievement.title}
            </h4>
            <p className="text-secondary-600 text-sm">
              {achievement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialProof;