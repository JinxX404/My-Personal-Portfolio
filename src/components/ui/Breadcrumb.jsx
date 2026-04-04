import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-2 text-sm text-secondary-600 mb-6" aria-label="Breadcrumb">
    {items.map((item, index) => (
      <React.Fragment key={item.href || item.label}>
        {index > 0 && <Icon name="ChevronRight" size={14} />}
        {item.href ? (
          <Link to={item.href} className="hover:text-accent transition-colors">
            {item.label}
          </Link>
        ) : (
          <span className="text-primary-800 dark:text-primary-200 font-medium">{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

export default Breadcrumb;
