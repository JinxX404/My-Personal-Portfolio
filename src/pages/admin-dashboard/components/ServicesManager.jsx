// src/pages/admin-dashboard/components/ServicesManager.jsx
// Services and FAQ, bilingual (English and Arabic side by side), same
// patterns as the project editor: Arabic is optional but flagged.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from 'components/AppIcon';
import Modal from 'components/ui/Modal';
import EmptyState from 'components/ui/EmptyState';
import Breadcrumb from 'components/ui/Breadcrumb';
import BilingualField, { ArabicMissingBadge } from 'components/admin/BilingualField';
import { useToast } from 'context/ToastContext';
import { FAQ_SPEC, missingArabic, SERVICE_SPEC } from '../../../i18n/content.mjs';
import { formatServicePrice } from 'lib/services.mjs';
import { createRow, deleteRow, fetchAllFaqs, fetchAllServices, updateRow } from 'services/servicesService';
import { invalidatePublicServices } from 'hooks/usePublicServices';

const ICONS = ['Briefcase', 'Code', 'Code2', 'Globe', 'Layout', 'Smartphone', 'Database', 'Server', 'ShoppingCart', 'Settings', 'Layers', 'PenTool', 'Palette', 'Zap', 'Shield', 'LifeBuoy', 'Search', 'BarChart3'];

const emptyService = () => ({
  title: '', title_ar: '', description: '', description_ar: '',
  deliverables: [{ text: '', text_ar: '' }],
  price_from: '', currency: 'EGP', price_note: '', price_note_ar: '',
  icon: 'Briefcase', published: false,
});
const emptyFaq = () => ({ question: '', question_ar: '', answer: '', answer_ar: '', published: false });

const blankToNull = (value) => (typeof value === 'string' && value.trim() ? value.trim() : null);

/** Form state -> database row (trimmed, empty Arabic stored as NULL). */
export function serviceRow(form) {
  const price = form.price_from === '' || form.price_from === null || form.price_from === undefined ? null : Number(form.price_from);
  return {
    title: form.title.trim(),
    title_ar: blankToNull(form.title_ar),
    description: blankToNull(form.description),
    description_ar: blankToNull(form.description_ar),
    deliverables: (form.deliverables || [])
      .filter((d) => (d.text || '').trim() || (d.text_ar || '').trim())
      .map((d) => ({ text: (d.text || '').trim(), text_ar: (d.text_ar || '').trim() })),
    price_from: Number.isFinite(price) && price >= 0 ? price : null,
    currency: form.currency === 'USD' ? 'USD' : 'EGP',
    price_note: price === null ? null : blankToNull(form.price_note),
    price_note_ar: price === null ? null : blankToNull(form.price_note_ar),
    icon: form.icon || 'Briefcase',
    published: Boolean(form.published),
  };
}

const faqRow = (form) => ({
  question: form.question.trim(),
  question_ar: blankToNull(form.question_ar),
  answer: form.answer.trim(),
  answer_ar: blankToNull(form.answer_ar),
  published: Boolean(form.published),
});

const nextOrder = (rows) => rows.reduce((max, row) => Math.max(max, row.order_index ?? 0), -1) + 1;

