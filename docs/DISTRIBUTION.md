# Distribution & Backlink Playbook — MorseCodeGenerator.com

Why this is a doc, not code: backlinks and traffic come from posting to
real communities from real accounts. An AI agent can't (and shouldn't)
auto-post — that's spam, it gets accounts banned, and it damages the
brand. So this file is the **campaign + the exact copy**; a human runs it.

Ground rules that make the difference between links and bans:
- **Give value first, link second.** Lead with the useful thing; the link
  is incidental.
- **One genuine post per community.** Don't blast the same text everywhere
  the same day. Space it out; tailor each.
- **Be a real participant.** Reply to comments, answer questions. A post
  with engaged replies earns the upvotes that earn the backlink.
- **Disclose you made it** where the community expects it ("I built…").

Track results in a simple list: date · channel · URL · outcome (clicks,
upvotes, did it become a backlink?). Re-check Search Console → Links in
~3–4 weeks.

---

## Priority order (effort → payoff)

1. **Product Hunt** — the keyer + bracelet maker are genuinely novel. One
   good launch = a dofollow-ish link + a traffic spike + social proof.
2. **Hacker News (Show HN)** — the privacy-first, all-client-side angle
   plays well. High variance, but one front-page hit is transformative.
3. **Reddit** — r/amateurradio, r/morse (warm, exact audience).
4. **Ham forums** — QRZ, eHam, CWops (the people who buy gear → affiliate).
5. **Teacher channels** — for `/worksheets/` + the free `/printables/` pack.
6. **Pinterest** — for `/morse-bracelet/` (huge craft/tattoo/gift audience).
7. **Tool directories** — AlternativeTo, and "free tools" aggregators.
8. **The embed widget** — the scalable, evergreen backlink engine (below).

---

## 1. Product Hunt

**Name:** Morse Code Generator — learn, send & translate Morse, free
**Tagline (≤60 chars):** Translate, hear, send & practice Morse — 100% in your browser
**Topics:** Education, Web App, Open Source-ish/Free, Productivity

**Description:**
> Morse Code Generator is the free hub for Morse code. Translate text ⇄
> Morse and hear it as audio, learn the alphabet with a Koch trainer and
> flashcards, practice *sending* on a straight-key keyer that decodes your
> timing live, play a daily Morse puzzle, and even turn a word into a
> bracelet or tattoo design. Everything runs client-side — no login, no
> tracking beyond anonymous analytics, works offline.

**Maker's first comment (pin this):**
> Hi PH 👋 I built this because every Morse site online is either ugly,
> paywalled, or only does text→dots. I wanted one place that does it all
> and respects your privacy (it all runs in your browser — nothing's
> uploaded). The piece I'm proudest of is the **keyer**: tap your spacebar
> like a real straight key and it decodes your fist in real time, adapting
> to your timing. Would love feedback from anyone learning CW — what's
> missing? Free, no account: https://morsecodegenerator.com

Launch tips: launch 12:01am PT, line up a few friends to comment (not just
upvote), reply to every comment in the first hours.

---

## 2. Hacker News — Show HN

**Title:** Show HN: Morse Code Generator – translate, send and learn Morse, all client-side
**URL:** https://morsecodegenerator.com

**First comment:**
> I built the whole thing as a static site — no backend, no DB. The
> translator, audio (Web Audio, 600 Hz, real Farnsworth timing), the
> send-trainer keyer (adaptive dit/dah detection), and a WAV export all
> run in the browser, so nothing you type leaves your machine. ~750 pages,
> deployed on Cloudflare Pages. Happy to talk about the audio timing, the
> adaptive keyer decoder, or the programmatic-SEO setup. What would you
> add?

(HN dislikes marketing voice — keep it technical and humble. Expect
critique; engage graciously.)

---

## 3. Reddit

**Rules:** read each sub's self-promo policy; most allow it if you're a
real participant. Don't link-drop and leave.

