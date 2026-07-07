/**
 * PageViewTracker.tsx — sends a page-view event every time the
 * visible page changes.
 *
 * This is needed because the app is a "single-page app" — moving
 * between pages doesn't actually reload the browser page, so
 * Google Analytics' automatic page-view tracking never fires
 * again after the very first load. This component watches the
 * URL and tells analytics.ts every time it changes.
 *
 * Renders nothing — mounted once in App.tsx, alongside the
 * tutorial popup, so it's always watching regardless of which
 * page is currently showing.
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../hooks/analytics";

export default function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}
