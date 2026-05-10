# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

"Aprende Inglés" is an offline-first PWA for A1 English learning, built as a low-fidelity prototype for the UNAD *Proyecto de Ingeniería I* course (Etapa 4). All learning logic runs client-side; the server only delivers the static shell. The target user is a rural Colombian student on a low-end Android phone with intermittent connectivity, which drives the strict "no framework, no build step, minimum bytes" stance.

## Commands

### Run locally

The Service Worker requires HTTP (not `file://`):

```bash
cd src && python3 -m http.server 8080
# then open http://localhost:8080
```

### Automated validation + screenshot evidence (Playwright)

```bash
cd tests
npm install                         # first time only
npx playwright install chromium     # first time only
node validate.mjs                   # full evidence run (16 checkpoints)
node responsive.mjs                 # responsive screenshots (multiple viewports)
```

`validate.mjs` requires the dev server running on `localhost:8080`. It writes PNGs to `evidencias/screenshots/` and a markdown report to `evidencias/playwright-report.md`. There is no unit-test runner — these scripts are the test suite.

### Deploy

Pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which uploads `src/` to GitHub Pages. There is no build step; the published site is the contents of `src/` verbatim.

## Architecture

### Single-page shell, four views, no framework

`src/index.html` loads the JS files **as plain `<script>` tags in a deliberate order** (`db.js` → `seed-data.js` → `seed-topics.js` → `leitner.js` → `gamification.js` → `app.js`). They are not ES modules; they communicate through globals (`DB`, `Leitner`, `Gamification`, `SEED_LESSONS`, `SEED_TOPICS`). When adding a new module, register it both in the script order in `index.html` **and** in the `APP_SHELL` array of `src/sw.js` — otherwise the offline cache will miss it.

`app.js` contains a hand-rolled router with four views (`dashboard`, `topic`, `lesson`, `learn`, `profile`) plus connectivity banner logic. There are no route URLs — `navigate(view, params)` swaps the contents of `#app`.

### Persistence: vanilla IndexedDB (no Dexie)

`db.js` deliberately does **not** use Dexie despite what the Etapa 3 group design states; this divergence is intentional and documented in `docs/decisiones-de-diseño.md` §1.2. The `DB` global exposes a Dexie-like async surface. Stores: `lessons`, `topics`, `progress`, `settings`, `achievements`. DB name is `AprendeIngles`, version `2`.

When changing the schema, bump `DB_VERSION` in `db.js` and add a branch inside `onupgradeneeded` — the existing v1→v2 migration (adding the `topicId` index) is the template to follow. Do not drop and recreate stores; users have local progress.

`DB.init()` is idempotent: it re-puts every seed lesson on every load (so editorial fixes propagate) but only creates a `progress` row for lessons without one. Same pattern for topics. This means **editing `seed-data.js` updates content for existing users without resetting their Leitner progress**.

### Leitner engine

`leitner.js` implements 5-box spaced repetition with intervals `[0, 2, 4, 7, 14]` days. `selectNextLesson({ topicId? })` has a non-obvious behavior: with a `topicId` filter, if nothing is due it relaxes the "due" filter and returns the lowest-box exercise so practice-on-demand still works; without a topicId it returns `null`. Preserve this when modifying selection.

`processAnswer(lessonId, isCorrect)` is the only way progress changes — correct answers advance one box (capped at 5), incorrect answers reset to box 1. Always go through it; do not write to the `progress` store directly from views.

### Service Worker (cache-first)

`sw.js` is hand-written (no Workbox, by design). Strategy: cache-first for same-origin GETs, fall back to network, fall back to cached `index.html` for navigation requests. **When you add or rename a shell file, you must also bump `CACHE_VERSION`** — otherwise returning users keep the old cache and never see the new file. The `activate` handler deletes any cache key starting with `aprende-ingles-` that doesn't match the current version.

### Seed content

`seed-data.js` (`SEED_LESSONS`) and `seed-topics.js` (`SEED_TOPICS`) are the entire content corpus — exercises (vocab + grammar) and the theory topics that group them. Each lesson has a `topicId` linking it to a topic. Adding content = appending to these arrays; the seeding logic in `DB.init()` handles the rest.

### Lesson formats (5)

Each lesson carries an optional `format` field. Default `'multiple-choice'`. The renderer in `app.js` dispatches via `renderQuestion`, `bindAnswerHandlers`, `evaluateAnswer`, and `applyAnswerFeedback` — all four must branch on the format when adding a new one.

| `format` | Required fields | Renderer / evaluator |
|---|---|---|
| `'multiple-choice'` (default) | `question`, `options[]`, `correctIndex` | `renderMultipleChoice` / index match |
| `'true-false'` | `statement`, `correctAnswer: boolean` | `renderTrueFalse` / boolean match |
| `'fill-blank'` | `question` (with `___` marking the gap), `acceptedAnswers: string[]` | `renderFillBlank` / `normalizeAnswer()` then `acceptedAnswers.some(...)`. Validation is **tolerant** (lowercase + trim + collapse spaces + strip diacritics). |
| `'word-order'` | `instruction`, `tokens: string[]` (correct order) | `renderWordOrder` (tap-to-add tiles, no drag) / `JSON.stringify` array equality |
| `'matching'` | `instruction`, `pairs: [{en, es}]` (4-6 pairs) | `renderMatching` / `isCorrect = (errors === 0)` — feedback is inline per pair |

All formats funnel through `Leitner.processAnswer(id, isCorrect)` — the Leitner engine is format-agnostic. **Adding a new format requires no DB schema change** (fields are data-level), but you still need to bump `CACHE_VERSION` in `sw.js` because `app.js` and `styles.css` are part of the cached shell.

## Conventions

- All user-facing strings are in Spanish; code comments are in Spanish too. Match this when editing.
- Run any HTML rendered from data through `escapeHtml()` in `app.js` — content comes from IndexedDB but seed strings can contain quotes/apostrophes and we have no template engine.
- No third-party runtime dependencies in `src/`. The `tests/` folder has its own `package.json` for Playwright; that's the only `node_modules` in the repo and it is gitignored.
- The `evidencias/` directory holds generated screenshots and reports for the academic submission — treat it as build output, not source.
