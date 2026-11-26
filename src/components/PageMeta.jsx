import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const PageMetaContext = createContext(null);

export function PageMetaProvider({ children }) {
  const [override, setOverride] = useState(null);
  const value = useMemo(() => ({ override, setOverride }), [override]);

  return <PageMetaContext.Provider value={value}>{children}</PageMetaContext.Provider>;
}

export function usePageMetaOverride() {
  return useContext(PageMetaContext);
}

/** Page-specific title, description, image, and structured data. Layout renders the document head. */
export function PageMeta({ page, description, image, jsonLd }) {
  // Depend on the stable state setter, not the context value: the value changes
  // whenever the override does, which would re-run this effect forever.
  const setOverride = usePageMetaOverride()?.setOverride;
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    if (!setOverride) return undefined;
    setOverride({ page, description, image, jsonLd: jsonLdText });
    return () => setOverride(null);
  }, [setOverride, page, description, image, jsonLdText]);

  return null;
}
