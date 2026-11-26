import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useI18n } from 'i18n/I18nContext';
import { usePublicServices } from 'hooks/usePublicServices';
import { formatServicePrice, prepareFaqs, prepareServices, serviceContactPath } from 'lib/services.mjs';

// Services and FAQ, both edited in the admin (Services & FAQ). Nothing is
// hard-coded: with no published services the page shows a short "get in
// touch" card, and the FAQ block only appears when it has entries.

const ServiceCard = ({ service, t, lp, lang }) => {
  const price = formatServicePrice(service, lang);
  return (
    <article
      className="flex flex-col h-full bg-surface dark:bg-surface rounded-2xl border border-border dark:border-border-strong shadow-sm hover:shadow-lg transition-shadow p-6 lg:p-8"
      data-service-card
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 shrink-0 rounded-xl bg-accent/10 dark:bg-accent-subtle flex items-center justify-center">
          <Icon name={service.icon || 'Briefcase'} size={24} className="text-accent dark:text-accent-text" strokeWidth={2} />
        </div>
        <h2 className="text-xl font-bold text-text-primary leading-snug pt-2" dir="auto">{service.title}</h2>
      </div>
      {service.description && (
        <p className="text-text-secondary leading-relaxed mb-5 whitespace-pre-line" dir="auto">{service.description}</p>
      )}
      {service.deliverables.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">{t('services.deliverables')}</h3>
          <ul className="space-y-2">
            {service.deliverables.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-primary">
                <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-success dark:text-success-text" strokeWidth={2.5} />
                <span dir="auto">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-auto pt-5 border-t border-border dark:border-border-strong flex flex-wrap items-center justify-between gap-4">
        <div>
          {price ? (
            <>
              <p className="text-xs text-muted">{t('services.from')}</p>
              <p className="text-lg font-bold text-text-primary">
                <bdi>{price}</bdi>
                {service.price_note && (
                  <span className="ms-2 text-sm font-normal text-text-secondary"><bdi>{service.price_note}</bdi></span>
                )}
              </p>
            </>
          ) : (
            <p className="text-sm font-semibold text-text-secondary">{t('services.quote')}</p>
          )}
        </div>
        <Link
          to={lp(serviceContactPath(service))}
          className="btn-primary inline-flex items-center gap-2 px-5 py-2.5"
          data-service-cta
        >
          <Icon name="MessageCircle" size={18} strokeWidth={2} />
          <span>{t('services.ask')}</span>
        </Link>
      </div>
    </article>
  );
};

const ServicesPage = () => {
  const { t, lp, lang } = useI18n();
  const { services: rawServices, faqs: rawFaqs, loaded } = usePublicServices();
  const services = useMemo(() => prepareServices(rawServices, lang), [rawServices, lang]);
  const faqs = useMemo(() => prepareFaqs(rawFaqs, lang), [rawFaqs, lang]);

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-24 lg:pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl mb-6">
            <Icon name="Layers" size={30} color="white" strokeWidth={2} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-5">{t('services.title')}</h1>
          <p className="text-xl text-text-secondary">{t('services.subtitle')}</p>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8" aria-live="polite">
        <div className="max-w-7xl mx-auto">
          {!loaded ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-surface border border-border dark:border-border-strong" />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} t={t} lp={lp} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="max-w-xl mx-auto text-center bg-surface rounded-2xl border border-border dark:border-border-strong p-8" data-services-empty>
              <p className="text-text-secondary mb-6">{t('services.empty')}</p>
              <Link to={lp('/contact-hub')} className="btn-primary inline-flex items-center gap-2">
                <Icon name="MessageCircle" size={18} strokeWidth={2} />
                <span>{t('common.startConversation')}</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface border-t border-border dark:border-border-strong" aria-labelledby="faq-title" data-faq>
          <div className="max-w-3xl mx-auto">
            <h2 id="faq-title" className="text-3xl font-bold text-text-primary text-center mb-10">{t('services.faqTitle')}</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group rounded-xl border border-border dark:border-border-strong bg-background open:shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
                    <span dir="auto">{faq.question}</span>
                    <Icon name="ChevronDown" size={18} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-text-secondary leading-relaxed whitespace-pre-line" dir="auto">{faq.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border dark:border-border-strong">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-4">{t('services.ctaTitle')}</h2>
            <p className="text-lg text-text-secondary mb-8">{t('services.ctaBody')}</p>
            <Link to={lp('/contact-hub')} className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              <Icon name="MessageCircle" size={20} strokeWidth={2} />
              <span>{t('common.startConversation')}</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default ServicesPage;
