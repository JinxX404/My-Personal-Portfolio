import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Icon from "components/AppIcon";

import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import FAQ from "./components/FAQ";

const ContactHub = () => {
  const [selectedInquiryType, setSelectedInquiryType] = useState("general");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const inquiryTypes = [
    {
      id: "project",
      title: "Project Inquiries",
      description: "Ready to start a new project or need development help",
      icon: "Briefcase",
      color: "accent",
    },
    {
      id: "general",
      title: "General Questions",
      description: "Any other questions or feedback",
      icon: "MessageCircle",
      color: "secondary",
    },
  ];

  const inquiryColorMap = {
    accent: { border: "border-accent", bg: "bg-accent/5", solid: "bg-accent" },
    success: {
      border: "border-success",
      bg: "bg-success/5",
      solid: "bg-success",
    },
    warning: {
      border: "border-warning",
      bg: "bg-warning/5",
      solid: "bg-warning",
    },
    secondary: {
      border: "border-secondary",
      bg: "bg-secondary/5",
      solid: "bg-secondary",
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Helmet>
        <title>Contact — Get in Touch</title>
        <meta
          name="description"
          content="Get in touch for project inquiries, collaborations, speaking requests, or general questions. Response within 24 hours."
        />
        <meta property="og:title" content="Contact — Get in Touch" />
        <meta
          property="og:description"
          content="Get in touch for project inquiries, collaborations, speaking requests, or general questions."
        />
      </Helmet>
      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-2xl mb-6">
                <Icon
                  name="MessageSquare"
                  size={32}
                  color="white"
                  strokeWidth={2}
                />
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6"
            >
              Let's Create Something
              <span className="text-gradient block">Amazing Together</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-text-secondary max-w-3xl mx-auto mb-8"
            >
              Whether you have a project in mind, want to collaborate, or just
              want to say hello, I'd love to hear from you. Choose the option
              that best describes your inquiry.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center space-x-4 text-sm text-muted"
            >
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} strokeWidth={2} />
                <span>Response within 24 hours</span>
              </div>
              <div className="w-1 h-1 bg-secondary-400 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} strokeWidth={2} />
                <span>100% Confidential</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Inquiry Type Selection */}
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          >
            {inquiryTypes.map((type, index) => {
              const colors =
                inquiryColorMap[type.color] || inquiryColorMap.accent;
              return (
                <motion.button
                  key={type.id}
                  variants={itemVariants}
                  onClick={() => setSelectedInquiryType(type.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 text-left group bg-surface dark:bg-surface ${
                    selectedInquiryType === type.id
                      ? `border-accent ${colors.bg} shadow-lg`
                      : "border-border dark:border-border-strong hover:border-accent hover:shadow-md"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${
                      selectedInquiryType === type.id
                        ? `${colors.solid} text-white`
                        : "bg-primary-100 dark:bg-primary-900/50 text-text-secondary dark:text-text-secondary group-hover:bg-accent/10"
                    }`}
                  >
                    <Icon name={type.icon} size={20} strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">
                    {type.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {type.description}
                  </p>
                  {selectedInquiryType === type.id && (
                    <div className="mt-3 flex items-center text-sm font-medium text-accent">
                      <span>Selected</span>
                      <Icon
                        name="Check"
                        size={16}
                        className="ml-1"
                        strokeWidth={2}
                      />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm selectedInquiryType={selectedInquiryType} />
            </div>

            {/* Contact Information */}
            <div>
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-surface border-t border-border dark:border-border-strong">
        <div className="max-w-4xl mx-auto">
          <FAQ />
        </div>
      </section>*/}

      {/* Trust Signals */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-surface border-t border-border dark:border-border-strong">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-text-secondary">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} strokeWidth={2} />
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Lock" size={16} strokeWidth={2} />
                <span>Secure Communication</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} strokeWidth={2} />
                <span>Verified Professional</span>
              </div>
            </div>

            <div className="text-sm text-muted">
              <span>Available in timezone: </span>
              <span className="font-medium text-text-primary">EET (UTC+2)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactHub;
