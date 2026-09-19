# SAIT — Students Association of Information Technology

Official website for the Students Association of Information Technology (SAIT), Division of Information Technology, School of Engineering, Cochin University of Science and Technology (CUSAT).

This is a frontend prototype built for the **SAIT Website Redesign Challenge 2026**.

## Live Demos

* **GitHub Pages:** [https://abeezfaulad.github.io/sait-redesign/](https://abeezfaulad.github.io/sait-redesign/)
* **Vercel:** [https://siat-redesign.vercel.app/](https://siat-redesign.vercel.app/)

---

## What's on the Site

| Section | What it does |
| :--- | :--- |
| **Home** | Hero with animated headline, stats, upcoming previews, recent notices, "what we do" grid, "why SAIT" section |
| **About** | Tabbed view — overview, facilities, curriculum, department history timeline |
| **People** | Executive committee, faculty directory, sub-team rosters with search |
| **Events** | Upcoming + archive, category filters, list / calendar view, countdown, bookmarks |
| **Placements** | Placement stats, recruiter directory, career resources |
| **Alumni** | Alumni spotlight with batch filter and search |
| **Achievements** | Hall of fame grouped by year with full-text search |
| **Activity Logger** | Student activity submission, dashboard, leaderboard, CSV export |
| **Notifications** | Read / unread state, expandable notices |
| **Gallery** | Filterable photo grid with keyboard-navigable lightbox |
| **Newsroom** | Short updates from the association, department, and placement cell |
| **FAQ** | Searchable Q&A |
| **Contact** | Validated contact form with direct contact card |

---

## Interactive Features

* **Authentication** — Sign in / sign up modal, persistent user session, profile dropdown in nav
* **Command Palette (`Ctrl` / `Cmd` + `K`)** — Jump to any page, event, person, or action
* **Keyboard Navigation** — `G` + `H`/`A`/`P`/`E`/`L`/`N` for pages, `?` for help, `\` for the dock
* **Floating Control Dock** — Live clock, event rotator, accent colour picker, theme toggle
* **Dark / Light Theme** — Persisted across reloads
* **Five Accent Colours** — Entire site recolours instantly
* **Event Bookmarks** — Save events, persisted locally
* **Two-Step Event Registration** — Validated form with confirmation summary
* **Activity Logger** — Full CRUD, undo, CSV export, leaderboard sorting
* **Gallery Lightbox** — Arrow-key navigation, `Esc` to close
* **Toast Notifications** — With undo actions where applicable
* **Typewriter Headline** — On the home hero
* **Motion Effects** — Scroll reveal, page fade, tilt, ripple, magnetic buttons
* **Visual Polish** — Custom cursor glow, ambient spotlight, constellation canvas, film grain

---

## Tech Stack

* **React 18** with hooks (no class components)
* **Vite 5** for dev server and production build
* **CSS Custom Properties** for theming — no CSS framework
* **localStorage** for persistence — no backend
* **Google Fonts:** *Bricolage Grotesque*, *Inter*, *IBM Plex Mono*
* *No TypeScript, no state library, no router library. Everything is hand-rolled.*

---

## Project Structure

```text
sait-redesign/
├── index.html                 # Entry point & Google Fonts
├── vite.config.js             # Build config, base path, output dir
├── package.json
├── README.md
├── docs/                      # Built site (GitHub Pages serves this)
└── src/
    ├── main.jsx               # React entry point
    ├── App.jsx                # Shell: nav, footer, routing, layout
    ├── styles.css             # All CSS — tokens, layout, components, animations
    ├── data.js                # All content as JS data structures
    ├── sections.jsx           # Home, About, People, Events, Placements,
    │                          # Alumni, Achievements, ActivityLogger, Notifications
    ├── extras.jsx             # FAQ, Gallery, Blog, Contact,
    │                          # useEventCountdown, RegistrationModal
    ├── ui.jsx                 # Section shell, Toast provider, Drawer, Kbd, SearchInput
    ├── fancy.jsx              # CursorGlow, Spotlight, Constellation, Typewriter,
    │                          # MagneticButton, Marquee, Splash, ScrollTop,
    │                          # PageFade, Parallax, useTilt, useScrollReveal
    ├── auth.jsx               # AuthProvider, AuthModal, UserMenu
    ├── panel.jsx              # ThemeProvider, FloatingDock, ScrollProgress,
    │                          # useCounters
    ├── CommandPalette.jsx     # Ctrl+K search modal
    └── hooks.js               # useLocalStorage, useHotkeys, useQueryParam
```

---

## Running Locally

Requires **Node.js 18+** and **npm**.

```bash
# Clone the repository
git clone https://github.com/abeezfaulad/sait-redesign.git

# Navigate into the directory
cd sait-redesign

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Available Scripts

```bash
npm run dev        # Start dev server with hot reload
npm run build      # Build for production into docs/ (or dist/ on Vercel)
npm run preview    # Preview the production build locally
npm run deploy     # Build only — output goes to docs/ and is committed
```

---

## Deployment

Both Vercel and GitHub Pages deploy from the same `main` branch.

### Vercel
Connected directly to the GitHub repo. Any push to `main` triggers an automatic build and deployment. `vite.config.js` detects the Vercel environment and outputs to `dist/` with base path `/`.

### GitHub Pages
Serves static files directly from the `docs/` folder on the `main` branch. `vite.config.js` outputs to `docs/` with base path `/sait-redesign/` when outside Vercel.

To deploy a new change:

```bash
npm run deploy
git add .
git commit -m "Update build"
git push
```

GitHub Pages will automatically pick up the new build within a minute.

---

## Design System

### Colour Tokens
Defined in `:root` of `styles.css`:

| Token | Purpose |
| :--- | :--- |
| `--bg`, `--bg-2` | Page and subtle-section backgrounds |
| `--surface`, `--surface-2` | Card surfaces |
| `--border`, `--border-2` | Dividers and outlines |
| `--text`, `--text-2`, `--text-3` | Text hierarchy |
| `--accent`, `--accent-2` | Brand colour (user-selectable) |
| `--success`, `--warning` | Status indicators |

### Typography
* **Display:** *Bricolage Grotesque* — headlines, numbers, buttons
* **Body:** *Inter* — paragraphs, form fields
* **Mono:** *IBM Plex Mono* — labels, dates, stats, keyboard hints

### Theme & Accent Switching
* **Theme switching:** The `ThemeProvider` in `panel.jsx` sets `document.documentElement.dataset.theme`, which flips CSS variables between `:root` and `html[data-theme="light"]`.
* **Accent switching:** Dynamically updates `--accent`, `--accent-2`, and `--accent-glow` as inline properties on `documentElement`. All components automatically inherit the selected accent.

---

## Accessibility

* All interactive elements are semantic `<button>` or `<a>` tags.
* Modals, drawers, command palette, and lightboxes trap focus and close with `Esc`.
* `prefers-reduced-motion` media query disables animations for users who prefer reduced motion.
* Visible focus indicators across all form inputs and interactive elements.
* `aria-label` attributes present on all icon-only controls.
* Clean semantic heading hierarchy (`h1`–`h6`).

---

## What This Project Is Not

* **Not a real backend:** All data is mock data hardcoded in `src/data.js`.
* **Not a real auth system:** User credentials and sessions stay in `localStorage`; no server authentication is involved.
* **Not integrated with official systems:** Unaffiliated with actual production infrastructure at CUSAT or the IT department.
* *The activity logger, notices, gallery, and login are prototypes meant to demonstrate UI/UX and interaction patterns rather than production behavior.*

---

## Contributors

Built for the **SAIT Website Redesign Challenge**, September 2026.

---

## License

[MIT](LICENSE) — free to use, modify, and learn from.