const PublishedPill = ({ published }) => (
  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${published ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-text' : 'bg-secondary-100 text-secondary-700 dark:bg-surface-elevated dark:text-muted'}`}>
    {published ? 'Published' : 'Hidden'}
  </span>
);

const RowActions = ({ index, count, onMove, onEdit, onDelete, label }) => (
  <div className="flex items-center gap-1 shrink-0">
    <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className="p-2 rounded-lg text-secondary-500 hover:bg-primary-50 disabled:opacity-30 dark:hover:bg-surface-elevated" aria-label={`Move ${label} up`}>
      <Icon name="ChevronUp" size={16} />
    </button>
    <button type="button" onClick={() => onMove(1)} disabled={index === count - 1} className="p-2 rounded-lg text-secondary-500 hover:bg-primary-50 disabled:opacity-30 dark:hover:bg-surface-elevated" aria-label={`Move ${label} down`}>
      <Icon name="ChevronDown" size={16} />
    </button>
    <button type="button" onClick={onEdit} className="p-2 rounded-lg text-accent hover:bg-accent/10 dark:text-accent-text" aria-label={`Edit ${label}`}>
      <Icon name="Edit" size={16} />
    </button>
    <button type="button" onClick={onDelete} className="p-2 rounded-lg text-error-600 hover:bg-error-50 dark:text-error dark:hover:bg-error-900/20" aria-label={`Delete ${label}`}>
      <Icon name="Trash2" size={16} />
    </button>
  </div>
);

const ServicesManager = () => {
  const { success, warning, error: showError } = useToast();
  const [tab, setTab] = useState('services');
  const [services, setServices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missingTable, setMissingTable] = useState(false);
  const [serviceForm, setServiceForm] = useState(null); // null = closed
  const [faqForm, setFaqForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const [s, f] = await Promise.all([fetchAllServices(), fetchAllFaqs()]);
    setServices(s.success ? s.data : []);
    setFaqs(f.success ? f.data : []);
    setMissingTable(Boolean(s.missingTable || f.missingTable));
    if (!s.success || !f.success) showError(s.error || f.error || 'Could not load services');
    setLoading(false);
  }, [showError]);

  useEffect(() => { load(); }, [load]);

  const afterWrite = (result, okMessage, missing = []) => {
    if (!result.success) {
      showError(result.error || 'Save failed');
      return false;
    }
    invalidatePublicServices();
    if (missing.length) warning(`${okMessage} Arabic is missing for ${missing.length} field${missing.length === 1 ? '' : 's'}; the Arabic site shows English there.`, 7000);
    else success(okMessage);
    return true;
  };

  // ---------------------------------------------------------------- services
  const saveService = async () => {
    if (!serviceForm.title.trim()) { setFormError('English title is required.'); return; }
    if (serviceForm.price_from !== '' && !(Number(serviceForm.price_from) >= 0)) { setFormError('Price must be a positive number, or empty for "Contact for a quote".'); return; }
    setFormError('');
    setSaving(true);
    const row = serviceRow(serviceForm);
    const result = serviceForm.id
      ? await updateRow('services', serviceForm.id, row)
      : await createRow('services', { ...row, order_index: nextOrder(services) });
    setSaving(false);
    if (afterWrite(result, serviceForm.id ? 'Service updated.' : 'Service added.', missingArabic(row, SERVICE_SPEC))) {
      setServiceForm(null);
      load();
    }
  };

  const editService = (service) => setServiceForm({
    ...emptyService(),
    ...service,
    title_ar: service.title_ar || '', description: service.description || '', description_ar: service.description_ar || '',
    price_from: service.price_from ?? '', price_note: service.price_note || '', price_note_ar: service.price_note_ar || '',
    deliverables: Array.isArray(service.deliverables) && service.deliverables.length
      ? service.deliverables.map((d) => ({ text: d.text || '', text_ar: d.text_ar || '' }))
      : [{ text: '', text_ar: '' }],
  });

  const setDeliverable = (index, field, value) => setServiceForm((prev) => ({
    ...prev,
    deliverables: prev.deliverables.map((d, i) => (i === index ? { ...d, [field]: value } : d)),
  }));

  // ---------------------------------------------------------------- faqs
  const saveFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) { setFormError('English question and answer are required.'); return; }
    setFormError('');
    setSaving(true);
    const row = faqRow(faqForm);
    const result = faqForm.id
      ? await updateRow('faqs', faqForm.id, row)
      : await createRow('faqs', { ...row, order_index: nextOrder(faqs) });
    setSaving(false);
    if (afterWrite(result, faqForm.id ? 'Question updated.' : 'Question added.', missingArabic(row, FAQ_SPEC))) {
      setFaqForm(null);
      load();
    }
  };

  // ---------------------------------------------------------------- shared
  const remove = async (table, row, label) => {
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    const result = await deleteRow(table, row.id);
    if (afterWrite(result, 'Deleted.')) load();
  };

  const move = async (table, rows, index, step) => {
    const other = index + step;
    if (other < 0 || other >= rows.length) return;
    const ordered = [...rows];
    [ordered[index], ordered[other]] = [ordered[other], ordered[index]];
    // Re-number by list position so duplicate or missing order values still sort right.
    const results = await Promise.all(
      ordered.map((row, position) => (row.order_index === position ? { success: true } : updateRow(table, row.id, { order_index: position })))
    );
    const failed = results.find((r) => !r.success);
    if (failed) showError(failed.error || 'Could not reorder');
    invalidatePublicServices();
    load();
  };

  const togglePublished = async (table, row) => {
    const result = await updateRow(table, row.id, { published: !row.published });
    if (afterWrite(result, row.published ? 'Hidden from the site.' : 'Published.')) load();
  };

  const serviceMissing = useMemo(() => services.reduce((n, s) => n + missingArabic(s, SERVICE_SPEC).length, 0), [services]);
  const faqMissing = useMemo(() => faqs.reduce((n, f) => n + missingArabic(f, FAQ_SPEC).length, 0), [faqs]);

  const tabButton = (id, label, count, missing) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${tab === id ? 'text-accent border-b-2 border-accent dark:text-accent-text dark:border-accent-text' : 'text-secondary-600 hover:text-primary-800 dark:text-text-secondary dark:hover:text-text-primary'}`}
      aria-pressed={tab === id}
    >
      {label} <span className="text-xs text-secondary-500 dark:text-muted">({count})</span>
      {missing > 0 && <span className="rounded-full bg-warning-100 px-2 py-0.5 text-[11px] font-semibold text-warning-800 dark:bg-warning-900/30 dark:text-warning">AR {missing}</span>}
    </button>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ href: '/admin-dashboard', label: 'Dashboard' }, { label: 'Services & FAQ' }]} />
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 dark:bg-surface">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-800 dark:text-text-primary">Services &amp; FAQ</h1>
              <p className="text-secondary-600 mt-1 dark:text-text-secondary">
                Shown on the Services page (/services and /ar/services). The page and its menu link stay hidden until a service is published.
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setFormError(''); tab === 'services' ? setServiceForm(emptyService()) : setFaqForm(emptyFaq()); }}
              disabled={missingTable}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50"
            >
              <Icon name="Plus" size={18} strokeWidth={2} />
              <span className="font-medium">{tab === 'services' ? 'Add Service' : 'Add Question'}</span>
            </button>
          </div>
          <div className="flex gap-2 border-b border-primary-200 dark:border-border">
            {tabButton('services', 'Services', services.length, serviceMissing)}
            {tabButton('faq', 'FAQ', faqs.length, faqMissing)}
          </div>
        </div>

        {missingTable && (
          <div className="mb-6 rounded-xl border border-warning-300 bg-warning-50 p-4 text-sm text-warning-900 dark:border-warning-800/60 dark:bg-warning-900/20 dark:text-warning" role="status" data-missing-table>
            The services and FAQ tables are not in the database yet. Apply <code>supabase/migrations/009_services_faq.sql</code>; until then the public site simply hides these sections.
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-secondary-500 dark:bg-surface dark:text-muted">Loading…</div>
        ) : tab === 'services' ? (
          services.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm dark:bg-surface">
              <EmptyState icon="Layers" title="No services yet" description="Add what you offer. Prices are optional: without one the card says “Contact for a quote”." actionLabel={missingTable ? undefined : 'Add Service'} onAction={() => setServiceForm(emptyService())} />
            </div>
          ) : (
            <div className="space-y-3" data-services-list>
              {services.map((service, index) => {
                const missing = missingArabic(service, SERVICE_SPEC);
                const price = formatServicePrice(service, 'en');
                return (
                  <div key={service.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-5 dark:bg-surface flex items-start gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-accent/10 dark:bg-accent-subtle flex items-center justify-center">
                      <Icon name={service.icon || 'Briefcase'} size={20} className="text-accent dark:text-accent-text" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-primary-800 dark:text-text-primary">{service.title}</h2>
                        <PublishedPill published={service.published} />
                        {missing.length > 0 && <ArabicMissingBadge />}
                      </div>
                      {service.title_ar && <p className="text-sm text-secondary-600 dark:text-text-secondary"><span dir="rtl" lang="ar">{service.title_ar}</span></p>}
                      <p className="text-xs text-secondary-500 mt-1 dark:text-muted">
                        {price ? `From ${price}${service.price_note ? ` · ${service.price_note}` : ''}` : 'Contact for a quote'}
                        {' · '}{(service.deliverables || []).length} deliverable{(service.deliverables || []).length === 1 ? '' : 's'}
                      </p>
                    </div>
                    <button type="button" onClick={() => togglePublished('services', service)} className="hidden sm:inline-flex text-xs font-medium px-3 py-1.5 rounded-lg border border-primary-200 hover:bg-primary-50 dark:border-border dark:hover:bg-surface-elevated">
                      {service.published ? 'Hide' : 'Publish'}
                    </button>
                    <RowActions index={index} count={services.length} label={service.title}
                      onMove={(step) => move('services', services, index, step)}
                      onEdit={() => { setFormError(''); editService(service); }}
                      onDelete={() => remove('services', service, service.title)} />
                  </div>
                );
              })}
            </div>
          )
        ) : faqs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm dark:bg-surface">
            <EmptyState icon="HelpCircle" title="No questions yet" description="Questions you get often, answered once. Shown under the services." actionLabel={missingTable ? undefined : 'Add Question'} onAction={() => setFaqForm(emptyFaq())} />
          </div>
        ) : (
          <div className="space-y-3" data-faq-list>
            {faqs.map((faq, index) => (
              <div key={faq.id} className="bg-white rounded-xl shadow-sm p-4 sm:p-5 dark:bg-surface flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-primary-800 dark:text-text-primary">{faq.question}</h2>
                    <PublishedPill published={faq.published} />
                    {missingArabic(faq, FAQ_SPEC).length > 0 && <ArabicMissingBadge />}
                  </div>
                  {faq.question_ar && <p className="text-sm text-secondary-600 dark:text-text-secondary"><span dir="rtl" lang="ar">{faq.question_ar}</span></p>}
                  <p className="text-sm text-secondary-500 mt-1 line-clamp-2 dark:text-muted">{faq.answer}</p>
                </div>
                <button type="button" onClick={() => togglePublished('faqs', faq)} className="hidden sm:inline-flex text-xs font-medium px-3 py-1.5 rounded-lg border border-primary-200 hover:bg-primary-50 dark:border-border dark:hover:bg-surface-elevated">
                  {faq.published ? 'Hide' : 'Publish'}
                </button>
                <RowActions index={index} count={faqs.length} label={faq.question}
                  onMove={(step) => move('faqs', faqs, index, step)}
                  onEdit={() => { setFormError(''); setFaqForm({ ...emptyFaq(), ...faq, question_ar: faq.question_ar || '', answer_ar: faq.answer_ar || '' }); }}
                  onDelete={() => remove('faqs', faq, faq.question)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service modal */}
      <Modal
        isOpen={Boolean(serviceForm)}
        onClose={() => setServiceForm(null)}
        size="xl"
        title={serviceForm?.id ? 'Edit Service' : 'Add Service'}
        footer={
          <>
            <button type="button" onClick={() => setServiceForm(null)} className="flex-1 px-4 py-2 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors dark:border-border dark:text-text-primary dark:hover:bg-surface-elevated">Cancel</button>
            <button type="button" onClick={saveService} disabled={saving} className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-60">{saving ? 'Saving…' : serviceForm?.id ? 'Update' : 'Add'}</button>
          </>
        }
      >
        {serviceForm && (
          <div className="space-y-5" data-service-form>
            {formError && <p className="text-sm text-error" role="alert">{formError}</p>}
            <BilingualField label="Title" required maxLength={120} value={serviceForm.title} valueAr={serviceForm.title_ar}
              onChange={(v) => setServiceForm({ ...serviceForm, title: v })} onChangeAr={(v) => setServiceForm({ ...serviceForm, title_ar: v })}
              placeholder="e.g. Web application development" placeholderAr="مثال: تطوير تطبيقات الويب" />
            <BilingualField label="Description" multiline rows={4} maxLength={1000} value={serviceForm.description} valueAr={serviceForm.description_ar}
              onChange={(v) => setServiceForm({ ...serviceForm, description: v })} onChangeAr={(v) => setServiceForm({ ...serviceForm, description_ar: v })} />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="block text-sm font-medium text-primary-700 dark:text-text-primary">Deliverables</span>
                <button type="button" onClick={() => setServiceForm({ ...serviceForm, deliverables: [...serviceForm.deliverables, { text: '', text_ar: '' }] })} className="text-sm font-medium text-accent hover:underline dark:text-accent-text">+ Add deliverable</button>
              </div>
              <div className="space-y-3">
                {serviceForm.deliverables.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <BilingualField className="flex-1" label={`Deliverable ${index + 1}`} maxLength={160} value={item.text} valueAr={item.text_ar}
                      onChange={(v) => setDeliverable(index, 'text', v)} onChangeAr={(v) => setDeliverable(index, 'text_ar', v)} />
                    <button type="button" onClick={() => setServiceForm({ ...serviceForm, deliverables: serviceForm.deliverables.filter((_, i) => i !== index) })} className="mt-7 p-2 text-error-600 hover:bg-error-50 rounded-lg dark:text-error dark:hover:bg-error-900/20" aria-label={`Remove deliverable ${index + 1}`}>
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="service-price" className="block text-sm font-medium text-primary-700 mb-1 dark:text-text-primary">Starting price <span className="font-normal text-secondary-500 dark:text-muted">(optional)</span></label>
                <input id="service-price" type="number" min="0" step="1" inputMode="decimal" dir="ltr" value={serviceForm.price_from}
                  onChange={(e) => setServiceForm({ ...serviceForm, price_from: e.target.value })}
                  placeholder="Empty = Contact for a quote"
                  className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:border-border" />
              </div>
              <div>
                <label htmlFor="service-currency" className="block text-sm font-medium text-primary-700 mb-1 dark:text-text-primary">Currency</label>
                <select id="service-currency" value={serviceForm.currency} onChange={(e) => setServiceForm({ ...serviceForm, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:border-border">
                  <option value="EGP">EGP</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            {serviceForm.price_from !== '' && (
              <BilingualField label="Price note" hint="e.g. per page, per month" maxLength={120} value={serviceForm.price_note} valueAr={serviceForm.price_note_ar}
                onChange={(v) => setServiceForm({ ...serviceForm, price_note: v })} onChangeAr={(v) => setServiceForm({ ...serviceForm, price_note_ar: v })} />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="service-icon" className="block text-sm font-medium text-primary-700 mb-1 dark:text-text-primary">Icon</label>
                <select id="service-icon" value={serviceForm.icon} onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:border-border">
                  {ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-text-primary pb-2 cursor-pointer">
                <input type="checkbox" checked={serviceForm.published} onChange={(e) => setServiceForm({ ...serviceForm, published: e.target.checked })} className="h-4 w-4 rounded border-primary-300 text-accent focus:ring-accent" />
                Published (visible on the site)
              </label>
            </div>
          </div>
        )}
      </Modal>

      {/* FAQ modal */}
      <Modal
        isOpen={Boolean(faqForm)}
        onClose={() => setFaqForm(null)}
        size="xl"
        title={faqForm?.id ? 'Edit Question' : 'Add Question'}
        footer={
          <>
            <button type="button" onClick={() => setFaqForm(null)} className="flex-1 px-4 py-2 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors dark:border-border dark:text-text-primary dark:hover:bg-surface-elevated">Cancel</button>
            <button type="button" onClick={saveFaq} disabled={saving} className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-60">{saving ? 'Saving…' : faqForm?.id ? 'Update' : 'Add'}</button>
          </>
        }
      >
        {faqForm && (
          <div className="space-y-5" data-faq-form>
            {formError && <p className="text-sm text-error" role="alert">{formError}</p>}
            <BilingualField label="Question" required maxLength={300} value={faqForm.question} valueAr={faqForm.question_ar}
              onChange={(v) => setFaqForm({ ...faqForm, question: v })} onChangeAr={(v) => setFaqForm({ ...faqForm, question_ar: v })} />
            <BilingualField label="Answer" required multiline rows={6} maxLength={3000} value={faqForm.answer} valueAr={faqForm.answer_ar}
              onChange={(v) => setFaqForm({ ...faqForm, answer: v })} onChangeAr={(v) => setFaqForm({ ...faqForm, answer_ar: v })} />
            <label className="flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-text-primary cursor-pointer">
              <input type="checkbox" checked={faqForm.published} onChange={(e) => setFaqForm({ ...faqForm, published: e.target.checked })} className="h-4 w-4 rounded border-primary-300 text-accent focus:ring-accent" />
              Published (visible on the site)
            </label>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServicesManager;
