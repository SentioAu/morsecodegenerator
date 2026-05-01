# Option B Migration Plan (Rebuild as Production Canonical)

## Goal
Move production from Astro to `rebuild/` without losing rankings or conversion traffic.

## Non-Negotiables
1. Preserve all high-traffic legacy URLs using 301 redirects (`rebuild/_redirects`).
2. Keep one canonical sitemap authority (`rebuild/sitemap.xml`).
3. Keep all core routes indexable with canonical + robots meta.
4. Run verification on every deploy (`npm run verify:rebuild`).

## Launch Checklist
- [ ] `npm run build:rebuild` passes.
- [ ] `_redirects` deployed from `rebuild/` root.
- [ ] `robots.txt`, `sitemap.xml`, `llms.txt` deployed and publicly accessible.
- [ ] Top legacy URLs tested for 301 to correct new route (`npm run check:rebuild:redirects`).
- [ ] Search Console property updated with new sitemap.
- [ ] Analytics events confirmed on translator actions.

## Rollout
### Phase 1 (3-7 days)
- Soft launch rebuild on production with full redirect parity.
- Gate each deploy with `npm run verify:rebuild` (includes redirect coverage checks).
- Monitor crawl errors, 404s, and ranking volatility daily.

### Phase 2 (2-4 weeks)
- Tune generated word-page quality by keyword cluster intent.
- Improve internal linking and related-page recommendations.

### Phase 3 (ongoing)
- Expand content automation templates (FAQ blocks, examples, intent-specific snippets).
- Add continuous QA gating in CI for SEO and UX checks (`npm run qa:rebuild:seo`).
- Launch blog automation pipeline with quality gates (`npm run qa:rebuild:blog`).

## Rollback Plan
- Keep previous Astro deployment artifact available.
- If severe traffic drop (>20% for 72h), rollback and fix redirect/canonical mismatches.
