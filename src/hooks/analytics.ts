/**
 * analytics.ts — a small, safe wrapper around Google Analytics.
 *
 * WHY THIS FILE EXISTS: every other part of the app calls
 * trackEvent('something_happened') without knowing or caring how
 * analytics actually works under the hood. That means if you ever
 * switch from GA4 to Mixpanel (or anything else) later, this is
 * the ONLY file that needs to change — nothing else in the app
 * does.
 *
 * SAFE BY DESIGN: if GA hasn't loaded (e.g. an ad-blocker, or the
 * placeholder Measurement ID hasn't been replaced yet — see
 * index.html), these functions quietly do nothing instead of
 * throwing an error and breaking the app.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function isAnalyticsAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/**
 * Records a custom event — use this for anything a real person
 * DID (clicked a button, finished a game, submitted a form).
 * `params` can hold extra detail, e.g. { side: "attacker" }.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (!isAnalyticsAvailable()) return;
  window.gtag!("event", eventName, params);
}

/**
 * Records a page view. Called once per page change — see the
 * PageViewTracker component, mounted once in App.tsx, which calls
 * this automatically whenever the URL changes.
 */
export function trackPageView(path: string): void {
  if (!isAnalyticsAvailable()) return;
  window.gtag!("event", "page_view", { page_path: path });
}
