import React from "react";
import { motion } from "framer-motion";
import Icon from "components/AppIcon";
import { usePortfolioSettings } from "context/PortfolioSettingsContext";
import { safeHref } from "lib/safeUrl";
import { useI18n } from "i18n/I18nContext";
import { detectPlatform } from "lib/socialPlatforms.mjs";

const socialColorMap = {
  "blue-600": {
    bg10: "bg-blue-600/10 dark:bg-blue-400/15",
    bg20: "bg-blue-600/20 dark:bg-blue-400/20",
    text: "text-blue-600 dark:text-blue-400",
  },
  "blue-700": {
    bg10: "bg-blue-700/10 dark:bg-blue-400/15",
    bg20: "bg-blue-700/20 dark:bg-blue-400/20",
    text: "text-blue-700 dark:text-blue-400",
  },
  "gray-800": {
    bg10: "bg-gray-800/10 dark:bg-white/10",
    bg20: "bg-gray-800/20 dark:bg-white/15",
    text: "text-gray-800 dark:text-gray-200",
  },
  "blue-400": {
    bg10: "bg-blue-400/10 dark:bg-blue-400/15",
    bg20: "bg-blue-400/20 dark:bg-blue-400/20",
    text: "text-blue-400 dark:text-blue-300",
  },
  "pink-500": {
    bg10: "bg-pink-500/10 dark:bg-pink-400/15",
    bg20: "bg-pink-500/20 dark:bg-pink-400/20",
    text: "text-pink-500 dark:text-pink-400",
  },
  "blue-500": {
    bg10: "bg-blue-500/10 dark:bg-blue-400/15",
    bg20: "bg-blue-500/20 dark:bg-blue-400/20",
    text: "text-blue-500 dark:text-blue-400",
  },
  "pink-600": {
    bg10: "bg-pink-600/10 dark:bg-pink-400/15",
    bg20: "bg-pink-600/20 dark:bg-pink-400/20",
    text: "text-pink-600 dark:text-pink-400",
  },
  "red-600": {
    bg10: "bg-red-600/10 dark:bg-red-400/15",
    bg20: "bg-red-600/20 dark:bg-red-400/20",
    text: "text-red-600 dark:text-red-400",
  },
  "gray-700": {
    bg10: "bg-gray-700/10 dark:bg-white/10",
    bg20: "bg-gray-700/20 dark:bg-white/15",
    text: "text-gray-700 dark:text-gray-200",
  },
  "orange-600": {
    bg10: "bg-orange-600/10 dark:bg-orange-400/15",
    bg20: "bg-orange-600/20 dark:bg-orange-400/20",
    text: "text-orange-600 dark:text-orange-400",
  },
  accent: { bg10: "bg-accent/10 dark:bg-accent-subtle", bg20: "bg-accent/20 dark:bg-accent-fill/20", text: "text-accent dark:text-accent-text" },
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
  const { t, lang } = useI18n();

  // Every saved link is shown; the platform (name, icon, colour) comes from the
  // link's address, so profiles such as Mostaql get their own label.
  const socialPlatforms = Object.entries(socialLinks || {})
    .map(([key, url]) => ({ key, url: safeHref(url), platform: detectPlatform(url, key, lang) }))
    .filter((link) => link.url)
    .map(({ key, url, platform }) => ({ key, url, name: platform.label, icon: platform.icon, color: platform.color }));

  const cardWrapper = embedded ? "" : "bg-surface dark:bg-surface rounded-2xl shadow-lg p-8 border border-border dark:border-border-strong";

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={embedded ? "" : "space-y-8"}
    >
      {/* Social Media Links */}
      <div className={cardWrapper || "p-0"}>
        {!embedded && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              {t("contact.social.title")}
            </h2>
            <p className="text-text-secondary">
              {t("contact.social.subtitle")}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {socialPlatforms.map((platform, index) => {
            const colors =
              socialColorMap[platform.color] || socialColorMap["blue-600"];
            return (
              <motion.a
                key={platform.key}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={false}
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
