# TAF — Decisions Log

This file exists so that neither you, a future version of me, nor a
developer you eventually bring in ever has to dig through chat history
to understand *why* something works the way it does. If we make a
non-obvious call, it gets a line here.

Format: **Decision** — reasoning — date/context (roughly, where useful).

---

## Game rules

- **King capture requires exactly 4 surrounding attackers everywhere on
  the board — the edge does NOT count as one of the 4 sides.** Keeps the
  rule perfectly consistent with no special-casing near walls; makes the
  king slightly harder to catch near edges, which fits "defender wins by
  escaping, attacker wins by fully surrounding."
- **Throne and corners are NOT hostile squares** — once empty, they're
  plain normal squares for capture purposes, for both sides.
- **Only the king may ever land on the throne or a corner.** Other
  pieces can pass straight through an empty throne/corner in a single
  move, they just can't stop there.
- **No shieldwall captures** — deliberately excluded to keep the capture
  rule simple (2-piece sandwich only).
- **Threefold repetition → attacker wins** (not an instant win on first
  repeat). Chosen as the fairer, more standard rule.
- **Attacker always moves first.**
- **"No legal moves" loss condition applies to BOTH sides, not just the
  defender**, even though the original acceptance criteria only
  specified the defender case. This was my generalisation, not an
  explicit decision from you — flagged here in case you ever want to
  revisit it. Reasoning: avoids the game ever reaching a stuck state
  with no defined outcome.
- **Standard historical Copenhagen Hnefetafl starting layout** (24
  attackers, 12 defenders, 1 king) — confirmed against your Figma
  diagram pixel-by-pixel.

## Tech stack

- **React + TypeScript + Vite**, not Next.js or plain HTML — TypeScript
  catches rule-related bugs before they reach the browser, which matters
  given the intricate capture/movement rules.
- **CSS Grid/DOM for the board, not Canvas** — far more maintainable,
  accessible, and easier to make responsive than hand-drawn Canvas
  graphics.
- **Zustand for state**, not Redux — small, simple, easy to explain in
  plain English; Redux would be overkill for this size of app.
- **Vercel for hosting**, with `staging` and `main` branches giving free,
  automatic staging + production environments — no extra tooling needed
  beyond what Vercel/GitHub already provide.
- **Formspree for the contact form** (over EmailJS) — simpler integration
  (just a POST endpoint), generous free tier (50 submissions/month).
- **GA4 for analytics** (over Mixpanel) — Mixpanel's free tier has a
  fairly low monthly event cap that a game with lots of click/move
  events could hit quickly; GA4's free tier is effectively unlimited for
  this use case.
- **Minimax with alpha-beta pruning, depth 2, for the AI** ("Hard"
  difficulty) — deep enough to feel competent (takes free captures,
  avoids obviously bad moves) without being slow. "Easy" is a purely
  random legal move — deliberately weak for newer players.
- **No backend/database yet, by design** — see "Future: scaling to paid
  accounts" below. Everything currently lives in the browser and resets
  per session.

## Design system

- **Three distinct font roles**, not one: `--font-hero` (Caesar Dressing,
  used ONLY for the literal "HNEFETAFL" logo lettering — never for
  anything else, since it isn't readable at body-text sizes),
  `--font-heading` (Alegreya Sans SC, every other heading/button/label),
  `--font-body` (regular, non-small-caps Alegreya Sans, for paragraphs —
  small-caps was judged too hard to read at length).
- **All colours/fonts/spacing centralised in `theme.css`** as CSS
  variables specifically so you can restyle the whole site by editing
  one file, without needing to code.
- **Board sizing**: `clamp(320px, 96vw, 600px)` — effectively full-width
  on mobile, capped at 600px (1.5x the original 400px cap) on larger
  screens.
- **Piece design**: recreated exactly from your SVGs (solid colour +
  thin opposite-colour stroke ring; king gets a crown shape instead of a
  letter) — see `components/icons/PieceIcon.tsx`.

## Product/UX decisions

- **Difficulty selectors are styled as checkboxes but behave as radio
  buttons** (mutually exclusive) — visual matches Figma, behaviour
  matches the fact only one difficulty can be active.
- **Tutorial is a global popup, not a page** — it can be triggered from
  Home, the Game page, or either menu, so it's mounted once in `App.tsx`
  rather than living on any one page.
- **The in-game menu (Resign/Tutorial/Restart/Sound) is a SEPARATE
  component from the site-wide nav menu**, even though they look nearly
  identical — their contents are genuinely different, and keeping them
  separate keeps each file simple.
- **AI's turn is silent** — no "thinking..." indicator, board just
  locks. Confirmed explicitly rather than assumed.
- **Resign requires confirmation** ("Are you sure?") — added after your
  design review; resigning is irreversible so it follows the same
  pattern any destructive action should.
- **"No legal moves" and win/lose sound both fire from a single status
  watcher** in `Game.tsx` — covers normal wins/losses AND resigning
  through the same code path, rather than duplicating logic.

## Sound effects

- **Synthesized in code (Web Audio API), not real audio files** — this
  build environment can only reach code-package websites, not
  general sound-effect sites, so real files couldn't be sourced.
  Zero licensing concern since nothing is downloaded, but not as
  polished as real recordings. Swapping in real files later is a
  contained change — see `hooks/sounds.ts`.

## Analytics

- **Everything routes through one file** (`hooks/analytics.ts`) so
  switching analytics providers later (e.g. adding Mixpanel) only means
  editing that one file — nothing else in the app needs to change.
- **Tutorial tracks BOTH open and close-with-step-reached**, not just
  "was it opened" — genuinely useful for spotting where people
  actually give up, not just whether they looked.

## Deployment/workflow

- **Staging + production via Vercel branch deploys**, not a separate
  hosting setup — free, automatic, and needs zero extra tooling.
- **Switched from GitHub's web uploader to GitHub Desktop** after the
  web uploader silently dropped nested folders/files twice — Desktop
  syncs the whole project reliably every time.
- **Formspree and GA4 IDs are placeholders in the code until you
  connect real accounts** — both fail safely (no-op, not a crash) until
  configured; this was a deliberate choice so development could
  continue without blocking on account creation.

## Future: scaling to paid accounts (not yet built)

Discussed but deliberately not built yet, since there's no validated
need for it:
- Accounts/auth + a real database → planned via **Supabase** (free tier
  to start) when/if needed.
- Payments → planned via **Stripe** when/if needed.
- Recommended sequencing: **free accounts first** (to see if people
  actually come back — check GA4 for this before building anything),
  **payments only after that's proven out**. Building either before
  there's evidence of demand was judged premature.

---

*Add to this file whenever we make a decision that isn't obvious from
reading the code alone. Future conversations (with me or anyone else)
should be able to understand the "why" behind TAF without needing this
chat history.*
