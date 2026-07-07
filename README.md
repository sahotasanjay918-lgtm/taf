# TAF — Hnefetafl (Viking Chess)

This is the codebase for your Hnefetafl web app. This file explains, in plain
English, what everything does — you should be able to read this without any
coding background.

## What's in this project so far

**Step 1 — Foundation:** the empty scaffolding (routing, fonts, colours).

**Step 2 — Game engine:** the fully tested "rules brain" (see below).

**Step 3 — Home page (just added):** the real, working landing page, plus
three reusable building blocks that every other page will use too.

### New reusable components (inside `src/components/`)

| File | What it does |
|---|---|
| `Board.tsx` | Draws an 11×11 board from any board state — reused for the real game, tutorial diagrams, and page previews. Purely visual, no rules logic. |
| `Button.tsx` | The two button styles from Figma: solid (main actions) and outline (secondary actions). |
| `NavBar.tsx` | The logo + hamburger menu shown on every page, with the site links (Home, Play, About, Contact). "Tutorial" opens the tutorial popup rather than going to a page — see note below. |

### A design decision worth knowing about

Your acceptance criteria describe the tutorial as a set of popups, not a
page of its own — so clicking "Tutorial" (from the Home page, the menu,
or later the Game page) opens a popup overlay on top of whatever page
you're already on, rather than navigating anywhere. To make that work
from multiple places at once, I added one small shared "memory" file:
`src/store/uiStore.ts`, which just tracks whether the tutorial is
currently open. The actual tutorial popup content comes in a later step.

**Step 4 — Pick a Side + pre-game popups (just added):** the screen between
Home and the actual game, plus the difficulty-selection popup.

### New components (inside `src/components/`)

| File | What it does |
|---|---|
| `Popup.tsx` | The shared dark-panel popup shell with an X close button — every popup in the app (pre-game, win/lose, tutorial) will build on this one component. |
| `DifficultySelector.tsx` | The Easy/Hard checkboxes — styled as checkboxes, but only one can be active at a time (confirmed with you). |
| `PreGamePopup.tsx` | The "Attack the King!" / "Defend the King!" popup — one component handles both, since they only differ in title, board preview, and which side you're playing. |

### New page

| File | What it does |
|---|---|
| `PickASide.tsx` | Shows the full board + Attacker/Defender buttons. Picking one opens the matching pre-game popup. Picking a difficulty and clicking "Start game" saves both choices and takes you to `/game`. |

### New shared state

| File | What it does |
|---|---|
| `store/gameSetupStore.ts` | Remembers which side you picked and which difficulty, so that information survives the trip from the Pick a Side page over to the Game page. |

**Note:** the game-start sound effect isn't wired in yet — that's marked
with a `TODO` comment in `PickASide.tsx` and will be connected once we
get to the dedicated sounds step, so all sound effects can be handled
consistently in one pass rather than piecemeal.

**Step 5 — The Game page (just added):** the real, playable board — this
is the big one. Clicking pieces, seeing legal moves, making moves,
playing against the AI, resigning, restarting, and the win/lose popup
all work end to end now.

### The AI opponent (`src/game/ai.ts`)

| Difficulty | How it decides |
|---|---|
| Easy | Picks a completely random legal move. Deliberately weak — good for learning the rules. |
| Hard | Looks 2 moves ahead (its move, then your best reply) and picks whichever move leaves it in the strongest position. It values capturing pieces highly, and for the attacker, values keeping the king far from the corners. |

This is tested the same way the rules were — `ai.test.ts` proves the AI
always plays a legal move, and that it actually takes a free capture when
one's available rather than doing something careless.

**A performance note, told straight:** on the very first move of a game
(the busiest possible board, 24 attackers), the "Hard" AI takes
roughly 0.8 seconds to think. That's fine for a turn-based game, but
if it ever feels sluggish once you're playing on a real device, this
is the first place to optimise (e.g. lowering the lookahead depth, or
running it off the main thread) — flagging now so it's a known lever,
not a surprise later.

### New pieces (inside `src/components/` and `src/store/`)

