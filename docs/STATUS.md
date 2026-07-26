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

**⚠️ Consequence — IndexNow must now be fired by hand.** Step 8 of the build
pipeline only pings on a Cloudflare `main` build, so it has been silently
dead since the switch to wrangler uploads — Bing/Yandex/Seznam were not being
told anything had changed. **After the owner confirms each deploy is live**,
run from the repo (NOT before — submitting URLs that aren't live yet is worse
than not submitting):
```
INDEXNOW_FORCE=1 node scripts/indexnow-ping.mjs
```
It submits only URLs whose sources changed since `HEAD~1` (43 on 2026-07-25,
accepted 200 OK), so it stays well clear of anything that looks like
automated spam. `INDEXNOW_FULL=1` forces a full 761-URL resubmit — don't,
except after a genuine site-wide change.

**⚠️ Sanity-check the count before firing.** The script's "changed since
HEAD~1" rule assumes a commit touches a few pages. A *template* edit breaks
that assumption: the 2026-07-25 word-page description fix touched one file
and marked **545 URLs (71% of the site)** as changed, for what was a minor
snippet correction. Submitting that share of the site is indistinguishable
from "resubmit everything" and dilutes the signal. In that case, submit only
the materially-changed pages by hand (8 were submitted, 200 OK) and let the
template-wide edits get picked up on normal recrawl. Dry-run first:

```
node --input-type=module -e "import {execFileSync} from 'node:child_process';
import fs from 'node:fs'; import {sourcesForUrl} from './scripts/url-sources.mjs';
const since=Date.parse(execFileSync('git',['log','-1','--format=%cI','HEAD~1'],{encoding:'utf8'}).trim());
const urls=Array.from(fs.readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>([^<]+)<\/loc>/g)).map(m=>m[1]);
console.log(urls.filter(u=>{const s=sourcesForUrl(new URL(u).pathname).filter(f=>fs.existsSync(f));
if(!s.length)return true; const t=execFileSync('git',['log','-1','--format=%cI','--',...s],{encoding:'utf8'}).trim();
return t?Date.parse(t)>since:true}).length)"
```

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

### 0.3 📊 THE JULY RE-MEASURE (2026-07-25) — the current, authoritative read

Sources: full Bing WMT API pull (site/query/page/crawl, weekly, 275 days) +
GSC 6-month export. Agents now have a **Bing WMT API key** — data can be
re-pulled on demand rather than waiting on CSV exports. Endpoints that work:
`GetRankAndTrafficStats`, `GetQueryStats`, `GetPageStats`, `GetPageQueryStats`
(needs `&page=`), `GetCrawlStats`. Key is account-wide over 6 sites — **only
ever query `morsecodegenerator.com`.**

**1. The title rewrite WORKED — and §0.1 was wrong to list it as undeployed.**
Verified 2026-07-25: live HTML for `/`, `/nato/`, `/translate/` already matches
the current build, i.e. PR #92 deployed before the outage. The deploy cut off
*after* #92, *before* #93 (that's why `/blog/how-to-read-morse-code/` 404s).
Readout on "morse code generator" (Bing, weekly):
- 6 weeks pre (May 15–Jun 26): **1.43% CTR** (78 clicks / 5,458 impr)
- 4 weeks post (Jul 3–Jul 24): **2.67% CTR** (75 / 2,814) — **+86%, z=3.95,
  p<0.001**. Most recent week: 4.17%. Position flat at ~4 throughout, so this
  is a snippet effect, not a ranking effect.
Homepage page-level tracks it: 1.18% → 2.20%. **Conclusion: rewriting
title/meta on a high-impression page is a proven, repeatable lever here.**

**2. But only the homepage rewrite worked. `/nato/` and `/translate/` did
not.** `/nato/` is still ~0.1% CTR post-rewrite and its pool collapsed 6,458 →
1,044 impr/5wk (pos 8→10). `/translate/` sits at 0.0% CTR on 12–172 impr/wk.
Don't assume a rewrite works — measure each one.

