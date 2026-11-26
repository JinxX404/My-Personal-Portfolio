// Link preview images for one project (English and Arabic), drawn in the
// browser and saved to storage. Shown when sharing the project URL on
// WhatsApp, LinkedIn, X, Facebook...
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Icon from 'components/AppIcon';
import { useToast } from 'context/ToastContext';
import { usePortfolioSettings } from 'context/PortfolioSettingsContext';
import { supabase } from 'lib/supabase';
import { firstImageUrl } from 'lib/projectMedia';
import { canvasToBlob, drawShareImage, loadImage, loadShareFonts } from 'lib/shareImage';
import { bucketPathFromUrl, deleteImage, uploadBlob } from 'services/storageService';

const pick = (en, ar, lang) => (lang === 'ar' && typeof ar === 'string' && ar.trim() ? ar : en) || '';

/** True for PostgREST's "column not found" error naming a share_image column (migration 010 missing). */
export const isMissingShareColumn = (error) =>
  /PGRST204|column/i.test(`${error?.code || ''} ${error?.message || ''}`) && /share_image/.test(error?.message || '');

const ShareImagePanel = ({ projectId, formData, setFormData }) => {
  const { success, error: showError, warning } = useToast();
  // Admin pages are English, so this is the stored profile with its *_ar keys.
  const profile = usePortfolioSettings().profile || {};
  const canvases = { en: useRef(null), ar: useRef(null) };
  const [drawing, setDrawing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [needsMigration, setNeedsMigration] = useState(false);

  // Saved image URL only: a just-picked file is not uploaded until the project is saved.
  const cover = firstImageUrl((formData.heroImages || []).filter((img) => !img?.file)) ||
    firstImageUrl((formData.screenshots || []).filter((img) => !img?.file));

  const redraw = useCallback(async () => {
    setDrawing(true);
    await loadShareFonts();
    const image = await loadImage(cover);
    for (const lang of ['en', 'ar']) {
      const canvas = canvases[lang].current;
      if (!canvas) continue;
      drawShareImage(canvas, {
        lang,
        title: pick(formData.title, formData.title_ar, lang),
        description: pick(formData.metaDescription || formData.description, formData.meta_description_ar || formData.description_ar, lang),
        category: formData.category,
        name: pick(profile.full_name, profile.full_name_ar, lang),
        role: pick(profile.title, profile.title_ar, lang),
        image,
      });
    }
    setDrawing(false);
  }, [cover, formData.title, formData.title_ar, formData.description, formData.description_ar, formData.metaDescription,
    formData.meta_description_ar, formData.category, profile.full_name, profile.full_name_ar, profile.title, profile.title_ar]);

  useEffect(() => {
    const timer = setTimeout(redraw, 300);
    return () => clearTimeout(timer);
  }, [redraw]);

  const save = async () => {
    if (!projectId) return;
    setSaving(true);
    try {
      const stamp = Date.now();
      const urls = {};
      for (const lang of ['en', 'ar']) {
        const blob = await canvasToBlob(canvases[lang].current);
        const result = await uploadBlob(blob, `share/${projectId}/${lang}-${stamp}.png`);
        if (!result.success) throw new Error(result.error || 'Upload failed');
        urls[lang] = result.data;
      }
      const { error } = await supabase
        .from('projects')
        .update({ share_image: urls.en, share_image_ar: urls.ar })
        .eq('id', projectId);
      if (error) {
        if (isMissingShareColumn(error)) {
          setNeedsMigration(true);
          warning('Images uploaded, but the database needs migration 010 before they can be used.', 8000);
          return;
        }
        throw error;
      }
      // Remove the previous share images (only files this panel created).
      const old = [formData.shareImage, formData.shareImageAr].map(bucketPathFromUrl).filter((path) => path.startsWith(`share/${projectId}/`));
      old.forEach((path) => deleteImage(path));
      setFormData((prev) => ({ ...prev, shareImage: urls.en, shareImageAr: urls.ar }));
      success('Share images saved. New shares of this project use them.');
    } catch (err) {
      showError(`Could not save the share images: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const download = async (lang) => {
    const blob = await canvasToBlob(canvases[lang].current);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `share-${projectId || 'project'}-${lang}.png`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const saved = Boolean(formData.shareImage || formData.shareImageAr);

  return (
    <div className="bg-white dark:bg-surface rounded-lg p-6 border border-secondary-200 dark:border-border" data-share-image-panel>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-primary-800 dark:text-text-primary flex items-center gap-2">
            <Icon name="Share2" size={18} /> Link preview image
          </h3>
          <p className="text-sm text-secondary-600 dark:text-text-secondary mt-1 max-w-2xl">
            The picture shown when this project&apos;s link is shared (WhatsApp, LinkedIn, X, Facebook). Made from the title,
            summary and cover image, in English and Arabic. Save again after changing them.
          </p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${saved ? 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-text' : 'bg-secondary-100 text-secondary-700 dark:bg-surface-elevated dark:text-muted'}`}>
          {saved ? 'Saved' : 'Not saved yet: the cover image is used'}
        </span>
      </div>

      {needsMigration && (
        <p className="mb-4 rounded-lg border border-warning-300 bg-warning-50 p-3 text-sm text-warning-900 dark:border-warning-800/60 dark:bg-warning-900/20 dark:text-warning" role="status">
          Apply <code>supabase/migrations/010_project_share_images.sql</code>, then save again. Until then link previews use the cover image.
        </p>
      )}

      {!projectId ? (
        <p className="text-sm text-secondary-600 dark:text-text-secondary">Save the project first, then come back here to create its preview images.</p>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {['en', 'ar'].map((lang) => (
              <figure key={lang} className="min-w-0">
                <figcaption className="text-xs font-semibold text-secondary-600 dark:text-text-secondary mb-2 flex items-center justify-between">
                  <span>{lang === 'en' ? 'English (/projects/…)' : 'Arabic (/ar/projects/…)'}</span>
                  <button type="button" onClick={() => download(lang)} disabled={drawing} className="text-accent hover:underline dark:text-accent-text disabled:opacity-50">Download PNG</button>
                </figcaption>
                <canvas
                  ref={canvases[lang]}
                  width={1200}
                  height={630}
                  className="w-full h-auto rounded-lg border border-secondary-200 dark:border-border bg-[#0b1020]"
                  data-share-canvas={lang}
                  aria-label={`${lang === 'en' ? 'English' : 'Arabic'} link preview image`}
                  role="img"
                />
              </figure>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={save} disabled={saving || drawing} className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-60" data-share-save>
              <Icon name="Upload" size={16} />
              {saving ? 'Saving…' : saved ? 'Update preview images' : 'Save preview images'}
            </button>
            {!cover && <span className="text-xs text-secondary-500 dark:text-muted">No saved cover image: the preview uses text only.</span>}
          </div>
        </>
      )}
    </div>
  );
};

export default ShareImagePanel;
