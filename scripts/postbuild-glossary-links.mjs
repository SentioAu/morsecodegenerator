/**
 * Glossary auto-linker
 * ----------------------------------------------------------------
 * Postbuild step that wraps the first whole-word mention of select
 * glossary terms inside article bodies with a link to
 * /glossary/#<anchor>. Operates on dist/ HTML (never modifies source)
 * so the source files stay editable by hand without conflicts.
 *
 * Linkable terms
 *  - length ≥ 4 chars (avoids generic 2/3-letter codes like CW, DX, QSO
 *    that already appear constantly in body text)
 *  - no parenthetical disambiguators (we skip "AR (prosign)" — the bare
 *    "AR" would mis-match the contraction)
 *  - not in a small curated denylist of over-common words
 *
 * Skip zones (we never wrap inside these)
 *  - <a>, <code>, <pre>, <h1>…<h6>
 *  - <aside>, <nav>, <footer> — protects AdSlot, Newsletter, related
 *    posts, tags chips, and any nav region from accidental rewrites
 *
 * Scope
 *  - dist/blog/<slug>/index.html (the long-form articles where extra
 *    glossary links are valuable; reference pages have their own
 *    cross-links already)
 *
 * Output
 *  - Wraps the first match per term per page, up to 5 links per page
 *    (any more is spammy and dilutes the existing curated links)
 */
import fs from "node:fs";
import path from "node:path";

const distRoot = path.resolve("dist");
const glossaryPath = path.resolve("src/pages/glossary.astro");

function log(...args) {
  console.log("[glossary-links]", ...args);
}

// -------------------------------------------------------------------
// 1. Extract canonical term list from the glossary source.
// -------------------------------------------------------------------
function loadTerms() {
  if (!fs.existsSync(glossaryPath)) return [];
  const src = fs.readFileSync(glossaryPath, "utf8");
  const blockMatch = src.match(/const\s+terms\s*=\s*\[([\s\S]*?)\];/);
  if (!blockMatch) return [];
  const out = [];
  const tupleRe = /\[\s*"([^"]+)"\s*,/g;
  let m;
  while ((m = tupleRe.exec(blockMatch[1])) !== null) {
    out.push(m[1]);
  }
  return out;
}

