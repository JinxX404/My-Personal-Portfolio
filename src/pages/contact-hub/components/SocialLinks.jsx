import React from "react";
import { motion } from "framer-motion";
import Icon from "components/AppIcon";
import { usePortfolioSettings } from "context/PortfolioSettingsContext";

const socialColorMap = {
  "blue-600": {
    bg10: "bg-blue-600/10",
    bg20: "bg-blue-600/20",
    text: "text-blue-600",
  },
  "blue-700": {
    bg10: "bg-blue-700/10",
    bg20: "bg-blue-700/20",
    text: "text-blue-700",
  },
  "gray-800": {
    bg10: "bg-gray-800/10",
    bg20: "bg-gray-800/20",
    text: "text-gray-800",
  },
  "blue-400": {
    bg10: "bg-blue-400/10",
    bg20: "bg-blue-400/20",
    text: "text-blue-400",
  },
  "pink-500": {
    bg10: "bg-pink-500/10",
    bg20: "bg-pink-500/20",
    text: "text-pink-500",
  },
  "blue-500": {
    bg10: "bg-blue-500/10",
    bg20: "bg-blue-500/20",
    text: "text-blue-500",
  },
  "pink-600": {
    bg10: "bg-pink-600/10",
    bg20: "bg-pink-600/20",
    text: "text-pink-600",
  },
  "red-600": {
    bg10: "bg-red-600/10",
    bg20: "bg-red-600/20",
    text: "text-red-600",
  },
  "gray-700": {
    bg10: "bg-gray-700/10",
    bg20: "bg-gray-700/20",
    text: "text-gray-700",
  },
  "orange-600": {
    bg10: "bg-orange-600/10",
    bg20: "bg-orange-600/20",
    text: "text-orange-600",
  },
  accent: { bg10: "bg-accent/10", bg20: "bg-accent/20", text: "text-accent" },
  warning: {
    bg10: "bg-warning/10",
    bg20: "bg-warning/20",
    text: "text-warning",
  },
  success: {
    bg10: "bg-success/10",
    bg20: "bg-success/20",
    text: "text-success",
  },
};

const SocialLinks = ({ embedded = false }) => {
  const { socialLinks } = usePortfolioSettings();

  const platformMeta = {
    github: {
      name: "GitHub",
      icon: "Github",
      description: "Open source projects & code",
      color: "gray-800",
    },
    linkedin: {
      name: "LinkedIn",
      icon: "Linkedin",
      description: "Professional updates & networking",
      color: "blue-600",
    },
    twitter: {
      name: "Twitter / X",
      icon: "Twitter",
      description: "Tech insights & thoughts",
      color: "blue-400",
    },
    dribbble: {
      name: "Dribbble",
      icon: "Dribbble",
      description: "Design work & creative process",
      color: "pink-500",
    },
    behance: {
      name: "Behance",
      icon: "Box",
      description: "Creative showcase",
      color: "blue-500",
    },
    instagram: {
      name: "Instagram",
      icon: "Instagram",
      description: "Visual content",
      color: "pink-600",
    },
    facebook: {
      name: "Facebook",
      icon: "Facebook",
      description: "Social profile",
      color: "blue-700",
    },
    youtube: {
      name: "YouTube",
      icon: "Youtube",
      description: "Video content",
      color: "red-600",
    },
    medium: {
      name: "Medium",
      icon: "FileText",
      description: "Articles & writing",
      color: "gray-700",
    },
    dev_to: {
      name: "DEV.to",
      icon: "Code",
      description: "Developer community",
      color: "gray-800",
    },
    stackoverflow: {
      name: "Stack Overflow",
      icon: "HelpCircle",
      description: "Q&A profile",
      color: "orange-600",
    },
    codepen: {
      name: "CodePen",
      icon: "Code2",
      description: "Code snippets & experiments",
      color: "gray-800",
    },
  };

  const socialPlatforms = Object.entries(socialLinks || {})
    .filter(([key, url]) => url && url.trim() !== "" && platformMeta[key])
    .map(([key, url]) => ({
      ...platformMeta[key],
      url,
    }));

  const cardWrapper = embedded ? "" : "bg-surface dark:bg-surface rounded-2xl shadow-lg p-8 border border-border dark:border-border-strong";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={embedded ? "" : "space-y-8"}
    >
      {/* Social Media Links */}
      <div className={cardWrapper || "p-0"}>
        {!embedded && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Connect Online
            </h2>
            <p className="text-text-secondary">
              Follow my journey and stay updated with my latest work and insights.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {socialPlatforms.map((platform, index) => {
            const colors =
              socialColorMap[platform.color] || socialColorMap["blue-600"];
            return (
              <motion.a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface dark:bg-primary-900/30 border border-border dark:border-border-strong hover:border-accent hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${colors.bg10} group-hover:${colors.bg20} transition-colors duration-200`}
                >
                  <Icon
                    name={platform.icon}
                    size={24}
                    className={colors.text}
                    strokeWidth={1.5}
                  />
                </div>
                <span className="text-sm font-medium text-text-primary text-center leading-tight line-clamp-2 w-full max-w-full overflow-hidden">
                  {platform.name}
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default SocialLinks;
