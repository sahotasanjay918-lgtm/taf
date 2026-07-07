/**
 * uiStore.ts — small shared "memory" for UI state that more than
 * one component needs to know about.
 *
 * Right now this just tracks whether the tutorial popup is open,
 * since the tutorial can be triggered from several different
 * places (Home page, Game page, and the site menu) and they all
 * need to open the exact same popup.
 *
 * Built with Zustand — a very small state library. If you're
 * curious: think of this as a shared notice-board that any
 * component can read from or write to, instead of manually
 * passing information down through every page.
 */
import { create } from "zustand";
import { trackEvent } from "../hooks/analytics";

interface UIState {
  isTutorialOpen: boolean;
  openTutorial: () => void;
  closeTutorial: () => void;
  isSoundOn: boolean;
  toggleSound: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isTutorialOpen: false,
  openTutorial: () => {
    trackEvent("tutorial_opened");
    set({ isTutorialOpen: true });
  },
  closeTutorial: () => set({ isTutorialOpen: false }),
  isSoundOn: true,
  toggleSound: () =>
    set((s) => {
      const isSoundOn = !s.isSoundOn;
      trackEvent("sound_toggled", { isSoundOn });
      return { isSoundOn };
    }),
}));