// Anchor slug matches the rule used inside glossary.astro:
//   term.toLowerCase().replace(/[^a-z0-9]+/g, "-")
// Stripping leading/trailing dashes keeps the URL fragment clean.
function toAnchor(term) {
  return String(term).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const DENY = new Set([
  "element", // too generic — appears in HTML/DOM contexts
  "unit",    // collides with CSS / physics
]);

function buildLinkables() {
  const raw = loadTerms();
  return raw
    .filter((t) => !/\(/.test(t))
    .filter((t) => t.length >= 4)
    .filter((t) => !DENY.has(t.toLowerCase()))
    .map((t) => ({ term: t, anchor: toAnchor(t) }))
    // Longest-first so multi-word terms ("Koch method") match before
    // their substrings ("Koch") would.
    .sort((a, b) => b.term.length - a.term.length);
}

// -------------------------------------------------------------------
// 2. HTML-aware first-occurrence wrap.
//
// We walk the slice char-by-char, tracking a tag stack so we know
// whether the current text-node sits inside a skip zone. The first
// whole-word match outside any skip zone wins; we return early.
// -------------------------------------------------------------------
const SKIP_TAGS = new Set([
  "a", "code", "pre",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "aside", "nav", "footer",
]);

// Void elements never push onto the stack (no closing tag exists).
const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wrapFirstOutside(text, term, anchor) {
  const re = new RegExp(`\\b${escapeRegExp(term)}\\b`, "i");
  const stack = [];
  const inSkip = () => stack.some((t) => SKIP_TAGS.has(t));

  let i = 0;
  while (i < text.length) {
    if (text[i] === "<") {
      const end = text.indexOf(">", i);
      if (end < 0) break;
      const raw = text.slice(i + 1, end);
      const isClose = raw.startsWith("/");
      const isSelfClose = raw.endsWith("/");
      const name = raw.replace(/^\//, "").split(/[\s>]/)[0].toLowerCase();

      if (isClose) {
        for (let s = stack.length - 1; s >= 0; s--) {
          if (stack[s] === name) { stack.splice(s, 1); break; }
        }
      } else if (!isSelfClose && !VOID_TAGS.has(name)) {
        stack.push(name);
      }
      i = end + 1;
      continue;
    }

    // We're at a text node. Find its end (next `<`).
    const nextLt = text.indexOf("<", i);
    const segEnd = nextLt < 0 ? text.length : nextLt;

    if (!inSkip()) {
      const seg = text.slice(i, segEnd);
      const match = seg.match(re);
      if (match) {
        const matchStart = i + match.index;
        const matchEnd = matchStart + match[0].length;
        const wrap =
          `<a class="auto-link" href="/glossary/#${anchor}"` +
          ` title="See glossary: ${term.replace(/"/g, "&quot;")}"` +
          ` data-auto-link>${match[0]}</a>`;
        return {
          text: text.slice(0, matchStart) + wrap + text.slice(matchEnd),
          replaced: true,
        };
      }
    }
    i = segEnd;
  }
  return { text, replaced: false };
}

// -------------------------------------------------------------------
// 3. Process every blog article.
// -------------------------------------------------------------------
const ARTICLE_OPEN_RE = /<article\b[^>]*\bclass="[^"]*\bprose\b[^"]*\bblog-post\b[^"]*"[^>]*>/;
const ARTICLE_CLOSE = "</article>";
const MAX_LINKS_PER_PAGE = 5;

function processFile(file, linkables) {
  const html = fs.readFileSync(file, "utf8");
  const openMatch = html.match(ARTICLE_OPEN_RE);
  if (!openMatch) return 0;

  const openIdx = openMatch.index + openMatch[0].length;
  const closeIdx = html.indexOf(ARTICLE_CLOSE, openIdx);
  if (closeIdx < 0) return 0;

  const before = html.slice(0, openIdx);
  let body = html.slice(openIdx, closeIdx);
  const after = html.slice(closeIdx);

  let added = 0;
  const usedAnchors = new Set();
  for (const { term, anchor } of linkables) {
    if (added >= MAX_LINKS_PER_PAGE) break;
    if (usedAnchors.has(anchor)) continue;
    const result = wrapFirstOutside(body, term, anchor);
    if (result.replaced) {
      body = result.text;
      added++;
      usedAnchors.add(anchor);
    }
  }

  if (added > 0) fs.writeFileSync(file, before + body + after, "utf8");
  return added;
}

function listArticles() {
  const blogDir = path.join(distRoot, "blog");
  if (!fs.existsSync(blogDir)) return [];
  const out = [];
  for (const name of fs.readdirSync(blogDir)) {
    if (name === "index.html") continue;
    const p = path.join(blogDir, name, "index.html");
    if (fs.existsSync(p)) out.push(p);
  }
  return out;
}

function main() {
  if (!fs.existsSync(distRoot)) {
    log(`dist not found (${distRoot}); skipping.`);
    return;
  }
  const linkables = buildLinkables();
  if (linkables.length === 0) {
    log("No linkable glossary terms found; skipping.");
    return;
  }

  const files = listArticles();
  if (files.length === 0) {
    log("No blog articles found; skipping.");
    return;
  }

  let totalLinks = 0;
  let touched = 0;
  for (const f of files) {
    const n = processFile(f, linkables);
    if (n > 0) {
      touched++;
      totalLinks += n;
    }
  }

  log(`articles=${files.length} touched=${touched} links-added=${totalLinks}`);
  log(`linkable-terms=${linkables.length}`);
}

main();
