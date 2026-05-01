# MorseCodeGenerator.com (Static Astro)


## Fresh-start rebuild (non-Astro)

A full rebuild baseline is available under `freshstart/` using **Python + Flask**.

### Run

```bash
cd freshstart
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Then open `http://127.0.0.1:5000/`.

This new foundation includes:
- clean routing for `/`, `/translate/`, `/phrases/`, `/about/`, `/contact/`
- API endpoint `POST /api/translate`
- reusable base template + shared design system
- theme toggle, share-link copy, and translator interactions


## Static scratch rebuild (framework-free)

A full clean-slate website rebuild is now available in `rebuild/` using plain HTML/CSS/JS.

### Run locally

```bash
cd rebuild
python -m http.server 5500
```

Then open `http://127.0.0.1:5500/`.

This path is ideal for fast design iteration before choosing a long-term framework.


### Content automation (SEO + AI discoverability)

### Blog automation

Generate SEO-focused blog pages and machine-readable blog indexes:

```bash
node scripts/generate-rebuild-blog.mjs
```

This creates:
- `rebuild/blog/index.html`
- `rebuild/blog/*.html`
- `rebuild/blog/blog-index.json`
- `rebuild/blog/rss.xml`


Generate keyword-targeted pages for the rebuild, plus refreshed sitemap and `llms.txt`:

```bash
node scripts/generate-rebuild-seo-content.mjs
```

This reads `src/data/seo-slugs.json` and `src/data/morse.json` to generate:
- `rebuild/words/*.html`
- `rebuild/pages/keywords.html`
- `rebuild/sitemap.xml`
- `rebuild/llms.txt`


## Option B (rebuild as production)

If you choose Option B, use rebuild as canonical deployment artifact and run:

```bash
npm run build:rebuild
```

This will:
- regenerate programmatic SEO pages
- refresh `rebuild/sitemap.xml` and `rebuild/llms.txt`
- run rebuild verification checks (`scripts/verify-rebuild.mjs`)
- validate top legacy redirect coverage (`scripts/check-rebuild-redirects.mjs`)

For redirect-only checks during rollout:

```bash
npm run check:rebuild:redirects
```

For SEO template QA only:

```bash
npm run qa:rebuild:seo
```

For blog automation QA only:

```bash
npm run qa:rebuild:blog
```

Detailed rollout checklist: `docs-migration-option-b.md`.
