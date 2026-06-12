# MorseCodeGenerator.com — Site Audit & Growth Roadmap

_Last audited: 2026-06-11. Build verified green: 501 pages, zero broken
internal links, sitemap 497 URLs, 28 OG images, all `verify-build` checks
passing._

The grand vision: **the hub and center for Morse code on the internet** —
then monetize the traffic. This document is the working plan, ordered by
return on effort.

---

## 1. Health check (current state)

| Area | Status |
|---|---|
| Production build (`npm run build`) | ✅ passes, all verify checks green |
| Internal links (501 pages) | ✅ zero broken |
| Sitemap + news sitemap + RSS + IndexNow | ✅ generated & pinged on deploy |
| OG images (per-page PNG, 28 curated) | ✅ generated at build |
| PWA (service worker, offline page, manifest) | ✅ |
| Security headers (`_headers`) | ✅ HSTS, CSP frame-ancestors, etc. |
| Consent-gated GA4 + AdSense loader | ✅ wired, GDPR-safe |
| llms.txt / llms-full.txt / ai.txt / robots.txt | ✅ AI-crawler friendly |
| Typecheck (`astro check`) | ⚠️ `@astrojs/check` not in devDependencies |

Content inventory: translator, decoder, Koch practice trainer, flashcards
(incl. audio mode), random CW generator, timing calculator, printable
chart, cheat sheet, embed widget, public `morse.json` API, 26 letter +
10 digit + punctuation pages with mnemonics, ~385 word/phrase SEO pages,
prosigns, Q-codes, CW abbreviations, NATO, history, teach (lesson plans),
operating reference, 13 blog posts, FAQ, glossary.

---

## 2. Activate what's already built (do first — near-zero code)

The monetization plumbing exists but is **dormant** because env vars are
unset on the build host. These are config tasks, not code tasks:

1. **AdSense** — apply / confirm approval for `ca-pub-7616383336440831`,
   create ad units, then set `ADSENSE_SLOT_ARTICLE`, `ADSENSE_SLOT_GLOSSARY`,
   `ADSENSE_SLOT_FAQ` in Cloudflare Pages env. Until set, `<AdSlot>` renders
   nothing and the site earns $0.
2. **Newsletter** — create a Buttondown (free <100 subs) or ConvertKit
   account, set `NEWSLETTER_ACTION` (+ `NEWSLETTER_FIELD` if needed).
   Currently the form degrades to a mailto link. The email list is the
   single most durable monetization asset (sponsorships, product launches).
3. **Donations** — create Ko-fi / Buy Me a Coffee, set `DONATE_URL`.
4. **Search Console** — verify Google Search Console + Bing Webmaster
   (env vars `GOOGLE_SITE_VERIFICATION`, `BING_SITE_VERIFICATION` are
   already supported), submit `sitemap.xml`, and check Core Web Vitals +
   coverage monthly. Without GSC there is no visibility into what ranks.
5. **Dev hygiene** — add `@astrojs/check` + `typescript` to devDependencies
   so `npm run typecheck` works in CI.

---

## 3. Monetization strategy (layered, in order of maturity)

**Layer 1 — Display ads (now).** AdSense on long-form pages only (blog,
glossary, FAQ — already the policy in `AdSlot.astro`). Expect modest RPM;
this funds hosting. Once traffic >50k sessions/mo, apply to a premium
network (Mediavine Journey / Raptive) for 3–10× the RPM.

**Layer 2 — Affiliate (next 1–2 months).** Morse has a real gear niche:
- Morse keys & paddles (Amazon Associates; later direct programs —
  Vibroplex, CW Morse, Putikeeg paddles on AliExpress/eBay partner).
- Ham radio starter rigs (QRP transceivers: QCX, (tr)uSDX, Xiegu).
- Books & courses (Amazon: "The Art and Skill of Radio-Telegraphy", ARRL).
Build: `/gear/` hub + "best Morse code key", "best CW paddle for
beginners", "QRP CW transceivers compared" review pages. These are
buyer-intent keywords with weak competition. The `/disclosure/` page
already exists to satisfy FTC requirements.

**Layer 3 — Sponsorship (when GSC shows real traffic).** The `/sponsor/`
rate sheet exists. Pitch ham-radio retailers (HamRadioOutlet, DX
Engineering, GigaParts), license-exam-prep companies (HamRadioPrep,
hamstudy), and STEM-education brands. A single site-wide sponsor at even
$200–500/mo beats early AdSense.

**Layer 4 — Products (3–6 months).**
- **Premium PDF pack** ($5–9 one-time via Gumroad/LemonSqueezy, zero
  backend): high-res printable charts (A4/Letter/poster), 30-day practice
  workbook, flashcard deck (printable + Anki export), teacher classroom kit.
  The free chart/cheat-sheet pages become the funnel.
- **"Morse Pro" web tier** ($15–25/yr): progress tracking across devices,
  unlimited custom practice sets, downloadable MP3 practice files, no ads.
  Needs auth + payments (Cloudflare Workers + Stripe) — only build after
  the email list proves demand.
- **API tier**: `morse.json` is free; a rate-limited audio-generation API
  (text→WAV/MP3 endpoint) could be a cheap paid tier for developers.

**Layer 5 — Email monetization (ongoing).** Weekly tip newsletter →
sponsor slots + product launches. Even 1,000 niche subscribers is a
sellable audience in ham radio.

---

## 4. SEO roadmap

Strong foundation already (canonicals, JSON-LD graph, OG/Twitter, hreflang
where real, IndexNow, news sitemap, 500 indexable pages). Next moves:

