import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "components/AppIcon";
import Image from "components/AppImage";
import { usePortfolioSettings } from "context/PortfolioSettingsContext";
import { useI18n } from "i18n/I18nContext";

const AboutStory = () => {
  const { profile, careerData, isReady } = usePortfolioSettings();
  const [activeTimelineItem, setActiveTimelineItem] = useState(undefined);
  const { t, lp, formatNumber } = useI18n();

  const careerTimeline = careerData?.timeline || [];
  const careerValues = careerData?.values || [];
  const careerInterests = careerData?.interests || [];
  const philosophy = careerData?.philosophy || "";
  const mission = careerData?.mission || "";

  const timelineKey = (item, index) => item.id || `timeline-${index}`;
  // The newest entry starts open so the section never looks empty.
  const openTimelineItem =
    activeTimelineItem === undefined && careerTimeline.length
      ? timelineKey(careerTimeline[0], 0)
      : activeTimelineItem;
  const hasApproach =
    Boolean(philosophy || mission) || careerValues.length > 0 || careerInterests.length > 0;

  const availability = {
    available: { text: t("about.available"), dot: "bg-success" },
    busy: { text: t("availability.busy"), dot: "bg-warning" },
  }[profile?.availability] || { text: t("availability.closed"), dot: "bg-secondary-400" };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-background dark:via-surface dark:to-background">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Above the fold: render in place, no fade-in on every visit. */}
          <motion.div
            initial={false}
            animate="visible"
            variants={containerVariants}
            className={`grid lg:grid-cols-2 gap-12 items-center ${isReady ? '' : 'invisible'}`}
          >
            {/* Profile Image */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative max-w-md mx-auto lg:max-w-none">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-accent-100 to-cta-100 p-2">
                  <Image
                    src={profile?.avatar || "/assets/images/no_image.png"}
                    alt={profile?.full_name || t('site.defaultName')}
                    width={640}
                    height={640}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="absolute -bottom-4 -end-4 bg-surface dark:bg-background rounded-xl p-4 shadow-lg border border-primary-200 dark:border-border-strong">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <div className={`w-3 h-3 ${availability.dot} rounded-full animate-pulse`}></div>
                    <span className="text-sm font-medium text-primary-700 dark:text-text-primary">
                      {availability.text}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Personal Introduction */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <h1 dir="auto" className="text-4xl lg:text-5xl font-bold text-primary-800 mb-2 dark:text-text-primary">
                  {profile?.full_name || t("site.defaultName")}
                </h1>
                <p dir="auto" className="text-xl text-cta font-semibold mb-4 dark:text-accent-text">
                  {profile?.title || t("about.defaultRole")}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-secondary-600 mb-6 dark:text-text-secondary">
                  {profile?.location && (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Icon name="MapPin" size={16} />
                      <span dir="auto">{profile.location}</span>
                    </div>
                  )}
                  {profile?.experience_years ? (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Icon name="Calendar" size={16} />
                      <span>{t("about.years", { count: Number(profile.experience_years) || 0, n: formatNumber(Number(profile.experience_years) || 0) })}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-secondary-700 dark:text-text-secondary">
                <p dir="auto" className="mb-4">{profile?.bio || ""}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  to={lp("/projects")}
                  className="btn-primary flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Icon name="Briefcase" size={18} />
                  <span>{t("home.hero.viewWork")}</span>
                </Link>
                <Link
                  to={lp("/contact-hub")}
                  className="btn-secondary flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <Icon name="MessageCircle" size={18} />
                  <span>{t("home.hero.connect")}</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How I work: philosophy, mission, values, interests (Career Data in the admin) */}
      {hasApproach && (
        <section className="py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="approach-title">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="approach-title" className="text-3xl lg:text-4xl font-bold text-primary-800 mb-4 dark:text-text-primary">
                {t("about.howTitle")}
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto dark:text-text-secondary">
                {t("about.howSubtitle")}
              </p>
            </div>

            {(philosophy || mission) && (
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {philosophy && (
                  <figure className="bg-surface dark:bg-surface rounded-2xl p-8 border border-primary-200 dark:border-border-strong">
                    <Icon name="Quote" size={28} className="text-accent dark:text-accent-text mb-4" />
                    <figcaption className="text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-muted mb-2">{t("about.philosophy")}</figcaption>
                    <blockquote dir="auto" className="text-xl leading-relaxed text-primary-800 dark:text-text-primary">
                      {philosophy}
                    </blockquote>
                  </figure>
                )}
                {mission && (
                  <figure className="bg-surface dark:bg-surface rounded-2xl p-8 border border-primary-200 dark:border-border-strong">
                    <Icon name="Target" size={28} className="text-accent dark:text-accent-text mb-4" />
                    <figcaption className="text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-muted mb-2">{t("about.mission")}</figcaption>
                    <p dir="auto" className="text-xl leading-relaxed text-primary-800 dark:text-text-primary">
                      {mission}
                    </p>
                  </figure>
                )}
              </div>
            )}

            {careerValues.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {careerValues.map((value, index) => (
                  <div
                    key={value.title || index}
                    className="bg-surface dark:bg-surface rounded-xl p-6 border border-primary-200 dark:border-border-strong"
                  >
                    <div className="w-11 h-11 rounded-lg bg-accent/10 dark:bg-accent-subtle flex items-center justify-center mb-4">
                      <Icon name={value.icon || "Heart"} size={20} className="text-accent dark:text-accent-text" />
                    </div>
                    <h3 dir="auto" className="text-lg font-bold text-primary-800 mb-2 dark:text-text-primary">{value.title}</h3>
                    {value.description && (
                      <p dir="auto" className="text-secondary-600 dark:text-text-secondary">{value.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {careerInterests.length > 0 && (
              <div className="text-center">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-500 dark:text-muted mb-4">
                  {t("about.interests")}
                </h3>
                <ul className="flex flex-wrap justify-center gap-3">
                  {careerInterests.map((interest, index) => {
                    const label = interest.name || interest.title;
                    if (!label) return null;
                    return (
                      <li
                        key={label + index}
                        title={interest.description || undefined}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-primary-200 text-sm font-medium text-primary-700 dark:border-border-strong dark:text-text-secondary"
                      >
                        <Icon name={interest.icon || "Star"} size={16} className="text-accent dark:text-accent-text" />
                        <span dir="auto">{label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Timeline Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            id="timeline"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="space-y-12"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-800 mb-4 dark:text-text-primary">
                {t("about.journeyTitle")}
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto dark:text-text-secondary">
                {t("about.journeySubtitle")}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              {/* Timeline Line */}
              <div className="absolute start-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-cta to-success hidden md:block"></div>

              <div className="space-y-8">
                {careerTimeline.map((item, index) => {
                  const key = timelineKey(item, index);
                  const isOpen = openTimelineItem === key;
                  const panelId = `timeline-panel-${index}`;
                  return (
                  <div
                    key={key}
                    className="relative flex items-start space-x-6 rtl:space-x-reverse"
                  >
                    {/* Timeline Dot */}
                    <div className="flex-shrink-0 relative">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                          item.type === "career"
                            ? "bg-accent border-accent-200"
                            : item.type === "certification"
                              ? "bg-cta border-cta-200"
                              : "bg-success border-success-200"
                        }`}
                      >
                        <Icon
                          name={
                            item.type === "career"
                              ? "Briefcase"
                              : item.type === "certification"
                                ? "Award"
                                : "GraduationCap"
                          }
                          size={24}
                          color="white"
                        />
                      </div>
                      <div className="absolute -top-2 -end-2 bg-surface dark:bg-background rounded-full px-2 py-1 text-xs font-bold text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-border-strong">
                        {item.year}
                      </div>
                    </div>

                    {/* Timeline Content */}
                    <div className={`flex-1 bg-surface dark:bg-background rounded-xl shadow-sm border transition-colors ${
                      isOpen ? "border-accent/60 dark:border-accent-fill/60" : "border-primary-200 dark:border-border-strong"
                    }`}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setActiveTimelineItem(isOpen ? null : key)}
                        className="w-full flex items-start justify-between gap-4 p-6 text-start rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <span className="min-w-0">
                          <span dir="auto" className="block text-xl font-bold text-primary-800 mb-1 dark:text-text-primary">
                            {item.title}
                          </span>
                          <span dir="auto" className="block text-cta font-semibold dark:text-accent-text">
                            {item.company}
                          </span>
                        </span>
                        <Icon
                          name={isOpen ? "ChevronUp" : "ChevronDown"}
                          size={20}
                          className="text-secondary-400 dark:text-muted flex-shrink-0 mt-1"
                        />
                      </button>

                      {isOpen && (
                        <div id={panelId} className="px-6 pb-6">
                          <p dir="auto" className="text-secondary-600 mb-4 dark:text-text-secondary">
                            {item.description}
                          </p>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            {item.achievements &&
                              item.achievements.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-primary-800 mb-2 dark:text-text-primary">
                                  {t("about.achievements")}
                                </h4>
                                <ul className="space-y-1">
                                  {item.achievements.map((achievement, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-center space-x-2 rtl:space-x-reverse text-secondary-600 dark:text-text-secondary"
                                    >
                                      <Icon
                                        name="CheckCircle"
                                        size={16}
                                        className="text-success"
                                      />
                                      <span dir="auto">{achievement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          {item.technologies &&
                            item.technologies.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-primary-800 mb-2 dark:text-text-primary">
                                  {t("projects.technologies")}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {item.technologies.map((tech, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-200 rounded-full text-sm font-medium"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-banner-from to-banner-to">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {t("about.cta.title")}
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {t("about.cta.subtitle")}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to={lp("/projects")}
                className="bg-white text-primary-800 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-lg hover:shadow-xl"
              >
                <Icon name="Eye" size={18} />
                <span>{t("home.hero.viewWork")}</span>
              </Link>
              <Link
                to={lp("/contact-hub")}
                className="bg-accent hover:bg-accent-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-lg hover:shadow-xl"
              >
                <Icon name="MessageCircle" size={18} />
                <span>{t("common.startConversation")}</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutStory;