**3. ⚠️ The real story is an impression collapse, and it is CTR-driven.**
Site impressions **-64%** (39.3k → 14.2k per 5 weeks, Apr/May vs Jun/Jul), but
clicks only **-24%** (351 → 267) because CTR doubled (0.89% → 1.88%). Split by
prior CTR:
- pages that had **<1% CTR**: impressions **-69%**
- pages that had **≥3% CTR**: impressions **+14%**
Bing is reallocating impressions away from pages that don't earn clicks. So
**CTR work is not an optimization here, it is defensive** — any page parked at
position 6–9 with ~0% CTR will lose its impression pool. Monthly Bing totals:
Apr 294 clicks/27.1k impr → May 265/34.8k → Jun 238/16.6k → Jul 256/12.6k
(23 days). Clicks are holding; the impression base is not.

**4. Google is a different problem entirely — it is authority-gated.**
GSC, last 6 months: **7 clicks, ~1,000 impressions, 106 of ~765 pages with any
impression at all.** Head terms sit on page 7–9: "morse code generator" pos
**81**, "morse code creator" pos 78, homepage avg pos 72 — versus **position 4
on Bing for the same query**. Bing reports **6 inbound links**. Nothing on-page
moves position 81; this is links + time. The only Google bright spots are
long-tail where competition is nil: name pages (`ryan`/`laura`/`emma`
`-in-morse-code` at pos 4–10) and `/apostrophe-in-morse-code/` (pos 8.7).
**Owner action needed:** pull the GSC → Indexing → Pages report; if most of the
765 pages are "Crawled/Discovered – currently not indexed", that reframes
everything about Google.

**5. Best concrete CTR targets, from the data** (Bing, last 8 weeks):
| page / query | impr | CTR | pos | note |
|---|---|---|---|---|
| `/cheat-sheet/` ← "morse code sheet" | 309 | **0.0%** | 6.8 | but pos **1.7 / 5.2% CTR** for "morse code *cheat* sheet", and "…cheat sheet pdf" converts **23%** → the page is titled for the wrong query |
| `/chart/` ← "morse code chart" | 369 | 0.8% | 9.6 | |
| `/history/` | 1,145 | 0.5% | 6.7 | |
| `/nato/` ← "nato alphabet" | 351 | 0.0% | 9.0 | rewrite already failed once |
| "morse code converter" | 153 | 0.7% | 8.7 | |
| "morse code maker" | 512 | 2.0% | 3.9 | second-biggest head term |
What already converts (protect it): "morse code generator copy and paste" 42%,
`/worksheets/` 12%, `/gear/best-morse-code-keys/` 14%, `/keyer/` 10%,
`/blog/morse-code-for-kids/` 16%.

### 0.3.0 🔬 RUNNING EXPERIMENT — CTR pass #2 (shipped 2026-07-25)

Two snippet changes are live. **Do not touch these pages until measured** —
re-pull Bing around **2026-08-22** (4 weeks) and compare against the baselines
below. Positions were stable pre-change, so any CTR move is a snippet effect.

| target | baseline (8wk to 2026-07-24) | change |
|---|---|---|
| `/cheat-sheet/` | 1,636 impr, 24 clicks, **1.5% CTR**, pos 6.4 | title now leads with "Morse Code Sheet" + free/PDF |
| ↳ query "morse code sheet" | 309 impr, **0 clicks**, pos 6.8 | the specific pool being targeted |
| ↳ query "morse code cheat sheet" | 77 impr, 4 clicks, 5.2%, pos 1.7 | **guardrail — must not regress** |
| `/morse-code/{ch}` (36 pages) | 528 impr, 4 clicks, **0.76% CTR** | titles 20→51-55 chars, descs 91→114-120 |

Precedent for what "worked" looks like: the homepage rewrite moved
"morse code generator" from 1.43% to 2.67% over 4 weeks (§0.3).