1. **Win the head terms.** "morse code translator" (~500k/mo globally) is
   the prize. The homepage + `/translate/` need to be measurably faster
   and richer than morsecode.world / morsecodetranslator.com. Add real
   user reviews on `/translate/` to unlock `aggregateRating` stars
   (deliberately withheld now — correctly).
2. **Internationalization** — the biggest untapped lever. The translator UI
   already supports `?lang=es` but only one page. Ship static `/es/`,
   `/de/`, `/fr/`, `/pt/` translator + alphabet pages with proper hreflang.
   Non-English "morse code translator" queries have far weaker competition.
3. **Programmatic expansion (quality-gated):**
   - Names in Morse: `/name/<name>-in-morse-code/` for top ~500 first
     names ("your name in morse code" has steady search volume).
   - "How do you say X in Morse" FAQ-schema pages for question-form queries.
   - Birthday/anniversary "morse code message" generator pages (gift/
     tattoo intent — pairs with affiliate jewelry links: morse code
     bracelets are a real Etsy/Amazon category).
4. **Morse code bracelet/jewelry/tattoo content** — huge non-ham search
   cluster ("morse code bracelet ideas", "morse code tattoo generator").
   A visual generator (dots/dashes as bead patterns, downloadable PNG/SVG)
   is both a link magnet and an affiliate machine.
5. **Link building / digital PR:** free embeddable widget (exists — promote
   it to teacher/scout/STEM sites), submit tools to directories
   (AlternativeTo, Product Hunt, ToolFinder), the `/teach/` lesson plans to
   teacher resource hubs (TPT free listing, Scout forums), HARO/queries for
   "Morse code expert" mentions.
6. **Content freshness loop:** update `modifiedTime` + republish 2 posts/mo;
   GSC query mining → new posts targeting questions the site already ranks
   #8–20 for.

---

## 5. Feature roadmap (product depth = retention = revenue)

Near term:
- **Audio file export** — generate WAV/MP3 of any translation client-side
  (OfflineAudioContext → WAV encode). Highly shared/linked feature most
  competitors gate or lack. Also the basis of the paid API later.
- **Image/SVG export** — dots-and-dashes as downloadable graphic
  (tattoo/bracelet/gift intent, feeds Pinterest traffic).
- **Light/sound flasher** — screen-flash + camera-torch playback
  (mobile PWA differentiator; "morse code flashlight" is a real query).
- **Keyer practice** — tap spacebar/screen to *send* Morse, site decodes
  your keying and scores timing. Nobody does this well in-browser; it
  completes the learn-loop (receive ✅ exists, send ❌ missing).
- **Streaks + local progress dashboard** — localStorage-based practice
  streaks/levels across trainer/flashcards (retention; later syncs in Pro).

Medium term:
- **Morse chat room** (WebRTC/WebSocket, CW-only chat) — community moat.
- **QSO simulator** — scripted on-air contact practice (data exists in
  `/operating/`).
- **Leaderboards / daily challenge** — "Wordle for Morse": one daily word,
  shareable result. Massive organic-share potential, cheap to build static.

---

## 6. AI & automation

- **Content pipeline:** monthly Claude Code session: mine GSC queries →
  draft 2–4 posts into `blog-posts.js`/`blog-bodies.js` → human review →
  merge. The blog data files are already structured for this.
- **CI automation (GitHub Actions):**
  - PR check: build + `verify-build` + internal-link check (the link
    checker from this audit should move into `scripts/`).
  - Weekly scheduled Lighthouse CI run, fail on regression.
  - Scheduled freshness job: flag posts >6 months old for refresh.
- **AI search optimization (already strong):** llms.txt + permissive
  robots + attribution policy. Add: ensure every tool page has a concise
  "what this does" paragraph an LLM can quote with attribution; monitor
  referrals from chatgpt.com/perplexity.ai in GA4.
- **Social automation:** auto-generate a daily "letter of the day" /
  "Q-code of the day" image (reuse the resvg OG pipeline) → buffer to
  X/Pinterest/Instagram. Pinterest especially (bracelet/tattoo audience).
- **Newsletter automation:** RSS-to-email campaign in Buttondown so each
  new post auto-sends.

---

## 7. KPIs / instrumentation

Track in GA4 (consent-gated, already wired):
- Sessions, % organic, top landing pages (GSC)
- Tool engagement events: translate, play-audio, copy, share, download
  (add `gtag` events — currently no custom events are fired)
- Newsletter signups, donation clicks, affiliate clicks (outbound events)
- Ad RPM once AdSense live; aim: ads → <40% of revenue by month 6
  (diversified into affiliate + products + sponsorship)

---

## 8. Suggested execution order

| # | Item | Effort | Impact |
|---|---|---|---|
| 1 | Set env vars: AdSense slots, newsletter, donate, GSC/Bing | config only | unlocks all revenue |
| 2 | GSC + Bing verification, sitemap submit | config only | SEO visibility |
| 3 | Audio WAV/MP3 export + SVG export on translator | small | links + shares |
| 4 | GA4 custom events on tool actions | small | measurement |
| 5 | `/gear/` affiliate hub + 3 review pages | medium | first real revenue |
| 6 | Daily Morse challenge ("Wordle for Morse") | medium | viral loop |
| 7 | Spanish (`/es/`) translator + alphabet | medium | new traffic pool |
| 8 | Names-in-Morse + jewelry/tattoo generator pages | medium | big SEO cluster |
| 9 | Keyer (send) practice + streaks | medium | retention moat |
| 10 | PDF product pack on Gumroad | medium | first product revenue |
| 11 | Premium tier (auth + Stripe) | large | only after list proves demand |
