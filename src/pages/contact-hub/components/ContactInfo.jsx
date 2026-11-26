import React from "react";
import { motion } from "framer-motion";
import Icon from "components/AppIcon";
import { usePortfolioSettings } from "context/PortfolioSettingsContext";
import { safeHref } from "lib/safeUrl";
import SocialLinks from "./SocialLinks";

const contactMethodColorMap = {
  accent: { bg10: "bg-accent/10 dark:bg-accent-subtle", bg20: "bg-accent/20 dark:bg-accent-fill/20", text: "text-accent dark:text-accent-text" },
  success: {
    bg10: "bg-success/10 dark:bg-success-900/30",
    bg20: "bg-success/20 dark:bg-success-800/30",
    text: "text-success dark:text-success-text",
  },
  warning: {
    bg10: "bg-warning/10 dark:bg-warning-900/40",
    bg20: "bg-warning/20 dark:bg-warning-800/40",
    text: "text-warning",
  },
};

const ContactInfo = () => {
  const { profile } = usePortfolioSettings();
  
  const cvUrl = safeHref(profile?.cv_url || profile?.resume_url);

  const contactMethods = [
    profile?.email && {
      icon: "Mail",
      title: "Email",
      value: profile.email,
      description: "Best for detailed inquiries",
      action: safeHref(`mailto:${profile.email}`),
      color: "accent",
    },
    profile?.phone && {
      icon: "Phone",
      title: "Phone",
      value: profile.phone,
      description: "Available All Week, 9AM-6PM EET",
      action: safeHref(`tel:${profile.phone.replace(/[^\d+]/g, "")}`),
      color: "success",
    },
    profile?.location && {
      icon: "MapPin",
      title: "Location",
      value: profile.location,
      description: "Let's meet or work remotely",
      action: null,
      color: "warning",
    },
  ].filter(Boolean);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-surface dark:bg-surface rounded-2xl shadow-lg p-8 border border-border dark:border-border-strong"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary dark:text-text-primary mb-2">
          Get in Touch
        </h2>
        <p className="text-text-secondary dark:text-text-secondary">
          Choose the method that works best for you. I'm here to help bring your
          ideas to life.
        </p>
      </div>

      <div className="space-y-6">
        {contactMethods.map((method, index) => {
          const colors =
            contactMethodColorMap[method.color] || contactMethodColorMap.accent;
          const MotionTag = method.action ? motion.a : motion.div;
          return (
            <MotionTag
              key={method.title}
              {...(method.action
                ? {
                    href: method.action,
                    ...(method.action.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {}),
                  }
                : {})}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-4 p-4 rounded-lg hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors duration-200 group"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors.bg10} group-hover:${colors.bg20} transition-colors duration-200`}
              >
                <Icon
                  name={method.icon}
                  size={20}
                  className={colors.text}
                  strokeWidth={2}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary mb-1">
                  {method.title}
                </h3>
                <p
                  dir={method.icon === "Phone" ? "ltr" : "auto"}
                  className="text-text-primary font-medium mb-1 [overflow-wrap:anywhere] text-start"
                >
                  {method.value}
                </p>
                <p className="text-sm text-text-secondary">
                  {method.description}
                </p>
              </div>
              {method.action && (
                <Icon
                  name="ExternalLink"
                  size={16}
                  className="text-secondary-400 group-hover:text-secondary-600 transition-colors duration-200 dark:text-muted"
                  strokeWidth={2}
                />
              )}
            </MotionTag>
          );
        })}
      </div>


      {/* Availability Status */}

      {/* Calendar Integration */}
      {/* <div className="mt-6">
        <button className="w-full bg-gradient-to-r from-accent to-cta text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
          <Icon name="Calendar" size={18} strokeWidth={2} />
          <span>Schedule a Free Consultation</span>
        </button>
        <p className="text-xs text-secondary-500 text-center mt-2 dark:text-muted">
          30-minute discovery call to discuss your project
        </p>
      </div>*/}

      {/* CV Download */}
      {cvUrl && (
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-accent-50 to-cta-50 dark:from-accent-900/20 dark:to-cta-900/20 border border-accent/20 dark:border-accent/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 dark:bg-accent/20 flex items-center justify-center">
                <Icon name="FileText" size={20} className="text-accent dark:text-accent-text" strokeWidth={2} />
              </div>
              <div>
                <p className="font-semibold text-text-primary dark:text-white text-sm">Download My CV</p>
                <p className="text-xs text-text-secondary">Get my resume in PDF format</p>
              </div>
            </div>
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent hover:bg-accent-600 text-white transition-colors duration-200 shadow-md hover:shadow-lg"
              aria-label="Download CV"
              title="Download CV"
            >
              <Icon name="Download" size={18} strokeWidth={2} />
            </a>
          </div>
        </div>
      )}

      <div className="mt-6">
        <SocialLinks />
      </div>
      {profile?.availability && (
        <div
          className={`mt-6 p-4 rounded-lg border ${
            profile.availability === "available"
              ? "bg-success-50 border-success-200 dark:bg-success-900/30 dark:border-success-800"
              : profile.availability === "busy"
                ? "bg-warning-50 border-warning-200 dark:bg-warning-900/40 dark:border-warning-800"
                : "bg-secondary-50 border-secondary-200 dark:bg-surface-elevated dark:border-border"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                profile.availability === "available"
                  ? "bg-success animate-pulse"
                  : profile.availability === "busy"
                    ? "bg-warning"
                    : "bg-secondary-400"
              }`}
            ></div>
            <div>
              <p
                className={`text-sm font-medium ${
                  profile.availability === "available"
                    ? "text-success-800 dark:text-success-text"
                    : profile.availability === "busy"
                      ? "text-warning-800 dark:text-warning"
                      : "text-secondary-800 dark:text-text-primary"
                }`}
              >
                {profile.availability === "available"
                  ? "Currently Available"
                  : profile.availability === "busy"
                    ? "Limited Availability"
                    : "Currently Unavailable"}
              </p>
              <p
                className={`text-xs ${
                  profile.availability === "available"
                    ? "text-success-600 dark:text-success-text"
                    : profile.availability === "busy"
                      ? "text-warning-600 dark:text-warning"
                      : "text-secondary-600 dark:text-muted"
                }`}
              >
                {profile.availability === "available"
                  ? "Accepting new projects"
                  : profile.availability === "busy"
                    ? "Selected projects only"
                    : "Not taking new projects at this time"}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ContactInfo;
