import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from 'components/AppIcon';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'What is your typical response time?',
      answer: `I aim to respond to all inquiries within 24 hours during business days. For urgent matters, I typically respond within 4 hours. Phone calls are usually returned the same day if received during business hours (9 AM - 6 PM EET).`
    },
    {
      question: 'What types of projects do you work on?',
      answer: `I specialize in full-stack web applications, e-commerce platforms, custom web development, API integrations, and mobile-responsive websites. I work with React, Node.js, Python, and various modern frameworks. Project sizes range from small business websites to enterprise-level applications.`
    },
    {
      question: 'Do you have a minimum project budget?',
      answer: `My minimum project budget is typically $5,000 for custom development work. However, I'm flexible for the right projects and can discuss payment plans for startups or non-profits. Consultation calls are always free to determine if we're a good fit.`
    },
    {
      question: 'How do you handle project timelines?',
      answer: `Project timelines vary based on complexity and scope. Simple websites typically take 2-4 weeks, while complex applications can take 2-6 months. I provide detailed project timelines during the proposal phase and maintain regular communication throughout development.`
    },
    {
      question: 'Do you offer ongoing support and maintenance?',
      answer: `Yes, I offer various support packages including bug fixes, security updates, feature additions, and performance optimization. Most clients opt for a monthly retainer that includes hosting management, regular updates, and priority support.`
    },
    {
      question: 'Can you work with existing teams or agencies?',
      answer: `Absolutely! I frequently collaborate with design agencies, marketing teams, and other developers. I'm comfortable working as a team member, technical lead, or consultant depending on your needs. I use standard project management tools and communication practices.`
    },
    {
      question: 'What information do you need to provide a quote?',
      answer: `To provide an accurate quote, I need to understand your project goals, target audience, required features, design preferences, timeline, and budget range. The more details you can provide, the more accurate my estimate will be. We can discuss everything during a free consultation call.`
    },
    {
      question: 'Do you work with international clients?',answer: `Yes, I work with clients worldwide. I'm based in EET (UTC+2) but am flexible with meeting times for international clients. All communication is in English, and I'm experienced with remote collaboration tools and processes.`
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Find answers to common questions about working together, project processes, and what to expect.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-surface dark:bg-surface rounded-lg shadow-sm border border-border dark:border-border-strong overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors duration-200"
            >
              <h3 className="font-semibold text-text-primary pr-4">{faq.question}</h3>
              <div className={`transform transition-transform duration-200 ${
                openIndex === index ? 'rotate-180' : ''
              }`}>
                <Icon name="ChevronDown" size={20} className="text-muted" strokeWidth={2} />
              </div>
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 pt-2 border-t border-border dark:border-border-strong">
                    <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Still have questions CTA */}
      <div className="mt-12 text-center">
        <div className="bg-accent/5 dark:bg-accent/10 rounded-2xl p-8 border border-border dark:border-border-strong">
          <div className="mb-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="MessageCircle" size={24} color="white" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Still Have Questions?</h3>
            <p className="text-text-secondary mb-6">
              Don't see your question here? I'm happy to answer any specific questions about your project or working together.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-accent hover:bg-accent-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
              <Icon name="Mail" size={16} strokeWidth={2} />
              <span>Send a Message</span>
            </button>
            <button className="bg-surface dark:bg-surface border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
              <Icon name="Calendar" size={16} strokeWidth={2} />
              <span>Schedule a Call</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FAQ;