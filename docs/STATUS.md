# Project Status & Handoff

**Last updated:** 2026-06-20. Read this to pick up the work. For *how the
codebase works* see [`/CLAUDE.md`](../CLAUDE.md); for *strategy* see
[`ROADMAP.md`](./ROADMAP.md); for *getting traffic* see
[`DISTRIBUTION.md`](./DISTRIBUTION.md) + [`LAUNCH-KIT.md`](./LAUNCH-KIT.md).

---

## 1. Current state (snapshot)

- **~752 pages**, static Astro on Cloudflare Pages. Build is green:
  `npm run build` (astro + postbuild + verify-build + check-links) passes,
  `npm run typecheck` = 0 errors, **0 broken internal links, 0 orphan
  pages, 0 thin (<200-word) pages, 0 heading-skips, clean metadata/a11y**.
- **CI gate** runs build+typecheck+link-check on every PR
  (`.github/workflows/ci.yml`).
- The site is feature-complete, visually consistent (global design
  system), privacy-compliant (Consent Mode v2, self-hosted fonts), and
  measurable (GA4 wired to the owner's property `G-1K9JZ9ZQ2L`).

**The one thing that matters now: TRAFFIC.** Search Console showed ~3
clicks / 3 months. The build is done for this stage; the constraint is
off-page (distribution + authority) and turning on the dormant
monetization. See §3.

---

## 2. What's been shipped (this engagement)

**Tools:** `/keyer/` (send trainer, adaptive decode), `/daily/`
(Wordle-style game), `/morse-bracelet/` (visual generator, PNG/SVG),
`/worksheets/` (printable generator). Plus the pre-existing translator,
decoder, practice, flashcards, random-cw, timing-calculator, chart,
cheat-sheet, embed, API.

**Content / SEO:** names-in-Morse cluster (~210 pages) + `/names-in-morse-code/`
hub; gift/phrase cluster; per-page letter-breakdowns on all
`-in-morse-code` pages; `/translate/` deepened (FAQ + internal links);
all 13 original blog posts enriched to ≥595 words with FAQs + funnel
links; **3 new Track-B funnel posts** (bracelet ideas, tattoo ideas,
kids' activities) → 16 posts total; titles trimmed for SERP; 39 orphans
fixed; duplicate punctuation aliases removed.

**i18n:** Spanish `/es/`, `/es/traductor/`, `/es/alfabeto-morse/` with
reciprocal hreflang (path-based).

**Monetization (built, mostly dormant — see §3):** `/gear/` affiliate hub
+ 3 buying guides; bracelet/jewelry affiliate; `/printables/` **free**
lead-magnet (newsletter capture); `/cw-audio-course/` sales page + a
generator (`npm run course`) for the one genuinely paid product; GA4
`mcgEvent` + `affiliate_click` tracking; Consent Mode v2.

**Infra/quality:** CI gate; self-hosted fonts; global design-system CSS
(fixed a site-wide consistency bug); button system unified; accessibility
(headings, labels) clean; env-configurable GA4/AdSense/Gumroad/donate.

**Docs:** CLAUDE.md, ROADMAP.md, DISTRIBUTION.md, LAUNCH-KIT.md, this file.

---

## 3. ⛔ Owner-action blockers (not code — highest value, do these first)

These unlock everything already built. An agent CANNOT do them (they need
the owner's accounts):

1. **Set Cloudflare Pages env vars.** `AMAZON_ASSOC_TAG` (affiliate links
   earn $0 without it), `ADSENSE_SLOT_ARTICLE/_GLOSSARY/_FAQ`,
   `NEWSLETTER_ACTION` (+`NEWSLETTER_FIELD`) — the email list is the most
   durable asset — `GOOGLE_SITE_VERIFICATION`/`BING_SITE_VERIFICATION`.
   (`DONATE_URL` defaults to the owner's Ko-fi; `GA4_ID` already theirs.)
2. **Run a distribution wave** from `LAUNCH-KIT.md` (no social accounts yet,
   so: DXZone + directory submits + email outreach to CW resource pages
   now; age Reddit/PH/HN accounts ~3 weeks, then post the drafts in
   `DISTRIBUTION.md`).
3. **Ship the paid product:** the audio course was **generated and handed
   to the owner** (`morse-code-koch-audio-course.zip`, 39 MP3 lessons +
   answer keys). Owner just uploads it to Gumroad → sets `GUMROAD_URL`/
   `PRODUCT_PRICE`. Regenerate anytime: `npm run course` (MP3 by default).
4. **GSC:** confirm sitemap submitted; Request Indexing on `/`,
   `/translate/`, `/keyer/`, `/morse-bracelet/`. Re-check in 3–4 weeks.

---

## 4. Ranked backlog for agents (code/content)

Ranked by value. **Do not add thin programmatic pages** — that hurt
indexing before; deepen/enrich instead. Visual changes: push to the
branch and have the owner review the Cloudflare preview before merge.

1. ✅ **DONE — Track B funnel blog posts**: bracelet ideas, tattoo ideas,
   and kids' games are live (PRs #81–#83), each routing into a tool/product.
2. **Spanish expansion**, then French: localize the gift/phrase + key
   reference pages (reciprocal hreflang, native-quality copy only). Biggest
   cheap-traffic lever; non-English competition is weak.
3. **Data-driven content loop:** once GSC has data, mine queries the site
   ranks #8–20 for and write/deepen toward them. Let data pick, not hunches.
4. **Newsletter automation** (RSS→email via the ESP) once
   `NEWSLETTER_ACTION` is set.
5. **Social/Pinterest automation:** auto-generate a daily "letter/Q-code of
   the day" image (reuse the resvg OG pipeline) for Pinterest/X — strong
   for the bracelet/tattoo audience.
6. **Retention features:** streaks/leaderboard polish on `/daily/`; keyer
   upgrades (real key via mic, iambic mode).
7. **Premium "Pro" web tier** (auth + Stripe: progress sync, custom drills,
   ad-free) — LARGE; only after the email list + traffic prove demand.

Deliberately NOT doing: FAQ rich-result schema (Google deprecated it for
non-gov/health sites in 2023); a paid PDF of free content (we removed it).

---

## 5. How to continue safely

- Branch: `claude/beautiful-brahmagupta-1z0ely`. Commit as
  `noreply@anthropic.com` / `Claude` with `--reset-author`. **Don't use
  backticks in `git commit -m`** (bash eats them — use `-F file`).
- Before committing: `npm run build` + `npm run typecheck` must be green.
- Adding a page? Follow the **wiring checklist in CLAUDE.md §4** (nav,
  footer, homepage card, og-pages, url-sources, llms.txt, cross-links).
- Visual changes: the agent can't see rendering — push to branch, share the
  Cloudflare **preview URL**, get owner sign-off before merge. Semantic/
  content-only changes can merge on green CI.
- The recurring stop-hook "Unverified" warning is about GitHub's own merge
  commits (`noreply@github.com`) — expected; never rewrite merged `main`.

---

## 6. Honest owner take

The product is, at this point, better-built than ~all of its competitors:
deep toolset, clean SEO, privacy-first, fast, accessible, self-documented.
**That is no longer the bottleneck.** A site with this much surface area
and ~0 traffic is gated on *distribution and authority*, which is human/
account work the owner must drive. The highest-leverage next move is not
another feature or page — it's §3 (env vars + distribution + product
upload) and then letting real Search Console data direct content. Build
less; distribute more; measure; then double down on what moves.
