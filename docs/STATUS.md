# Project Status & Handoff

**Last updated:** 2026-06-24. Read this to pick up the work. For *how the
codebase works* see [`/CLAUDE.md`](../CLAUDE.md); for *strategy* see
[`ROADMAP.md`](./ROADMAP.md); for *getting traffic* see
[`DISTRIBUTION.md`](./DISTRIBUTION.md) + [`LAUNCH-KIT.md`](./LAUNCH-KIT.md).

---

## 1. Current state (snapshot)

- **~758 pages**, static Astro on Cloudflare Pages. Build is green:
  `npm run build` (astro + postbuild + verify-build + check-links) passes,
  `npm run typecheck` = 0 errors, **0 broken internal links, 0 orphan
  pages, 0 thin (<200-word) pages, 0 heading-skips, clean metadata/a11y**.
- **CI gate** runs build+typecheck+link-check on every PR
  (`.github/workflows/ci.yml`).
- The site is feature-complete, visually consistent (global design
  system), privacy-compliant (Consent Mode v2, self-hosted fonts), and
  measurable (GA4 wired to the owner's property `G-1K9JZ9ZQ2L`).
- **Search Console + Bing are now verified** (owner confirmed 2026-06-24)
  — so query/coverage data is finally flowing; let it direct content (§4.3).
- **The paid product is LIVE on Gumroad** (2026-06-24): Koch Method CW
  Audio Course at `gumroad.com/l/cw-audio-course`, $12. The `/cw-audio-course/`
  buy button is wired to it (default points at the product permalink).

**The one thing that matters now: TRAFFIC.** Search Console showed ~3
clicks / 3 months. The build is done for this stage; the constraint is
off-page (distribution + authority). Monetization is now partly switched
on (product live; affiliate/newsletter still need env vars). See §3.

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

**i18n:** Spanish `/es/`, `/es/traductor/`, `/es/alfabeto-morse/`, plus
`/es/sos-en-codigo-morse/`, `/es/numeros-en-codigo-morse/`,
`/es/te-amo-en-codigo-morse/` (the last funnels into `/morse-bracelet/`) —
all with reciprocal hreflang (path-based). [+PR #85, 2026-06-24]

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

1. **Set the remaining Cloudflare Pages env vars.** Still unset and earning
   $0: `AMAZON_ASSOC_TAG` (affiliate), `ADSENSE_SLOT_ARTICLE/_GLOSSARY/_FAQ`
   (ads), `NEWSLETTER_ACTION` (+`NEWSLETTER_FIELD`) — the email list is the
   most durable asset. (`DONATE_URL` defaults to the owner's Ko-fi; `GA4_ID`
   already theirs.) ✅ `GOOGLE_SITE_VERIFICATION`/`BING_SITE_VERIFICATION`
   are DONE (GSC + Bing verified 2026-06-24). Optional: `GUMROAD_URL`/
   `PRODUCT_PRICE` (code now defaults to the live product + $12, so only set
   these to override).
2. **Distribution wave — STARTED.** Email outreach (Track A3) **wave #1
   sent 2026-06-24** from `morsecodegenerator@gmail.com` to 7 CW resource
   pages (CWops, Long Island CW Club, Granite State ARA Code Buddies,
   Pottstown ARC, AA9PW, Ham Radio for Non-Techies, Lowell ARC). Still TODO:
   DXZone + directory submits (AlternativeTo/SaaSHub), more outreach
   prospects, and the account-gated channels — age Reddit/PH/HN ~3 weeks,
   then post the ready drafts in `DISTRIBUTION.md`. Re-check GSC → Links in
   3–4 weeks to see which emails became backlinks.
3. ✅ **Paid product SHIPPED & LIVE.** Koch Method CW Audio Course is
   published on Gumroad (`gumroad.com/l/cw-audio-course`, $12), cover +
   thumbnail + receipt message in place, buy button wired (PR #86).
   Regenerate the files anytime: `npm run course` (MP3 by default).
4. **GSC (now that it's verified):** confirm `sitemap.xml` submitted; Request
   Indexing on `/`, `/translate/`, `/keyer/`, `/morse-bracelet/`,
   `/cw-audio-course/`. Re-check coverage + Links in 3–4 weeks, then feed the
   query data into §4.3.

---

## 4. Ranked backlog for agents (code/content)

Ranked by value. **Do not add thin programmatic pages** — that hurt
indexing before; deepen/enrich instead. Visual changes: push to the
branch and have the owner review the Cloudflare preview before merge.

1. ✅ **DONE — Track B funnel blog posts**: bracelet ideas, tattoo ideas,
   and kids' games are live (PRs #81–#83), each routing into a tool/product.
2. **Spanish expansion** (in progress), then French: localize the gift/phrase
   + key reference pages (reciprocal hreflang, native-quality copy only).
   Biggest cheap-traffic lever; non-English competition is weak.
   - ✅ Shipped: `/es/sos-en-codigo-morse/`, `/es/numeros-en-codigo-morse/`,
     `/es/te-amo-en-codigo-morse/` (reciprocal hreflang with their EN
     counterparts; the "te amo" page funnels into `/morse-bracelet/`).
   - Next ES candidates: `mayday`, `feliz cumpleaños`, `te quiero`, `ayuda`,
     a learning guide (`/es/aprender-codigo-morse/`), and signos/puntuación.
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

- Branch: latest is `claude/youthful-ptolemy-6cqcb8` (PRs #85, #86 merged
  to `main` from it); start a fresh `claude/*` branch per task. Commit as
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
account work the owner must drive. As of 2026-06-24 the product is live,
GSC is verified, and outreach wave #1 is out — real momentum. The
highest-leverage next moves are still off-page: keep the distribution wave
going (§3.2), set the last revenue env vars (§3.1), and now that GSC is
verified, let real query data direct content (§4.3). Build less; distribute
more; measure; then double down on what moves.
