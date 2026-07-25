# Project Status & Handoff

**Last updated:** 2026-07-02. Read this to pick up the work. For *how the
codebase works* see [`/CLAUDE.md`](../CLAUDE.md); for *strategy* see
[`ROADMAP.md`](./ROADMAP.md); for the *full unfinished-work list* see
[`BACKLOG.md`](./BACKLOG.md); for *getting traffic* see
[`DISTRIBUTION.md`](./DISTRIBUTION.md) + [`LAUNCH-KIT.md`](./LAUNCH-KIT.md).

---

## 0. 🚚 DEPLOYMENT — read first (updated 2026-07-25)

**GitHub reinstatement did NOT come through.** The Cloudflare Pages ↔ GitHub
integration stays dark, so **git-push no longer deploys anything.** Production
is now shipped by **manual direct upload** from the owner's machine:

```
npx.cmd wrangler pages deploy C:\Projects\morsecodegenerator-site --project-name morsecodegenerator
```

**Agent workflow (this is the new normal):**
1. Do the work on a `claude/*` branch, commit + push as usual (the session's
   git access still works — it does not depend on the owner's account).
2. Run `npm run build` + `npm run typecheck` (both must be green).
3. **Zip the CONTENTS of `dist/`** (so `index.html` is at the archive root,
   not nested under `dist/`) and hand the zip to the owner.
4. Owner extracts it over `C:\Projects\morsecodegenerator-site` and runs the
   wrangler command above. That single upload ships everything merged so far.

**Consequence — env vars:** Cloudflare Pages *build* env vars no longer apply,
because the build now happens here, not on Cloudflare. Verified 2026-07-25
that this costs nothing today: the live site has **no** verification meta tags,
**no** ad slots and **no** newsletter form action, i.e. those vars were never
set anyway. Everything that *is* live has a code default and survives a local
build: GA4 `G-1K9JZ9ZQ2L`, Amazon tag `mcg0d2-20`, Gumroad
`gumroad.com/l/cw-audio-course`. GSC/Bing verification is via DNS/file, not the
meta tag, so it is unaffected. **If a revenue env var is ever wanted, it must
now be passed into the build here (or hard-defaulted in code) — setting it in
the Cloudflare dashboard will do nothing.**

Everything else that was previously blocked (merged-but-undeployed work in
§0.1) goes live with the first wrangler upload.

### Historical: the GitHub suspension (2026-07-02)

**The owner's GitHub account (`SentioAu`) was SUSPENDED** by GitHub's
automated abuse detection.

- **Root cause (NOT this repo):** a *different* project, `playersb.com`, ran
  a GitHub Actions cron that **committed regenerated data every few minutes**
  during live sports matches, plus PR bursts and large commits during a
  restructure. That high-frequency automated-commit pattern tripped GitHub's
  spam/abuse detection. `morsecodegenerator` is clean (CI only runs on PRs).
- **Effect:** GitHub Actions disabled account-wide **and** the Cloudflare
  Pages ↔ GitHub deploy integration went dark at the same time. So:
  **production has NOT deployed since ~2026-06-27.** The live site serves a
  stale build. Confirmed: `/blog/how-to-read-morse-code/` returns 404 in
  production even though it's merged to `main`.
- **Status:** owner filed GitHub Support reinstatement ticket **#4528743**
  ("Reinstate SentioAu — account flagged as spammy in error"). Support (Noah)
  asked "how do you plan to use GitHub?"; owner replied with legit-use +
  remediation (cut the cron to daily, stop committing generated data).

### ✅ Post-deploy verification (after each wrangler upload)
1. **Verify live:** `/blog/how-to-read-morse-code/` loads (not 404); homepage
   `<title>` = "Morse Code Generator – Free Translator, Audio & Copy/Paste".
2. **Spot-check a page from the newest work** (whatever shipped in that zip).
3. Note that **CI does not run** while the account is suspended — the agent's
   local `npm run build` + `npm run typecheck` IS the gate now. Never hand over
   a zip from a build that was not green.

### 0.1 Merged to `main` but NOT yet deployed (will go live on first deploy)
- CTR title/meta rewrites: `/`, `/nato/`, `/translate/` (PR #92)
- Spanish pages: `/es/te-quiero-...`, `/es/aprender-codigo-morse/` (PR #90)
- Blog: `morse-code-gift-ideas` (#91), `how-to-read-morse-code` (#93),
  and **name / who-invented / call-CQ** (#94)
- Affiliate: site-wide tagged Amazon search links + default tag `mcg0d2-20`
  (PR #89) — `/gear/*` + every gift/name page + gift blog post.

### 0.2 Content backlog (topics, ranked — Tier 1 shipped in #94)
- **Tier 1 (DONE, in #94):** write-your-name, who-invented, call-CQ.
- **Tier 2 (NEXT):** how-to-memorize-morse (mnemonics) → flashcards/practice;
  morse-code-speed/WPM explainer → timing-calculator; straight-key-vs-paddle-
  vs-bug → /gear/; how-to-signal-SOS-with-a-flashlight → translator/emergency.
- **Tier 3 (link magnets):** songs-with-hidden-morse-code; copy-&-paste-morse;
  generate-morse-with-code (JS/Python) + /api/.
- Do NOT add more bracelet/gift posts — search data shows ~0 organic demand
  for that cluster (it's a Pinterest play, not SEO).

### 0.3 What the search data told us (Bing WMT; GSC minimal) — act on this
First real data (analyzed 2026-06-27, 7-day recheck 2026-07-01). NOTE: owner
asked to **pause data/stats analysis until end of July** — then re-measure.
- Site gets **~226 clicks / ~15k impressions / ~1.4% CTR per month**, steady.
  It's an *under-converted*, not a pre-traffic, site.
- **CTR is the #1 lever.** "morse code generator" = pos ~4 but 1.28% CTR →
  the title rewrites (#92) target exactly this. Re-measure ~mid/late July.
- **Gear ≫ bracelets.** Real audience = tools/reference/ham. `/gear/best-
  morse-code-keys/` converts 18.6%; "morse code paddles for beginners" ranks
  pos 2.4. The gift/bracelet affiliate cluster gets ~0 search traffic. When
  resuming code work, **deepen `/gear/`** (the one data-justified investment).
- **Spanish is working** — `/es/` pages rank pos 3–7 within days and are
  starting to earn clicks ("metodo koch gratis", `/es/sos` first click).

### 0.4 The honest meta-lesson for the next agent
The product is an **A- build and is over-built for its traffic** (see the
full audit in the session log / BACKLOG). The bottleneck is **distribution +
authority (human/account-gated) and CTR (on-page)** — NOT features or more
pages. Resist the reflex to "build more" when handed the wheel; the highest-
leverage moves are off-code: get the account reinstated, deploy, do Track-A
distribution (`LAUNCH-KIT.md`), and let the CTR experiment run before scaling
it. Ship content only where data shows demand (tools/ham/gear/Spanish).

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

- **📊 First real search data (Bing WMT, 2026-06-27)** — overturns the old
  "~0 traffic" story. Actual: **~226 clicks, ~15k impressions, ~1.4% CTR per
  month**, steady daily. Key findings:
  - **CTR, not traffic, is the bottleneck.** "morse code generator" =
    3,117 impr at position ~4 but only **1.28% CTR**. The win is harvesting
    impressions we already get (title/meta), not new pages.
  - **Big wasted impression pools:** `/nato/` (1,869 impr, 0.11% CTR, pos 8);
    "morse code sheet" (231, 0 clicks); `/translate/` + converter terms
    (pos 7–9, ~0 clicks).
  - **What converts:** tools/reference/ham — `/worksheets/` (28% CTR),
    `/gear/best-morse-code-keys/` (18.6%), `/keyer/` (12%), copy-paste cluster.
  - **Strategic mismatch:** the gift/bracelet/jewelry cluster we monetized
    gets ~0 search traffic; the **gear** affiliate cluster aligns with real
    traffic and converts. Tilt affiliate toward gear; treat bracelets as a
    Pinterest/off-search play, not an SEO one.
  - **Done 2026-06-27:** CTR title/meta rewrites for `/`, `/nato/`,
    `/translate/`. Next: converter-intent depth on `/translate/`+`/decoder/`,
    a "morse code sheet/PDF" target, more gear depth. NOTE: this is **Bing**;
    Google (GSC) data is still minimal — pull both before big bets.

**The one thing that matters now: convert the traffic we already have, then
grow it.** Monetization is live (product + affiliate). The constraint is
on-page CTR (immediate, in our control) and off-page authority/distribution
(slower, human-gated). See §3 and the data note above.

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
