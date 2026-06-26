# Backlog & Unfinished Work

**Generated:** 2026-06-24, from a deep code audit (not just docs). This is the
durable list so nothing gets lost. For *current state* see
[`STATUS.md`](./STATUS.md); for *strategy* see [`ROADMAP.md`](./ROADMAP.md);
for *how the code works* see [`/CLAUDE.md`](../CLAUDE.md).

**Priority reality:** the site is over-built for its traffic. The bottleneck is
**distribution + authority + turning on dormant revenue**, not features. Treat
sections B–E as a menu to pull from *only* once Search Console data justifies
the depth. Highest leverage stays **A** (config/revenue) and **F** (let GSC
data direct content).

Status key: ⛔ owner-action (needs accounts/keys) · 🔨 code gap · 🧭 planned
feature (not started) · ✅ done this engagement.

---

## A. Owner-action / config — dormant, blocking revenue & data

- ✅ **`AMAZON_ASSOC_TAG`** — now defaulted in code (`mcg0d2-20`, in
  `affiliate-products.js`, overridable by the Cloudflare env var). Gear
  pages + every gift/phrase + name page now emit tagged Amazon search
  links (never-404) and earn on next deploy. Hand-picked `amzn.to` product
  links take precedence where set.
- ⛔ **AdSense dormant** — `ADSENSE_SLOT_ARTICLE/_GLOSSARY/_FAQ` unset, so
  `<AdSlot>` renders nothing. Also confirm AdSense **account approval**
  (client id `ca-pub-7616383336440831` is the hardcoded default in
  `Layout.astro`). ✅ `public/ads.txt` now exists (2026-06-24).
- ⛔ **Newsletter** — `NEWSLETTER_ACTION` unset; form degrades to mailto.
  The email list is the most durable asset and captures nothing today.
- ⛔ **Donations** — set a real `DONATE_URL` (Ko-fi / BMC).
- ⛔ **Verification metas** — `PINTEREST_VERIFICATION` (matters for the
  bracelet/tattoo audience), `YANDEX_VERIFICATION`,
  `FACEBOOK_DOMAIN_VERIFICATION`. ✅ Google + Bing done.
- ⛔ **Distribution** — wave #1 outreach sent (7 CW resource pages,
  2026-06-24). Still TODO: DXZone + directory submits, more prospects, and
  the account-gated channels (age Reddit/PH/HN ~3 wks → post the ready
  drafts in `DISTRIBUTION.md`).

## B. Half-built / partial features (code gaps)

- 🔨 **Camera-torch playback** — only screen-flash + vibrate exist
  (`translate/index.astro`). The real-torch half (`ImageCapture` /
  `torch` constraint) for the "morse code flashlight" query is unbuilt.
- 🔨 **MP3 export on the translator** — `/translate/` exports WAV only.
  `lamejs` is already a dependency (used by the course) but not wired to
  the translator.
- 🔨 **Keyer upgrades** — real key via microphone, and iambic mode.
- ✅ **`favicon.ico`** — added 2026-06-24 (`scripts/gen-favicon.mjs`).

## C. Unbuilt features (planned, not started)

- 🧭 **Daily leaderboard** on `/daily/` (streaks exist; leaderboard needs a
  backend).
- 🧭 **QSO simulator** — scripted on-air contact practice.
- 🧭 **Morse chat room** (WebRTC/WebSocket, CW-only).
- 🧭 **Cross-tool progress dashboard** — unified localStorage progress
  across trainer / flashcards / keyer (today only `/daily/` tracks streaks).
- 🧭 **Premium "Pro" web tier** (auth + Stripe). Large; gated on traffic +
  email list first.
- 🧭 **Rate-limited audio-generation API** (text→WAV/MP3) as a paid dev
  tier. `/api/` documents only the static `morse.json` today.

## D. Internationalization

- 🔨/🧭 **Only Spanish exists**, and partially: `/es/` has the hub,
  translator, alphabet, SOS, numbers, "te amo" — but no ES decoder,
  practice, flashcards, phrases, or learning guide. **French / German /
  Portuguese** not started (the roadmap's biggest untapped lever; non-English
  competition is weak). Next ES: `mayday`, `feliz cumpleaños`, `te quiero`,
  `ayuda`, `/es/aprender-codigo-morse/`, signos/puntuación.

## E. Engineering / quality

- ✅ **Unit tests for core Morse logic** — added 2026-06-24
  (`src/utils/morse.test.ts`, 12 tests, Node built-in runner; CI runs
  `npm test` on Node 22). *Other modules still have no tests.*
- 🔨 **No Lighthouse / perf CI** — roadmap §6 wanted a scheduled run; CI
  does build + typecheck + tests + link-check only.
- 🔨 **No content-freshness automation** — roadmap §6 wanted a job to flag
  posts >6 months old.

## F. Content / SEO (agent-doable, ranked)

1. **GSC-driven content loop** — now unblocked (GSC verified). In ~3–4 weeks,
   mine queries ranking #8–20 and deepen toward them. *Should drive most
   future content decisions — let data pick, not hunches.*
2. **More Spanish** (see D).
3. **Pinterest image pipeline** — auto-generate "letter / Q-code of the day"
   cards via the resvg OG pipeline for the bracelet/tattoo audience.
4. **Newsletter RSS→email automation** — once `NEWSLETTER_ACTION` is set.

## G. Deliberately NOT doing (decisions, not gaps — don't resurrect)

- **FAQ rich-result schema** — Google deprecated it for non-gov/health
  sites (2023).
- **Paid PDF of free content** — removed on purpose (2026-06-17);
  `/printables/` stays free.
- **American Morse translator/chart** — reference-only in blog/history; the
  site teaches International only.
- **`aggregateRating` stars** — withheld until real on-page reviews exist
  (manual-action risk).