**Caveat on `/morse-code/{ch}`:** these are answer queries ("g in morse
code"), and the answer is in the title by design — hiding it to force clicks
would be user-hostile. The ceiling here may simply be low. If CTR is still
under ~1.5% at the recheck, conclude the page type is capped and stop
investing in it rather than iterating further.

### 0.3.0b 🔬 RUNNING EXPERIMENT — CTR pass #3 (shipped 2026-07-25)

Second pair of snippet changes, from the full site audit. Measure with pass
#2 at the **2026-08-22** checkpoint.

| target | baseline | change |
|---|---|---|
| homepage ← translator cluster | 36,865 impr, 191 clicks, **0.52% CTR**, pos 7.8 | description rewritten for translator intent; **title deliberately unchanged** |
| ↳ query "morse code translator" | 28,722 impr, 58 clicks, **0.20%**, pos 8.0 | the specific pool |
| ↳ query "morse code generator" | 27,326 impr, 1,084 clicks, **3.97%**, pos 3.4 | **GUARDRAIL — must not regress** |
| `/decoder/` ← reverse-lookup cluster | 3,650 impr, **3 clicks**, 0.08%, pos 7.1 | retitled + new pattern-lookup and spacing sections |

**Why the homepage title was not touched:** it earns 1,084 clicks at position
3.4 on "morse code generator". The translator pool is bigger but converts 8×
worse; risking a working ranking to chase it would be a bad trade. Only the
description changed. If the generator guardrail moves at all, revert first
and ask questions after.

**The `/decoder/` play is content, not keywords.** The queries *are* Morse
patterns (".-.-.- in morse code" = 1,272 impr), which can't be targeted as
keywords, and Bing was answering them with the homepage. The page now carries
the actually-searched strings plus the two things that confuse people:
punctuation patterns, and how spacing changes the reading. Page went from
~560 to 781 words, all of it original.

**Ceiling to be honest about:** at position 7–8 no snippet gets you to
position 3. These changes harvest the pool we already have. Moving position
needs links, and the site has 6.

### 0.3.0c CTR pass #4 + audit follow-ups (shipped 2026-07-25)

- **`/nato/` — "military alphabet" keyword gap.** 1,460 impressions across
  "military alphabet" (1,155), "military alphabet code" (216) and "military
  phonetic alphabet" (89), all at ~0% CTR, and the word appeared once on the
  page and never in the title. Title now leads with it. **Low expectations
  on purpose** — this page lost 84% of its pool and a prior rewrite did
  nothing. If the August checkpoint shows no movement, stop investing here.
- **`/chart/` ↔ `/cheat-sheet/` territory split.** They were splitting the
  same pools. Now: **`/chart/` owns chart / table / alphabet chart**,
  **`/cheat-sheet/` owns sheet / cheat sheet / printable sheet**. PDF stays
  on `/chart/` ("morse code pdf" is its best converter). Comments in both
  files say so — don't recreate the overlap.
- **6 missing word pages added** (`hi`, `egg`, `thanks`, `friend`, `phone`,
  `bff`). All were 404ing with real demand — `/hi-in-morse-code` alone had
  351 impressions. 765 → 771 pages.
- **🐛 Snippet defect fixed across ~530 word/name pages.** The description
  put the Morse string immediately before a full stop, so "HI is `.... ..`"
  rendered as "`.... ...`" in the SERP — a different, wrong pattern. Any word
  ending in a dit was affected, which is most of them. Now parenthesised.
  This is a correctness fix, not the title expansion Bing asked for (§0.3.3
  still stands: do not bulk-expand this cluster).

### ⚠️ 0.3.0d Correction: `/gear/` is NOT the data-justified investment

Earlier handoffs (and my own first pass) called `/gear/` "the one
data-justified investment" off its 32.93% CTR. **Checked properly: that CTR
is on 82 impressions across nine months — about 9/month.** `/gear/` itself
draws ~25 impressions, `/gear/best-morse-code-keys/` ~50. It converts
beautifully and has almost nothing to convert. **More gear content will not
create gear demand.** If gear is worth anything it is via better monetisation
of the few high-intent visitors who do arrive, not more pages. Treat the old
"deepen /gear/" recommendation as retired.

### 0.3.2 Google indexing diagnosis (GSC exports, 2026-07-25)

**`Crawled – currently not indexed` has doubled: 102 → 220 pages** since late
April (peak 228). That is the number to watch. What's in it:

| count | what | read |
|---|---|---|
| 103 | `/{word\|name}-in-morse-code/` | **Google crawled the programmatic cluster and declined to index it.** This is Google's verdict on 533 template pages, and it is the single most important fact about our Google position. |
| ~75 | `/translate/?q=…` | crawl waste — see the robots.txt bug below |
| 19 | `/morse-code/{ch}/` | same template-thinness signal |
| 18 | `/phrases/*` | same |
| 8 | `llms.txt`, `ai.txt`, `morse.json`, `rss.xml`, `sitemap.xml`, `manifest.webmanifest` | harmless noise; non-HTML files GSC counts anyway |

**`Alternate page with proper canonical tag` went 0 → 160 in three months** —
144 `/translate/?q=…`, 14 `/morse-bracelet/?text=…`. Canonicals are doing
their job, but Google should never have been crawling these at all.

**🐛 Root cause found and fixed (2026-07-25): the robots.txt disallows were
never applied to Googlebot or Bingbot.** A crawler obeys exactly ONE group —
the most specific one matching its name — and ignores all others, including
`User-agent: *`. Every named crawler had a group containing only `Allow: /`,
so all of them were exempt from the `?q=` / `?lang=` rules; only *unnamed*
crawlers ever obeyed them. Fixed by repeating the rules in all 23 named
groups (+ `?text=`). **Do not refactor that repetition away** — see the
comment in `public/robots.txt`. Expect the ~220 query-param entries to drain
out of GSC over the following weeks.

**`Page with redirect` = 14 — ignore it.** It's www/http variants plus the
intentional letter/digit consolidation redirects. Working as designed. Two
entries (`?ref=Launchtory`, `?ref=producthunt`) are evidence of real referral
links, not a problem.

**⚠️ The open strategic question this raises.** 533 programmatic word/name
pages, of which Google has already refused 103; they earn 3.8% of Bing
impressions; and the site has 6 inbound links with head terms at position 81.
The cluster is a plausible contributor to a site-wide quality assessment.
Options are (a) leave it and build authority, (b) consolidate the weakest
pages into richer hubs, (c) noindex the tail. **Not yet decided — do not act
on this unilaterally.** Note it argues strongly against Bing's "expand all
533 titles" recommendation (§0.3.3).

### 0.3.3 Bing's WMT recommendations — verified, mostly NOT worth acting on

Bing flags "titles too short" (635 of 763 pages, median 20 chars) and
"descriptions too short" (390 pages). Both are factually true. Sized against
traffic, they are close to irrelevant:

| page type | pages | Bing impr (8wk) | CTR |
|---|---|---|---|
| hand-written / hub | 58 | **21,922** | 1.72% |
| `/morse-code/{ch}` | 30 | 528 | **0.76%** |
| `/{word\|name}-in-morse-code/` | 55 | 261 | **6.13%** |
| `/phrases/*` | 15 | 54 | 5.56% |
| `/abbreviations/*` | 2 | 18 | 11.11% |

All template pages together = **3.8% of impressions at 2.90% CTR**, i.e.
*better* than the hand-written pages at 1.72%. The 533 word/name pages Bing
complains about have the best CTR on the site with 19-character titles —
direct evidence against "longer title = more clicks" for that page type.
**Worth doing: `/morse-code/{ch}` only** (39 pages, 0.76% CTR, one template).
**Not worth doing: the 533-page expansion.** The impressions live in the 58
hand-written pages, whose titles are already ~51 chars — their problem is
persuasion, not length.

### 0.3.1 Prior read (2026-06-27 / 07-01) — superseded by §0.3 above
- Site gets **~226 clicks / ~15k impressions / ~1.4% CTR per month**, steady.
  It's an *under-converted*, not a pre-traffic, site.
- **CTR is the #1 lever.** "morse code generator" = pos ~4 but 1.28% CTR →
  the title rewrites (#92) target exactly this. ✅ Re-measured 2026-07-25:
  it worked (+86%). See §0.3.
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
