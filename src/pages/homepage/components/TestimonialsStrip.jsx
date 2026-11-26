import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';
import { useProjects } from 'context/ProjectsContext';
import { featuredTestimonials } from '../../../i18n/content.mjs';
import { useI18n } from 'i18n/I18nContext';

const isPublicProject = (project) =>
  project &&
  project.visibility !== 'private' &&
  (project.publishing_status === 'published' || project.publishing_status === 'in_progress');

/**
 * Client words picked in the project editor ("Show on the homepage").
 * Renders nothing until at least one testimonial is featured.
 */
const TestimonialsStrip = () => {
  const { projects } = useProjects();
  const { t, lp, lang } = useI18n();
  const items = useMemo(
    () => featuredTestimonials((projects || []).filter(isPublicProject), lang).slice(0, 6),
    [projects, lang]
  );

  if (items.length === 0) return null;

  return (
    <section className="py-20 bg-background border-t border-border dark:border-border-strong" aria-labelledby="testimonials-title" data-testimonials-strip>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="testimonials-title" className="text-4xl md:text-5xl font-bold text-text-primary mb-4">{t('home.testimonials.title')}</h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">{t('home.testimonials.subtitle')}</p>
        </div>
        <div className={`grid gap-6 ${items.length === 1 ? 'max-w-2xl mx-auto' : items.length === 2 ? 'md:grid-cols-2 max-w-5xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
          {items.map((item) => (
            <figure key={item.key} className="flex flex-col h-full rounded-2xl bg-surface border border-border dark:border-border-strong p-6 shadow-sm">
              <Icon name="Quote" size={28} className="text-accent/60 dark:text-accent-text/70 mb-3" />
              <blockquote className="flex-1 text-text-primary leading-relaxed" dir="auto">{item.quote}</blockquote>
              <figcaption className="mt-5 pt-4 border-t border-border dark:border-border-strong">
                <p className="font-semibold text-text-primary"><bdi>{item.name}</bdi></p>
                {(item.role || item.company) && (
                  <p className="text-sm text-text-secondary">
                    {[item.role, item.company].filter(Boolean).map((part, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && t('home.testimonials.separator')}
                        <bdi>{part}</bdi>
                      </React.Fragment>
                    ))}
                  </p>
                )}
                <Link to={lp(`/projects/${item.projectId}`)} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline dark:text-accent-text">
                  <bdi>{item.projectTitle}</bdi>
                  <Icon name="ArrowRight" size={14} />
                </Link>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsStrip;
