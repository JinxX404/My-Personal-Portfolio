import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// Runs before the browser paints the new page, so it never shows for a frame
// at the old scroll position and then jumps. `instant` overrides the site-wide
// `scroll-behavior: smooth`, which otherwise animated every page change from
// the old position (and could be cut short, leaving the new page mid-way).
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
