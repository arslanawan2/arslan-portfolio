# Arslan Awan — Portfolio

Personal portfolio for **Arslan Awan**, Frontend Engineer (Angular) based in Islamabad, Pakistan.

Built with Angular 19 using standalone components, Signals and deferrable views — the same stack the
site is describing.

---

## Highlights

| Area | What's there |
| --- | --- |
| **Theming** | Full light + dark palettes, driven by CSS custom properties. Follows the OS by default, remembers an explicit choice, and applies the theme before first paint so there's no flash. |
| **Motion** | Scroll reveals, 3D pointer tilt with a cursor spotlight, animated counters, a role rotator, a drifting gradient backdrop and a tech marquee — all transform/opacity only, so they stay on the compositor. |
| **Performance** | Below-the-fold sections are `@defer`-ed into their own chunks. Scroll and pointer listeners run outside `NgZone`. Every component is `OnPush`. |
| **Accessibility** | Skip link, visible focus rings, live regions, `aria-current` on the active nav item, and a full `prefers-reduced-motion` opt-out. |
| **SEO** | Descriptive title/meta, Open Graph tags and JSON-LD `Person` structured data. |

Initial bundle: **~69 kB gzipped**, with five lazily-loaded section chunks.

---

## Running it

This machine's global `npm` install is damaged (`minizlib` is missing its nested `minipass`), so the
project uses **pnpm via corepack**:

```bash
corepack pnpm install
corepack pnpm start          # dev server on http://localhost:4200
corepack pnpm run build      # production build into dist/
corepack pnpm test           # unit tests
```

If `npm` is repaired later, the plain `npm` equivalents work unchanged.

> Node 18.19.1 is what's installed here, which caps the project at Angular 19.
> Angular 20 requires Node 20.19+.

---

## Structure

```
src/
├─ styles/
│  ├─ _tokens.scss        Light + dark design tokens (colors, type, motion)
│  ├─ _mixins.scss        container, glass, gradient-text, focus-ring
│  └─ _animations.scss    Keyframes + the scroll-reveal system
├─ app/
│  ├─ core/
│  │  ├─ data/            All CV content, typed — edit here to update the site
│  │  ├─ models/          Interfaces for that content
│  │  ├─ services/        ThemeService (signals), ScrollService (spy + progress)
│  │  ├─ directives/      appReveal, appTilt, appCountUp
│  │  └─ pipes/           emphasize — highlights metrics inside bullets
│  ├─ shared/             icon, ambient backdrop, section-heading
│  └─ sections/           navbar, hero, about, experience, skills,
│                         achievements, contact, footer
└─ index.html             No-flash theme script, fonts, JSON-LD
```

### Updating content

All copy lives in [`src/app/core/data/portfolio.data.ts`](src/app/core/data/portfolio.data.ts).
Templates read from it, so changing a job bullet or adding a skill never means touching markup.

---

## Deployment

Live at **https://arslanawan2.github.io/arslan-portfolio/**

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): install →
unit tests → production build → publish to GitHub Pages. A failing test stops the deploy, so `main`
can't go live broken.

`.github/workflows/ci.yml` runs the same build and tests on `develop`, on `feature/**` pushes, and on
pull requests — so problems surface before they reach `main`.

### One-time setup

In the repo: **Settings → Pages → Build and deployment → Source: _GitHub Actions_**.
(Pages on a private repo needs a paid plan; public repos are free.)

### If you rename the repo or add a custom domain

The build passes `--base-href /arslan-portfolio/`, which must match the path the site is served
from. Update it in **both** workflows if that changes:

- repo renamed → `--base-href /<new-repo-name>/`
- `arslanawan2.github.io` repo, or a custom domain → `--base-href /`

The workflow also copies `index.html` to `404.html` so deep links survive a refresh — GitHub Pages
has no SPA rewrite rule, so without it `/arslan-portfolio/#contact` reloads into a 404.

## Branches

| Branch | Purpose |
| --- | --- |
| `main` | Production — every push deploys to GitHub Pages. |
| `develop` | Integration branch. |
| `feature/*` | Cut from `develop`, merged back into it. |