| File | What it does |
|---|---|
| `InGameMenu.tsx` | The hamburger menu shown only during a game: Tutorial, Restart, Sound toggle, Resign — deliberately a separate component from the site-wide `NavBar.tsx`, since the contents genuinely differ. |
| `ResultPopup.tsx` | The "You win!" / "You lost" popup, with Home and Play Again. |
| `store/gameStore.ts` | The live game itself — current board, whose turn it is, selecting pieces, making moves, resigning, and triggering the AI's move automatically when it's its turn. Everything the Game page shows comes from here. |

### A couple of small decisions made along the way

- While it's the AI's turn, the board is quietly disabled (no "thinking…"
  message), per what we agreed. There's a short pause (under half a
  second) before the AI moves just so it doesn't feel instant/jarring.
- If someone reaches the `/game` page directly without picking a side
  first (e.g. typing the address by hand), they're redirected back to
  Pick a Side rather than the app breaking.

**Step 6 — Tutorial, About, and Contact (just added):** the last 3 pieces
of content, completing every screen in your original designs.

### Tutorial popups (`components/TutorialPopups.tsx`)

All 6 steps from your rules doc, wired to the shared open/close state
built earlier — so it opens correctly whether triggered from the Home
page, the Game page, or either menu. Navigation follows your acceptance
criteria exactly: Back on step 1 closes it, Next moves forward, and the
last step shows "Done" instead of "Next".

Two new small visual-only components support this:
- `MovementDiagram.tsx` — the arrows-from-a-centre-dot illustration
- A few small "demo board" helpers in `game/board.ts` (e.g. a king
  surrounded by 4 attackers, a capture in progress) — these are just for
  illustration, not real game positions, so they're kept clearly separate
  from the real starting layout.

### About page

Copy taken directly from your Figma design — if you ever want to change
the wording, it's all in one place in `pages/About.tsx`, nothing else
needs touching.

### Contact page — one setup step needed from you

The form is wired up to send email via **Formspree** (as agreed), but it
needs one piece of information from you before it'll actually work: a
free Formspree account and form ID. Until that's added, the form will
show an error message rather than pretending to succeed. This is called
out clearly in the code and will be one step in the non-technical setup
guide — you won't need to touch any code to do it, just paste a link.

**Step 7 — Sound effects (just added):** piece selection, game start, win,
and lose sounds, all hooked up.

### An honest constraint, and how I worked around it

You asked for free placeholder sound effects. The environment I'm
building in can only reach code-package websites (for installing
libraries), not general sound-effect sites — so downloading real audio
files wasn't possible here. Rather than leave this blocked, I generated
the 4 sound effects directly in code using the browser's built-in audio
engine (`src/hooks/sounds.ts`) — they're short musical tones, not
recordings. Zero licensing concern since nothing was downloaded, but
they won't sound as polished as a proper sound designer's work.

**If you'd like real sound effects later:** find or buy some (there are
some good free options — I'm happy to point you toward the audio
platforms once we're not sandboxed to this coding step), drop the files
into `src/assets/sounds/`, and I'll swap the inside of `playSound()` to
play those files instead. Every other part of the app just calls
`playSound('win')` etc. without knowing how the sound is actually made,
so this swap will be small and safe whenever you're ready.

### Where each sound is wired up

| Sound | Triggered when | Wired in |
|---|---|---|
| `select` | You pick up one of your own pieces | `store/gameStore.ts` |
| `gameStart` | Clicking "Start game" on the pre-game popup | `pages/PickASide.tsx` |
| `win` | The game ends and you won | `pages/Game.tsx` |
| `lose` | The game ends and you lost (including resigning) | `pages/Game.tsx` |

The Sound On/Off toggle in the in-game menu (built a couple of steps ago)
already controls all of these — turning it off silences every sound
effect immediately, no page reload needed.

**Step 8 — Analytics (just added):** usage tracking via Google Analytics
(GA4) — the actual reason you wanted this whole project trackable.

### One setup step needed from you (same pattern as Formspree)

Analytics is wired up against a **placeholder** Measurement ID in
`index.html`. Until you swap it for a real one, the tracking code runs
but nothing is actually recorded anywhere — it's a safe no-op, not a
broken feature. Getting a real ID just means:
1. A free account at https://analytics.google.com
2. Creating a GA4 property for this site
3. Copying the Measurement ID (starts with "G-")
4. Pasting it into the 2 spots marked in `index.html`

