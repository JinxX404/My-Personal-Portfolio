// src/pages/project-manager/components/CaseStudyContent.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const CaseStudyContent = ({ formData, setFormData }) => {
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [testimonial, setTestimonial] = useState({ name: '', role: '', company: '', content: '', avatar: '' });

  const templates = {
    problem: {
      title: "Problem Definition Template",
      content: `## The Challenge

**Background Context:**
[Describe the situation that led to this project]

**Key Problems Identified:**
- Problem 1: [Specific issue]
- Problem 2: [Another issue]
- Problem 3: [Additional challenge]

**Impact of Problems:**
- [How these problems affected users/business]
- [Quantify the impact where possible]

**Constraints:**
- [Any limitations or constraints faced]`
    },
    solution: {
      title: "Solution Approach Template",
      content: `## Our Approach

**Strategy:**
[Overall approach and methodology]

**Key Solutions Implemented:**
1. **Solution 1**
   - Description: [What was implemented]
   - Rationale: [Why this approach was chosen]
   - Outcome: [Result achieved]

2. **Solution 2**
   - Description: [What was implemented]
   - Rationale: [Why this approach was chosen]
   - Outcome: [Result achieved]

**Technical Implementation:**
- [Key technical decisions]
- [Architecture choices]
- [Tools and technologies used]

**Design Process:**
- [Design thinking process]
- [User research findings]
- [Iteration and refinement]`
    },
    results: {
      title: "Results Documentation Template",
      content: `## Results & Impact

**Quantitative Results:**
- Metric 1: [X% improvement]
- Metric 2: [Y reduction in Z]
- Metric 3: [Specific measurable outcome]

**Qualitative Outcomes:**
- [User feedback]
- [Stakeholder satisfaction]
- [Process improvements]

**Key Achievements:**
- [Major accomplishment 1]
- [Major accomplishment 2]
- [Major accomplishment 3]

**Lessons Learned:**
- [What worked well]
- [What could be improved]
- [Future considerations]

**Next Steps:**
- [Planned improvements]
- [Future enhancements]
- [Scalability considerations]`
    }
  };

  const insertTemplate = (templateKey) => {
    const template = templates[templateKey];
    if (template) {
      setFormData(prev => ({
        ...prev,
        [templateKey]: template.content
      }));
      setActiveTemplate(null);
    }
  };

  const addTestimonial = () => {
    if (testimonial.name && testimonial.content) {
      const testimonials = formData?.testimonials || [];
      setFormData(prev => ({
        ...prev,
        testimonials: [...testimonials, { ...testimonial, id: Date.now() }]
      }));
      setTestimonial({ name: '', role: '', company: '', content: '', avatar: '' });
    }
  };

  const removeTestimonial = (testimonialId) => {
    const testimonials = formData?.testimonials || [];
    setFormData(prev => ({
      ...prev,
      testimonials: testimonials.filter(t => t.id !== testimonialId)
    }));
  };

  const isCaseStudyEnabled = formData?.enableCaseStudy ?? false;

  return (
    <div className="bg-white dark:bg-surface rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-3">
            <Icon name="FileText" size={20} className="text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200">Case Study Content</h2>
        </div>
        
        {/* Toggle Case Study */}
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={isCaseStudyEnabled}
              onChange={(e) => setFormData(prev => ({ ...prev, enableCaseStudy: e.target.checked }))}
              className="sr-only"
            />
            <div className={`block w-14 h-8 rounded-full transition-colors ${
              isCaseStudyEnabled ? 'bg-accent-600' : 'bg-secondary-300'
            }`}></div>
            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
              isCaseStudyEnabled ? 'transform translate-x-6' : ''
            }`}></div>
          </div>
          <span className={`ml-3 text-sm font-medium ${
            isCaseStudyEnabled ? 'text-accent-700' : 'text-secondary-600'
          }`}>
            {isCaseStudyEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      {!isCaseStudyEnabled && (
        <div className="text-center py-12 bg-secondary-50 rounded-lg border-2 border-dashed border-secondary-300">
          <Icon name="FileText" size={48} className="text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-700 mb-2">Case Study Disabled</h3>
          <p className="text-secondary-600 mb-4">
            Enable the toggle above to add detailed case study content to this project.
          </p>
          <p className="text-sm text-secondary-500">
            Case study sections include problem definition, solution approach, results, testimonials, and more.
          </p>
        </div>
      )}

      {isCaseStudyEnabled && (
        <div className="space-y-6">
          {/* Problem Definition */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2 block">
              Problem Definition
            </label>
            <textarea
              value={formData?.problem || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, problem: e.target.value }))}
              className="w-full px-4 py-3 border border-secondary-300 dark:border-primary-700 dark:bg-background dark:text-primary-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors resize-none"
              rows={8}
              placeholder="Describe the problem or challenge this project aimed to solve..."
            />
          </div>

          {/* Solution Approach */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2 block">
              Solution Approach
            </label>
            <textarea
              value={formData?.solution || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
              className="w-full px-4 py-3 border border-secondary-300 dark:border-primary-700 dark:bg-background dark:text-primary-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors resize-none"
              rows={8}
              placeholder="Explain your approach to solving the problem..."
            />
          </div>

          {/* Results */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2 block">
              Results & Impact
            </label>
            <textarea
              value={formData?.results || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
              className="w-full px-4 py-3 border border-secondary-300 dark:border-primary-700 dark:bg-background dark:text-primary-200 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors resize-none"
              rows={8}
              placeholder="Document the results and impact of your solution..."
            />
          </div>

          {/* Prototype Embedding */}
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2">
              Interactive Prototype Embed
            </label>
            <input
              type="url"
              value={formData?.prototypeUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, prototypeUrl: e.target.value }))}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors mb-2"
              placeholder="https://figma.com/proto/... or https://invision.com/..."
            />
            <p className="text-xs text-secondary-500">
              Supports Figma, InVision, Adobe XD, and other prototype sharing URLs
            </p>
          </div>

          {/* Testimonials */}
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-3">
              Client Testimonials
            </label>
            
            {/* Add Testimonial Form */}
            <div className="p-4 bg-secondary-50 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={testimonial.name}
                  onChange={(e) => setTestimonial(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                  placeholder="Client name"
                />
                <input
                  type="text"
                  value={testimonial.role}
                  onChange={(e) => setTestimonial(prev => ({ ...prev, role: e.target.value }))}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                  placeholder="Role/Position"
                />
                <input
                  type="text"
                  value={testimonial.company}
                  onChange={(e) => setTestimonial(prev => ({ ...prev, company: e.target.value }))}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                  placeholder="Company"
                />
                <input
                  type="url"
                  value={testimonial.avatar}
                  onChange={(e) => setTestimonial(prev => ({ ...prev, avatar: e.target.value }))}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
                  placeholder="Avatar URL (optional)"
                />
              </div>
              <textarea
                value={testimonial.content}
                onChange={(e) => setTestimonial(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors resize-none mb-3"
                rows={3}
                placeholder="Testimonial content..."
              />
              <button
                type="button"
                onClick={addTestimonial}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Testimonial
              </button>
            </div>

            {/* Testimonials List */}
            {formData?.testimonials?.length > 0 && (
              <div className="space-y-3">
                {formData.testimonials.map(testimonial => (
                  <div key={testimonial.id} className="p-4 border border-secondary-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {testimonial.avatar && (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-secondary-800">{testimonial.name}</p>
                          <p className="text-sm text-secondary-600">
                            {testimonial.role}{testimonial.company && ` at ${testimonial.company}`}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTestimonial(testimonial.id)}
                        className="text-error-600 hover:text-error-800 transition-colors"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                    <p className="text-secondary-700 italic">"{testimonial.content}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyContent;