# CLAUDE.md — MorseCodeGenerator.com

Guidance for AI agents (and humans) working in this repo. Read this first.

---

## 1. What this is

**MorseCodeGenerator.com** — a static, no-backend website that aims to be
*the hub of Morse code*: a text⇄Morse translator, learning tools, full
reference, and an emerging monetization layer (ads, affiliate, products).

- **Framework:** Astro v4, `output: "static"`, `trailingSlash: "always"`,
  `build.format: "directory"` (every route → `dist/<route>/index.html`).
- **No runtime, no DB, no auth.** All interactivity is vanilla JS in
  `is:inline` `<script>` blocks or `/public/*.js`. Ships as plain HTML/CSS/JS.
- **Host:** Cloudflare Pages. Pushing to `main` deploys; PRs get preview
  deploys. `_headers` and `_redirects` in `public/` are Cloudflare-specific.
- **Scale:** ~720 pages, most generated from data files (programmatic SEO).

The grand vision and full growth plan live in **`docs/ROADMAP.md`** — read it
for strategy (monetization tiers, SEO levers, feature priorities).

---

## 2. Commands

```bash
npm ci                 # install (Node >= 18.17)
npm run dev            # local dev server
npm run build          # FULL build + all postbuild steps + verification
npm run typecheck      # astro check (must be 0 errors before shipping)
npm run verify         # verify-build.mjs + check-links.mjs (against dist/)
```

`npm run build` runs this pipeline (each step must pass):

1. `astro build` → `dist/`
2. `postbuild-glossary-links.mjs` — auto-links glossary terms
3. `postbuild-sitemap.mjs` — generates `sitemap.xml` (walks `dist/`, lastmod
   via `scripts/url-sources.mjs`)
4. `postbuild-news-sitemap.mjs` — news sitemap for recent blog posts
5. `postbuild-og.mjs` — renders per-page OG PNGs (resvg) for pages in
   `OG_PAGES` (see `src/data/og-pages.js`)
6. `verify-build.mjs` — asserts required pages, canonicals, `<h1>`s,
   robots/sitemap/redirects sanity
7. `check-links.mjs` — fails the build on any broken internal link
8. `indexnow-ping.mjs` — pings IndexNow (only on Cloudflare `main` builds, or
   with `INDEXNOW_FORCE=1`)

**Always run `npm run build` and `npm run typecheck` before committing.** A
green build = 0 verify failures, 0 broken links, 0 type errors.

---

## 3. Architecture & conventions

### Layout component (`src/components/Layout.astro`)
Every page wraps `<Layout>`. Key props:

| Prop | Purpose |
|---|---|
| `title`, `description`, `keywords` | `<head>` meta |
| `canonical` | absolute canonical URL (always set it) |
| `robots` | default `"index,follow"`; use `"noindex,follow"` for non-canonical |
| `ogType`, `publishedTime`, `modifiedTime` | OG/article meta |
| `prevUrl`, `nextUrl` | pagination rel links |
| `lang` | force document language (e.g. `"es"`) → `<html lang>`, `og:locale` |
| `alternates` | `[{lang,href}, …]` → reciprocal hreflang (see i18n below) |

Layout also injects: the JSON-LD Organization/WebSite/SoftwareApplication
graph, consent-gated GA4 + AdSense loader, the `mcgEvent` analytics helper,
service-worker registration, header nav, and the mega footer.

### Page conventions (match existing pages)
- Frontmatter computes `site`, `canonical`, a `crumbs` array, and a `jsonLd`
  `@graph` (BreadcrumbList + a page-type node). Emit JSON-LD via
  `<script type="application/ld+json" set:html={JSON.stringify(jsonLd)}>` —
  Layout does the Organization graph; pages add their own.
- Hero pattern: `.page-hero` > `.page-hero-kicker` + `.page-hero-title` +
  `.muted.page-hero-sub` + optional `.page-hero-actions`.
- Use existing CSS custom props (`--s-*` spacing, `--fs-*` font sizes,
  `--line`, `--surface-2`, `--text-muted`, `--r-*` radii, `--font-mono`,
  `--content` max-width). Don't invent a design system; reuse tokens.
- Interactive JS goes in `<script is:inline define:vars={{…}}>` so build-time
  data (e.g. the morse map) is passed in. Keep it dependency-free.

### Data-driven pages
Reference/SEO pages render from `src/data/`:

| File | Drives |
|---|---|
| `morse.json` | canonical char map + phrases (also served at `/morse.json`) |
| `seo-slugs.json` | `/{slug}-in-morse-code/` word pages |
| `names.js` | `/{name}-in-morse-code/` name pages + `/names-in-morse-code/` hub |
| `daily-words.js` | `/daily/` puzzle word list + epoch |
| `gear.js` | `/gear/*` buying guides + `amazonSearch()` affiliate helper |
| `blog-posts.js` + `blog-bodies.js` | `/blog/*` |
| `q-codes.js`, `cw-abbreviations.js`, `prosigns.js`, `mnemonics.js` | reference hubs + detail pages |
| `og-pages.js` | which pages get a custom OG PNG + the section kicker |

---

## 4. ⚠️ Wiring checklist — when you ADD A PAGE

A new page is not "done" until it's discoverable. For a new tool/hub page,
update **all** of these (grep an existing recent page like `daily.astro` or
`keyer.astro` to see every touchpoint):

1. **`src/pages/<name>.astro`** — the page itself (Layout, canonical, jsonLd).
2. **`src/components/Layout.astro`** — add to primary nav (if flagship) and/or
   the footer mega-menu (`foot-col` lists). Nav is ~8 items; prefer footer +
   homepage card unless it's a headline tool.
3. **`src/pages/index.astro`** — add a card to the `toolkit` array if it's a
   user-facing tool.
4. **`src/data/og-pages.js`** — add the path to `OG_PAGES` **and** a kicker in
   `OG_KICKER_BY_SECTION` so it gets a social card.
5. **`scripts/url-sources.mjs`** — map the URL → its source files so sitemap
   `lastmod` is correct. **Order matters:** static pages whose URL also
   matches a generic regex (e.g. `/names-in-morse-code/` vs the
   `/<word>-in-morse-code/` rule) must be matched FIRST.
6. **`public/llms.txt`** — add it under the right section (AI discovery).
7. **Cross-link** from related pages (funnel: learning ↔ tools ↔ gear).
8. Sitemap is auto-generated (walks `dist/`), so no manual sitemap edit — but
   `verify-build.mjs` has a hardcoded required-page list; if you add a
   *critical* page, consider adding it there.

Then `npm run build` — `check-links.mjs` will catch any dangling links.

---

## 5. SEO infrastructure (already strong — don't regress it)

- **Canonicals** everywhere; `trailingSlash: "always"` (URLs end in `/`).
- **JSON-LD** graph per page (Breadcrumb + page type). No `aggregateRating`
  unless real on-page reviews exist (Google manual-action risk — see the
  note in `Layout.astro`).
- **hreflang**: reciprocal, via the `alternates` prop. MUST be reciprocal —
  Google ignores one-way hreflang. Verify both sides emit identical sets.
- **Sitemap / news sitemap / RSS / IndexNow** auto-generated on build.
- **OG images**: per-page PNGs for curated `OG_PAGES`; others fall back to
  `/og-image.svg`.
- **AI crawlers**: `robots.txt` allows them; `llms.txt`, `llms-full.txt`,
  `ai.txt` describe the site for LLMs. Keep `llms.txt` updated with new pages.
- **`robots.txt`** disallows `?q=`/`?lang=` variants (non-canonical). Don't
  build indexable query-param pages; use path-based URLs.

---

## 6. Internationalization (i18n)

Model: **path-based localized URLs** (`/es/...`), NOT `?lang=` query params
(those are weak/duplicate for SEO; the legacy `?lang=es` on `/translate/` is
kept only as a fallback).

To add a localized page:
1. Create `src/pages/es/<slug>.astro` with native-quality copy.
2. Pass `lang="es"` and `alternates={[{lang:"en",href:EN_URL},{lang:"es",href:ES_URL}]}`.
3. Add the **same** `alternates` to the EN counterpart page (reciprocity!).
4. Add `/es/<slug>/` to `url-sources.mjs`, `og-pages.js`, `llms.txt`, footer.

Current Spanish set: `/es/`, `/es/traductor/`, `/es/alfabeto-morse/`.
**Quality bar:** ship native-fluent copy, not bulk machine translation —
thin auto-translated pages at scale hurt SEO. One language done well beats
four done poorly.

---

## 7. Monetization & analytics

- **Ads:** `<AdSlot zone="article|glossary|faq" />`. Renders nothing unless
  the matching `ADSENSE_SLOT_*` env var is set. Long-form pages only — never
  inside interactive tools. Consent-gated (loads only after "Accept all").
- **Affiliate:** product links MUST carry `rel="sponsored nofollow noopener"`
  and `data-aff="<id>"`. `data-aff` auto-fires a GA4 `affiliate_click` event
  (delegated listener in Layout). Amazon links via `amazonSearch()` in
  `gear.js` (appends `AMAZON_ASSOC_TAG` when set; plain link otherwise).
  Disclosure page (`/disclosure/`) covers FTC; link to it near affiliate links.
- **Newsletter:** `<Newsletter />` posts to `NEWSLETTER_ACTION`; degrades to a
  mailto link if unset.
- **Donations:** `DONATE_URL` env (falls back to `/disclosure/#support`).
- **Analytics:** call `window.mcgEvent?.("event_name", {…})` from tool JS. It's
  a no-op until the visitor accepts analytics consent (never throws). Existing
  events: `translate`, `play_audio`, `copy_output`, `copy_share_link`,
  `flash_light`, `vibrate`, `download_wav`, `daily_*`, `keyer_*`,
  `bracelet_download`, `affiliate_click`.

**Revenue is dormant until the site owner sets env vars on Cloudflare Pages
(see §8).** The code is ready; the accounts/keys are the owner's job.

---

## 8. Environment variables (set on Cloudflare Pages → build env)

| Var | Effect | Revenue/SEO |
|---|---|---|
| `AMAZON_ASSOC_TAG` | appends affiliate tag to Amazon links | 💰 affiliate |
| `ADSENSE_SLOT_ARTICLE` / `_GLOSSARY` / `_FAQ` | enables ad units | 💰 ads |
| `ADSENSE_CLIENT` | overrides AdSense pub id (has a default) | 💰 ads |
| `NEWSLETTER_ACTION` / `NEWSLETTER_FIELD` | enables signup form | 💰 list |
| `DONATE_URL` | footer "Support" link | 💰 donations |
| `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` | Search Console | 📈 SEO data |
| `YANDEX_VERIFICATION` / `PINTEREST_VERIFICATION` / `FACEBOOK_DOMAIN_VERIFICATION` | platform verification | 📈 |
| `GUMROAD_URL` | `/printables/` buy-button target (default: the Gumroad store) | 💰 product |
| `PRODUCT_PRICE` | price shown on `/printables/` + in Product schema (default `7`) | 💰 product |
| `SITE_URL` | overrides site origin (default morsecodegenerator.com) | build |
| `INDEXNOW_FORCE=1` | force IndexNow ping off-CI | SEO |

None of these are in git — all build-time. Missing var = feature silently
no-ops (never a broken page).

---

## 9. Git workflow & gotchas

- **Branch:** develop on `claude/beautiful-brahmagupta-1z0ely` (current
  working branch). Never push directly to `main` without permission; ship via
  PR. The owner has been merging PRs after review.
- **Commit identity:** set `git config user.email noreply@anthropic.com` and
  `user.name Claude` and `--reset-author` so commits aren't "Unverified".
  Merge commits created by the GitHub UI/API show as `noreply@github.com` and
  will trip the stop-hook check — that's expected for merge commits; do NOT
  rewrite already-merged `main` history to fix them.
- **⚠️ Backticks in commit messages:** `git commit -m "... \`lang\` ..."` —
  bash executes the backticked text and silently drops it. Write multi-line/
  technical commit messages to a file and use `git commit -F file`, or avoid
  backticks. (This bit us once on the Spanish PR.)
- **PR flow:** `git push -u origin <branch>` (retry w/ backoff on network
  fail) → create PR via GitHub MCP tools (`mcp__github__*`, loaded via
  ToolSearch) → the session may auto-subscribe to PR activity. Cloudflare
  posts a preview-deploy comment; the `chatgpt-codex-connector` bot may post a
  usage-limit notice (ignore it). Only create a PR when the user asks.
- **GitHub access:** no `gh` CLI. Use `mcp__github__*` tools. Repo scope is
  `SentioAu/morsecodegenerator`.

---

## 10. Feature inventory (what exists)

**Tools:** `/translate/` (+ WAV download), `/decoder/`, `/practice/` (Koch),
`/flashcards/`, `/random-cw/`, `/keyer/` (send trainer, adaptive decode),
`/daily/` (Wordle-style game, streaks), `/morse-bracelet/` (visual generator,
PNG/SVG), `/worksheets/` (printable generator), `/timing-calculator/`,
`/chart/`, `/cheat-sheet/`, `/embed/`, `/api/` + `/morse.json`.

**Product:** `/printables/` is the sales page for the paid "Morse Code
Starter Pack"; the actual product master is `product/starter-pack.html`
— a self-contained print-to-PDF file kept OUT of `dist/` (not in
`src/pages` or `public/`) so the paid asset isn't given away free. Open
it in a browser → Save as PDF → upload to Gumroad. Buy button + price
are env-driven (`GUMROAD_URL`, `PRODUCT_PRICE`).

**Reference:** `/morse-code/` (A–Z, numbers, punctuation, words),
`/names-in-morse-code/`, `/prosigns/`, `/abbreviations/`, `/q-codes/`,
`/nato/`, `/history/`, `/operating/`, `/teach/`, `/glossary/`, `/faq/`,
`/phrases/`, `/{word|name}-in-morse-code/`.

**Content/biz:** `/blog/`, `/gear/` (+ 3 buying guides), `/sponsor/`,
`/disclosure/`, plus standard about/contact/privacy/terms.

**i18n:** `/es/`, `/es/traductor/`, `/es/alfabeto-morse/`.

---

## 11. Conventions cheat-sheet

- Tone of copy: plain, honest, expert. No hype. Match existing pages.
- Every Morse computation uses `morse.json` as the single source of truth.
- Audio = Web Audio, 600 Hz sine, `unit = 1200/wpm` ms (dit=1u, dah=3u,
  gaps 1u/3u/7u). Reuse this timing everywhere.
- Keep tools fully client-side and privacy-preserving (a selling point).
- When unsure how something is wired, grep a recently-added page
  (`daily.astro`, `keyer.astro`, `morse-bracelet.astro`) — they follow every
  convention in this doc.