This is a non-technical, copy-paste step — covered in the setup guide.

### What's being tracked, and why each one matters for you as a PM

| Event | Fires when | Useful for |
|---|---|---|
| `page_view` | Any page changes (automatic) | Basic traffic, drop-off between steps |
| `play_now_click` | Home page "Play Now" | Home page → funnel conversion |
| `side_selected` | Picking Attacker or Defender | Which side is more popular |
| `game_started` | Clicking "Start game" (with side + difficulty) | Difficulty preference, funnel completion |
| `game_ended` | A game finishes (with result, reason, side, difficulty) | Win rates by difficulty — great for balancing the AI later |
| `tutorial_opened` / `tutorial_closed` | Opening/closing the tutorial (with step reached + whether completed) | Where people actually give up in the tutorial — a classic UX metric |
| `sound_toggled` | Turning sound on/off | Whether the sound effects are even wanted |
| `contact_form_submitted` | A message successfully sends | Feedback volume |

All of this lives in one small file, `src/hooks/analytics.ts` — every
other file just calls `trackEvent('something_happened')` without knowing
GA4 is even involved, so swapping to Mixpanel or anything else later
would only mean editing this one file.

### How to check my work

```
npm test          # 16 automated rule checks
npm run build      # confirms the whole app compiles with no errors
```

Both pass as of this step.

## Folder structure

```
hnefetafl/
├── index.html              The single HTML page the whole app lives inside.
│                            Also where the two fonts (Caesar Dressing,
│                            Alegreya Sans SC) are loaded from Google Fonts.
│
├── src/
│   ├── main.tsx             The very first file that runs. Starts up React
│   │                        and loads the global styles.
│   │
│   ├── App.tsx               The "signpost" — decides which page to show
│   │                        based on the web address (URL). E.g. going to
│   │                        yoursite.com/about shows the About page.
│   │
│   ├── index.css             Global styles that apply to the whole site
│   │                        (background colour, default fonts).
│   │
│   ├── styles/
│   │   └── theme.css         THE MOST IMPORTANT FILE FOR YOU
│   │                        Every colour, font, and spacing value used
│   │                        anywhere on the site lives here as a single
│   │                        list. Want to change a colour site-wide?
│   │                        Change it once here.
│   │
│   ├── pages/                 One file per page/screen of the site:
│   │   ├── Home.tsx            The homepage
│   │   ├── PickASide.tsx       "Pick a side to play" screen
│   │   ├── Game.tsx            The actual game board screen
│   │   ├── About.tsx           The About page
│   │   └── Contact.tsx         The Contact page
│   │   (Currently these are empty placeholders — each gets built out
│   │    in its own step)
│   │
│   ├── components/            Reusable pieces used across multiple pages
│   │                        (buttons, popups, the board itself, menu, etc)
│   │                        — to be added as we build each page.
│   │
│   ├── game/                  The Hnefetafl game engine — the "rules brain"
│   │                        that knows how pieces move, what counts as a
│   │                        capture, and who has won. This is separate
│   │                        from the visuals on purpose, so the rules can
│   │                        be tested independently of how they look.
│   │
│   ├── store/                 App-wide "memory" (e.g. whose turn it is,
│   │                        what difficulty was picked) — built with a
│   │                        small library called Zustand.
│   │
│   ├── hooks/                  Small reusable bits of logic (e.g. sound
│   │                        playback) shared across components.
│   │
│   └── assets/
│       ├── sounds/            Sound effect files
│       └── images/            Images/icons not made directly in code
```

## How to run this on your own computer (for later, once you're ready)

You won't need to do this yet — I'll be giving you step-by-step
non-technical setup instructions separately once the app is further along.
This section is just here for reference.

```
npm install       # installs all the required packages
npm run dev        # starts a local preview of the site
npm run build       # builds the production-ready version
```

## What's next

Everything from your original brief is now built: every page, the full
rules engine, the AI, sounds, and analytics. The only thing left is the
**non-technical, step-by-step guide** for actually getting this live on
the internet — accounts to create, the two placeholder values to swap
in (Formspree + GA4), and how staging/production hosting will work.
