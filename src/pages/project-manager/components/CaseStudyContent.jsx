// src/pages/project-manager/components/CaseStudyContent.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import BilingualField from 'components/admin/BilingualField';

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

  // By position: testimonials saved outside this editor may have no id.
  const updateTestimonial = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      testimonials: (prev.testimonials || []).map((t, i) => (i === index ? { ...t, [field]: value } : t))
    }));
  };

  const removeTestimonial = (index) => {
    setFormData(prev => ({
      ...prev,
      testimonials: (prev.testimonials || []).filter((_, i) => i !== index)
    }));
  };

  const isCaseStudyEnabled = formData?.enableCaseStudy ?? false;

  return (
    <div className="bg-white dark:bg-surface rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-3">
            <Icon name="FileText" size={20} className="text-primary-600 dark:text-text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200">Project Details</h2>
        </div>
        
        {/* Toggle detailed project write-up */}
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
            isCaseStudyEnabled ? 'text-accent-700 dark:text-accent-text' : 'text-secondary-600 dark:text-muted'
          }`}>
            {isCaseStudyEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      {!isCaseStudyEnabled && (
        <div className="text-center py-12 bg-secondary-50 rounded-lg border-2 border-dashed border-secondary-300 dark:bg-surface dark:border-border">
          <Icon name="FileText" size={48} className="text-secondary-400 mx-auto mb-4 dark:text-muted" />
          <h3 className="text-lg font-semibold text-secondary-700 mb-2 dark:text-text-secondary">Project Details Off</h3>
          <p className="text-secondary-600 mb-4 dark:text-text-secondary">
            Enable the toggle above to add a detailed write-up for this project.
          </p>
          <p className="text-sm text-secondary-500 dark:text-muted">
            Sections include problem definition, solution approach, results, testimonials, and more.
          </p>
        </div>
      )}

      {isCaseStudyEnabled && (
        <div className="space-y-6">
          {/* Problem Definition */}
          <BilingualField
            className="mb-6"
            label="Problem Definition"
            multiline
            rows={8}
            value={formData?.problem}
            valueAr={formData?.problem_ar}
            onChange={(value) => setFormData(prev => ({ ...prev, problem: value }))}
            onChangeAr={(value) => setFormData(prev => ({ ...prev, problem_ar: value }))}
            placeholder="Describe the problem or challenge this project aimed to solve..."
            placeholderAr="المشكلة أو التحدي الذي عالجه المشروع"
          />

          {/* Solution Approach */}
          <BilingualField
            className="mb-6"
            label="Solution Approach"
            multiline
            rows={8}
            value={formData?.solution}
            valueAr={formData?.solution_ar}
            onChange={(value) => setFormData(prev => ({ ...prev, solution: value }))}
            onChangeAr={(value) => setFormData(prev => ({ ...prev, solution_ar: value }))}
            placeholder="Explain your approach to solving the problem..."
            placeholderAr="طريقتك في حل المشكلة"
          />

          {/* Results */}
          <BilingualField
            className="mb-6"
            label="Results & Impact"
            multiline
            rows={8}
            value={formData?.results}
            valueAr={formData?.results_ar}
            onChange={(value) => setFormData(prev => ({ ...prev, results: value }))}
            onChangeAr={(value) => setFormData(prev => ({ ...prev, results_ar: value }))}
            placeholder="Document the results and impact of your solution..."
            placeholderAr="النتائج والأثر"
          />

          {/* Prototype Embedding */}
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-2 dark:text-text-secondary">
              Interactive Prototype Embed
            </label>
            <input
              type="url"
              value={formData?.prototypeUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, prototypeUrl: e.target.value }))}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors mb-2 dark:border-border"
              placeholder="https://figma.com/proto/... or https://invision.com/..."
            />
            <p className="text-xs text-secondary-500 dark:text-muted">
              Supports Figma, InVision, Adobe XD, and other prototype sharing URLs
            </p>
          </div>

          {/* Testimonials */}
          <div>
            <label className="block text-sm font-semibold text-secondary-700 mb-3 dark:text-text-secondary">
              Client Testimonials
            </label>
            
            {/* Add Testimonial Form */}
            <div className="p-4 bg-secondary-50 rounded-lg mb-4 dark:bg-surface">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={testimonial.name}
                  onChange={(e) => setTestimonial(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors dark:border-border"
                  placeholder="Client name"
                />
                <input
                  type="text"
                  value={testimonial.role}
                  onChange={(e) => setTestimonial(prev => ({ ...prev, role: e.target.value }))}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors dark:border-border"
                  placeholder="Role/Position"
                />
                <input
                  type="text"
                  value={testimonial.company}
                  onChange={(e) => setTestimonial(prev => ({ ...prev, company: e.target.value }))}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors dark:border-border"
                  placeholder="Company"
                />
                <input
                  type="url"
                  value={testimonial.avatar}
                  onChange={(e) => setTestimonial(prev => ({ ...prev, avatar: e.target.value }))}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors dark:border-border"
                  placeholder="Avatar URL (optional)"
                />
              </div>
              <textarea
                value={testimonial.content}
                onChange={(e) => setTestimonial(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors resize-none mb-3 dark:border-border"
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
                {formData.testimonials.map((testimonial, index) => (
                  <div key={testimonial.id ?? `t-${index}`} className="p-4 border border-secondary-200 rounded-lg dark:border-border">
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
                          <p className="font-semibold text-secondary-800 dark:text-text-primary">{testimonial.name}</p>
                          <p className="text-sm text-secondary-600 dark:text-text-secondary">
                            {testimonial.role}{testimonial.company && ` at ${testimonial.company}`}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTestimonial(index)}
                        className="text-error-600 hover:text-error-800 transition-colors dark:text-error"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                    <div className="mt-3 space-y-3">
                      <BilingualField
                        label="Testimonial"
                        multiline
                        rows={3}
                        value={testimonial.content}
                        valueAr={testimonial.content_ar}
                        onChange={(value) => updateTestimonial(index, 'content', value)}
                        onChangeAr={(value) => updateTestimonial(index, 'content_ar', value)}
                        placeholderAr="نص الشهادة بالعربية"
                      />
                      <div className="grid grid-cols-1 gap-3">
                        <BilingualField
                          label="Name"
                          value={testimonial.name}
                          valueAr={testimonial.name_ar}
                          onChange={(value) => updateTestimonial(index, 'name', value)}
                          onChangeAr={(value) => updateTestimonial(index, 'name_ar', value)}
                          placeholderAr="الاسم"
                        />
                        <BilingualField
                          label="Role"
                          value={testimonial.role}
                          valueAr={testimonial.role_ar}
                          onChange={(value) => updateTestimonial(index, 'role', value)}
                          onChangeAr={(value) => updateTestimonial(index, 'role_ar', value)}
                          placeholderAr="المسمى"
                        />
                        <BilingualField
                          label="Company"
                          value={testimonial.company}
                          valueAr={testimonial.company_ar}
                          onChange={(value) => updateTestimonial(index, 'company', value)}
                          onChangeAr={(value) => updateTestimonial(index, 'company_ar', value)}
                          placeholderAr="الشركة"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-secondary-700 dark:text-text-secondary cursor-pointer">
                        <input
                          type="checkbox"
                          checked={testimonial.featured === true}
                          onChange={(e) => updateTestimonial(index, 'featured', e.target.checked)}
                          className="h-4 w-4 rounded border-primary-300 text-accent focus:ring-accent"
                          data-testimonial-featured
                        />
                        Show on the homepage
                        <span className="text-xs text-secondary-500 dark:text-muted">(published projects only)</span>
                      </label>
                    </div>
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