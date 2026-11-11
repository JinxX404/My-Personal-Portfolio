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

/** Page-specific title, description, and image. Layout renders the document head. */
export function PageMeta({ page, description, image }) {
  const context = usePageMetaOverride();

  useEffect(() => {
    if (!context) return undefined;
    context.setOverride({ page, description, image });
    return () => context.setOverride(null);
  }, [context, page, description, image]);

  return null;
}
