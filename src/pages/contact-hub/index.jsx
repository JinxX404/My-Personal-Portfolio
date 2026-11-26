import React, { useState } from "react";
import { motion } from "framer-motion";
import Icon from "components/AppIcon";

import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import { usePortfolioSettings } from "context/PortfolioSettingsContext";
import { safeHref } from "lib/safeUrl";
import { useI18n } from "i18n/I18nContext";

const ContactHub = () => {
  const [selectedInquiryType, setSelectedInquiryType] = useState("general");
  const { siteSettings, profile } = usePortfolioSettings();
  const formEnabled = siteSettings?.enable_contact_form !== false;
  const email = profile?.email?.trim();
  const { t } = useI18n();

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
      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={false}
            animate="visible"
            variants={containerVariants}
            className="text-center mb-12"
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
              {t("contact.titleLine1")}
              <span className="text-gradient block">{t("contact.titleLine2")}</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-text-secondary max-w-3xl mx-auto mb-8"
            >
              {t("contact.subtitle")}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center space-x-2 rtl:space-x-reverse text-sm text-muted"
            >
              <Icon name="Clock" size={16} strokeWidth={2} />
              <span>{t("contact.replyTime")}</span>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Main Content */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              {formEnabled ? (
                <ContactForm
                  selectedInquiryType={selectedInquiryType}
                  onInquiryTypeChange={setSelectedInquiryType}
                />
              ) : (
                <div className="bg-surface rounded-2xl shadow-lg p-8 border border-border dark:border-border-strong text-center">
                  <Icon name="Mail" size={32} className="mx-auto text-accent dark:text-accent-text mb-4" />
                  <h2 className="text-2xl font-bold text-text-primary mb-2">{t("contact.closedTitle")}</h2>
                  <p className="text-text-secondary mb-6">
                    {t("contact.closedBody")}
                  </p>
                  {email && safeHref(`mailto:${email}`) && (
                    <a href={`mailto:${email}`} dir="ltr" className="btn-primary inline-flex">
                      {email}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactHub;