**r/amateurradio** — title:
> I built a free, all-in-browser CW trainer — including a keyer that
> decodes your straight-key sending in real time
>
> Body: After getting back into CW I was frustrated that nothing online
> let me practice *sending* and get feedback. So I built one: tap the
> spacebar (or a real key via the mic later) and it decodes your timing,
> adapting to your fist. It's part of a free site with a Koch trainer,
> random-callsign/QSO practice, a daily puzzle, and the usual translator —
> all client-side, no login. Free, no ads in the tools:
> https://morsecodegenerator.com/keyer/ — feedback from real ops very
> welcome, especially on the timing tolerances. 73

**r/morse** — same tool, shorter, community-casual.

**r/teachers / r/Teachers / r/ScienceTeachers** — title:
> Free printable Morse code worksheets + a 45-min lesson plan (no signup)
>
> Body: Made a free worksheet generator (decode/encode, auto answer key)
> and a print-ready pack with a lesson plan for a STEM/signals unit or a
> Scouts badge. No account, prints on Letter/A4:
> https://morsecodegenerator.com/worksheets/

---

## 4. Ham forums

- **QRZ.com** forums → "Working Different Modes / CW" section.
- **eHam.net** → reviews/forums.
- **CWops** reflector / forums.

**Post template:**
> Free browser CW toolkit (no login): translator with audio, Koch trainer,
> and a send-practice keyer that decodes your straight-key timing live.
> Built it for my own practice; sharing in case it's useful. Feedback
> welcome. https://morsecodegenerator.com

---

## 5. Pinterest (for /morse-bracelet/ — craft/gift/tattoo audience)

Create a board "Morse Code Bracelet & Tattoo Ideas." Pin images generated
from the bracelet tool (download the PNG/SVG) with keyword-rich captions:
- "How to make a [name] Morse code bracelet — free pattern generator"
- "Morse code tattoo ideas: turn any word into a clean dot-and-dash design"
Link each pin to the relevant `/<word>-in-morse-code/` or
`/morse-bracelet/` page. Pinterest is a slow burn but huge for this niche.

---

## 6. Directories & aggregators (one-time, evergreen)

Submit the site (free listings):
- AlternativeTo (as an alternative to other Morse translators)
- There's An AI For That / tool directories that take utilities
- FreeTools / "awesome" GitHub lists for ham radio & education
- Reddit r/InternetIsBeautiful (one strong post, follow the rules)
- Educational resource directories (for the teach/worksheets pages)

---

## 7. The embed widget — your evergreen backlink engine ⭐

`/embed/` lets any site drop the translator in via one iframe, and the
widget already carries a "Powered by MorseCodeGenerator.com" backlink — so
**every embed is a link.** This scales without you posting anything.

To activate it:
- Add a short "Put this on your site" pitch on `/embed/` (done) and mention
  it in the Reddit/forum posts above ("you can embed it free").
- Reach out to teacher-resource sites, ham club sites, and STEM blogs
  offering the free embeddable widget — they get a feature, you get a link.

**Outreach email template:**
> Subject: Free Morse code translator widget for [their site]
>
> Hi [name], I run MorseCodeGenerator.com — a free, privacy-friendly Morse
> toolkit. I noticed your [page/article] on [topic]. I have a one-line
> embeddable translator your readers could use right on the page (no ads in
> it, works offline). Totally free — embed code here:
> https://morsecodegenerator.com/embed/ . Happy to tailor it. 73/thanks,
> [you]

---

## What I (the codebase/agent) can keep doing to help

- Keep the flagship pages genuinely link-worthy (depth, original tools).
- Maintain the embed widget's backlink + make it easy to adopt.
- Turn any Search Console / analytics data you paste into specific actions.
- Build the next genuinely-paid product (a Koch-method **audio course**)
  once distribution brings an audience.

What I **can't** do: log into your Google accounts, or post to these
communities for you. Those are yours — this doc makes them 20 minutes of
copy-paste each.

Sources for target communities:
- Reddit: r/amateurradio, r/morse, r/teachers, r/InternetIsBeautiful
- QRZ.com forums, eHam.net, CWops
