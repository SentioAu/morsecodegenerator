import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const rebuildDir = path.join(repoRoot, 'rebuild');
const wordsDir = path.join(rebuildDir, 'words');
const seoFile = path.join(repoRoot, 'src', 'data', 'seo-slugs.json');
const morseFile = path.join(repoRoot, 'src', 'data', 'morse.json');
const blogIndexFile = path.join(rebuildDir, 'blog', 'blog-index.json');

const slugs = JSON.parse(await fs.readFile(seoFile, 'utf8'));
const morseData = JSON.parse(await fs.readFile(morseFile, 'utf8'));
const map = morseData.morseMap || {};

const INTENT_BUCKETS = {
  emergency: new Set(['danger', 'safe', 'help', 'sos', 'emergency', 'ready', 'warning']),
  education: new Set(['learn', 'study', 'example', 'question', 'practice', 'school', 'read', 'spell'])
};

const toMorse = (text) =>
  text
    .toUpperCase()
    .split('')
    .map((c) => map[c] ?? '')
    .filter(Boolean)
    .join(' ')
    .replace(/\s+\/\s+/g, ' / ');

const titleize = (s) => s.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());

const inferIntent = (slug) => {
  if (INTENT_BUCKETS.emergency.has(slug)) return 'emergency';
  if (INTENT_BUCKETS.education.has(slug)) return 'education';
  return 'general';
};

const neighbors = (items, index, span = 2) => {
  const out = [];
  for (let i = Math.max(0, index - span); i <= Math.min(items.length - 1, index + span); i += 1) {
    if (i !== index) out.push(items[i]);
  }
  return out;
};

const qualityErrors = [];
const assertQuality = (condition, message) => {
  if (!condition) qualityErrors.push(message);
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const buildIntentBlocks = ({ intent, term, morse }) => {
  if (intent === 'emergency') {
    return {
      intro: `For emergency communication, <strong>${term}</strong> in Morse is <strong>${morse}</strong>. Keep this pattern memorized and test playback speed for high-stress conditions.`,
      usageTitle: 'Emergency usage',
      usageBody: `Use the translator for <strong>${term}</strong> and rehearse with short message bursts so recognition stays fast.`,
      tipTitle: 'Signal reliability tip',
      tipBody: 'Practice with both visual and audio playback and verify spacing between letters and words before relying on it in drills.',
      exampleLabel: 'Emergency drill example',
      exampleText: `${term.toUpperCase()} NEED HELP`
    };
  }

  if (intent === 'education') {
    return {
      intro: `Use this page to learn <strong>${term}</strong> in Morse: <strong>${morse}</strong>. Pair it with phrase exercises to improve recall.`,
      usageTitle: 'Learning usage',
      usageBody: `Translate <strong>${term}</strong> and compare symbol-by-symbol output to understand pattern construction.`,
      tipTitle: 'Study tip',
      tipBody: 'Repeat the sequence in spaced sessions and combine this term with adjacent keyword pages for progressive learning.',
      exampleLabel: 'Practice example',
      exampleText: `Practice ${term} three times, then test recognition audio.`
    };
  }

  return {
    intro: `Morse for <strong>${term}</strong> is shown below. Use this as a quick reference or jump to the translator for practice.`,
    usageTitle: 'Usage example',
    usageBody: `Type <strong>${term}</strong> in the translator to compare text and Morse forms and verify spacing rules.`,
    tipTitle: 'Practice tip',
    tipBody: 'Repeat this sequence in short sessions, then combine it with common phrases for better retention.',
    exampleLabel: 'Quick example',
    exampleText: `Translate ${term} and copy the output to your notes.`
  };
};


const buildRichGuidance = ({ intent, term, morse }) => {
  const mistakes = [
    `Skipping symbol spacing in ${term} and merging letters into one long signal.`,
    `Reading ${morse} too fast before you can identify each character cleanly.`
  ];

  if (intent === 'emergency') {
    return {
      usageContext: `${term} is useful in emergency drills where short, recognizable words improve communication speed.`,
      mistakes: [
        `Using ${term} without a clear pause between words, which can cause misreads under stress.`,
        'Not practicing both visual and audio recognition before relying on emergency signaling.'
      ]
    };
  }

  if (intent === 'education') {
    return {
      usageContext: `${term} is a strong study target because you can validate it quickly in text, audio, and symbol form.`,
      mistakes: [
        `Memorizing ${term} as dots/dashes only without listening to rhythm.`,
        'Practicing only once instead of repeating in short spaced sessions.'
      ]
    };
  }

  return {
    usageContext: `${term} works well as a quick-reference term while building fluency with common Morse vocabulary.`,
    mistakes
  };
};

const buildFaq = ({ intent, term, morse }) => {
  const base = [
    {
      q: `What is ${term} in Morse code?`,
      a: `${term} in Morse code is ${morse}.`
    },
    {
      q: `How do I practice ${term} in Morse code?`,
      a: `Use the translator page to generate ${term}, then repeat the pattern in short sessions.`
    }
  ];

  if (intent === 'emergency') {
    base.push({
      q: `Why is ${term} important for emergency signaling?`,
      a: `${term} can be used in urgent communication drills where concise, recognizable signals matter.`
    });
  } else if (intent === 'education') {
    base.push({
      q: `Is ${term} good for Morse beginners?`,
      a: `${term} works well for learning because it can be compared in text and Morse form with immediate feedback.`
    });
  } else {
    base.push({
      q: `Where can I translate full phrases after learning ${term}?`,
      a: 'Use the translator and phrase pages to move from single terms into longer Morse practice sessions.'
    });
  }

  return base;
};

await fs.mkdir(wordsDir, { recursive: true });

const urls = [
  'https://morsecodegenerator.com/',
  'https://morsecodegenerator.com/pages/translate.html',
  'https://morsecodegenerator.com/pages/phrases.html',
  'https://morsecodegenerator.com/pages/about.html',
  'https://morsecodegenerator.com/pages/contact.html',
  'https://morsecodegenerator.com/pages/keywords.html'
];

const cleanedSlugs = [...new Set(slugs.map((raw) => String(raw).trim().toLowerCase()).filter(Boolean))];
const generated = cleanedSlugs.map((slug) => {
  const term = titleize(slug);
  const morse = toMorse(term);
  const intent = inferIntent(slug);
  const url = `https://morsecodegenerator.com/words/${slug}.html`;
  return { slug, term, morse, intent, url };
});

for (const [index, entry] of generated.entries()) {
  const { slug, term, morse, intent } = entry;
  const related = neighbors(generated, index, 2);

  assertQuality(Boolean(morse), `[${slug}] missing Morse output`);
  const description = `${term} in Morse code is ${morse}. Copy, listen, and practice ${term} quickly with our translator and drills.`;
  assertQuality(description.length >= 90 && description.length <= 180, `[${slug}] meta description length out of range: ${description.length}`);
  assertQuality(!related.some((x) => x.slug === slug), `[${slug}] related links includes itself`);

  const blocks = buildIntentBlocks({ intent, term: escapeHtml(term), morse: escapeHtml(morse) });
  const faqItems = buildFaq({ intent, term: escapeHtml(term), morse: escapeHtml(morse) });
  const guidance = buildRichGuidance({ intent, term: escapeHtml(term), morse: escapeHtml(morse) });
  const relatedMarkup = related
    .map((item) => `<a class="pill" href="../words/${item.slug}.html">${escapeHtml(item.term)}</a>`)
    .join('\n        ');

  const faqMarkup = faqItems
    .map(
      (item) => `<details><summary>${escapeHtml(item.q)}</summary><p class="muted">${escapeHtml(item.a)}</p></details>`
    )
    .join('\n      ');

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(term)} in Morse Code | Morse Code Generator</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="https://morsecodegenerator.com/words/${slug}.html" />
  <meta name="intent" content="${intent}" />
  <meta property="og:title" content="${escapeHtml(term)} in Morse Code" />
  <meta property="og:description" content="${escapeHtml(term)} in Morse code: ${escapeHtml(morse)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://morsecodegenerator.com/words/${slug}.html" />
  <meta property="og:image" content="https://morsecodegenerator.com/og-image.svg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/styles.css" />
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"DefinedTerm","name":"${escapeHtml(term)} in Morse code","description":"${escapeHtml(term)} in Morse code is ${escapeHtml(morse)}.","url":"https://morsecodegenerator.com/words/${slug}.html"}</script>
  <script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
</head>
<body>
  <a class="skip-link" href="#content">Skip to content</a>
  <header class="topbar">
    <a class="brand" href="../index.html"><img src="../assets/logo.svg" alt="Morse Code Generator logo" /><span>Morse Code Generator</span></a>
    <nav class="nav" aria-label="Primary">
      <a href="../index.html">Home</a>
      <a href="../pages/translate.html">Translator</a>
      <a href="../pages/phrases.html">Phrases</a>
      <a href="../pages/keywords.html">Keywords</a>
      <a href="../pages/about.html">About</a>
    </nav>
    <button id="themeToggle" class="btn ghost" aria-label="Toggle theme">Theme</button>
  </header>

  <main class="container" id="content">
    <section class="card">
      <p class="eyebrow">Morse Reference</p>
      <h1>${escapeHtml(term)} in Morse Code</h1>
      <p class="muted">${blocks.intro}</p>
      <div class="pill-grid"><span class="pill">${escapeHtml(morse)}</span></div>
      <div class="actions">
        <a class="btn primary" href="../pages/translate.html?q=${encodeURIComponent(term)}">Translate ${escapeHtml(term)}</a>
        <a class="btn ghost" href="../pages/keywords.html">Browse keyword pages</a>
      </div>
    </section>

    <section class="card grid2">
      <article>
        <h2>${blocks.usageTitle}</h2>
        <p class="muted">${blocks.usageBody}</p>
      </article>
      <article>
        <h2>${blocks.tipTitle}</h2>
        <p class="muted">${blocks.tipBody}</p>
      </article>
    </section>

    <section class="card">
      <h2>${blocks.exampleLabel}</h2>
      <p class="muted">${escapeHtml(blocks.exampleText)}</p>
      <p class="muted">Morse output: <strong>${escapeHtml(toMorse(blocks.exampleText) || morse)}</strong></p>
    </section>

    <section class="card grid2">
      <article>
        <h2>Where this is useful</h2>
        <p class="muted">${escapeHtml(guidance.usageContext)}</p>
      </article>
      <article>
        <h2>Common mistakes to avoid</h2>
        <ul class="muted">
          <li>${escapeHtml(guidance.mistakes[0])}</li>
          <li>${escapeHtml(guidance.mistakes[1])}</li>
        </ul>
      </article>
    </section>

    <section class="card">
      <h2>Frequently asked questions</h2>
      ${faqMarkup}
    </section>

    <section class="card">
      <h2>Related keyword pages</h2>
      <p class="muted">Continue practice with nearby keyword targets to strengthen recognition patterns.</p>
      <div class="pill-grid">
        ${relatedMarkup}
      </div>
    </section>
  </main>

  <footer class="site-footer">Project By <a href="https://sentioaurum.com" target="_blank" rel="noopener noreferrer">SentioAurum.com</a></footer>
  <script src="../assets/app.js"></script>
</body>
</html>`;

  await fs.writeFile(path.join(wordsDir, `${slug}.html`), html, 'utf8');
  urls.push(entry.url);
}

if (qualityErrors.length > 0) {
  throw new Error(`Quality checks failed:\n- ${qualityErrors.join('\n- ')}`);
}

const keywordsPage = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Morse Code Keywords Index | ${generated.length} Target Terms</title>
  <meta name="description" content="Explore ${generated.length} keyword-targeted Morse pages with direct translation and practice links." />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="https://morsecodegenerator.com/pages/keywords.html" />
  <link rel="stylesheet" href="../assets/styles.css" />
</head>
<body>
  <a class="skip-link" href="#content">Skip to content</a>
  <header class="topbar">
    <a class="brand" href="../index.html"><img src="../assets/logo.svg" alt="Morse Code Generator logo" /><span>Morse Code Generator</span></a>
    <nav class="nav" aria-label="Primary">
      <a href="../index.html">Home</a>
      <a href="./translate.html">Translator</a>
      <a href="./phrases.html">Phrases</a>
      <a class="active" href="./keywords.html">Keywords</a>
      <a href="./about.html">About</a>
    </nav>
    <button id="themeToggle" class="btn ghost" aria-label="Toggle theme">Theme</button>
  </header>

  <main class="container" id="content">
    <section class="card">
      <h1>Morse Code Word Library</h1>
      <p class="muted">Browse our curated Morse reference words with direct links to translation and guided practice pages.</p>
      <div class="pill-grid">
        ${generated.map((g) => `<a class="pill" href="../words/${g.slug}.html">${escapeHtml(g.term)}</a>`).join('\n        ')}
      </div>
    </section>
  </main>

  <footer class="site-footer">Project By <a href="https://sentioaurum.com" target="_blank" rel="noopener noreferrer">SentioAurum.com</a></footer>
  <script src="../assets/app.js"></script>
</body>
</html>`;

await fs.writeFile(path.join(rebuildDir, 'pages', 'keywords.html'), keywordsPage, 'utf8');


let blogUrls = [];
try {
  const blogIndex = JSON.parse(await fs.readFile(blogIndexFile, 'utf8'));
  blogUrls = [blogIndex.hub, ...(blogIndex.posts || []).map((post) => post.url)];
  urls.push(...blogUrls);
} catch {
  // blog index is optional when generator is run standalone
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`;
await fs.writeFile(path.join(rebuildDir, 'sitemap.xml'), sitemap, 'utf8');

const aiContentIndex = {
  version: 2,
  generatedAt: new Date().toISOString(),
  canonical: 'https://morsecodegenerator.com/',
  keywordsIndex: 'https://morsecodegenerator.com/pages/keywords.html',
  totalPages: generated.length,
  intents: generated.reduce((acc, item) => {
    acc[item.intent] = (acc[item.intent] || 0) + 1;
    return acc;
  }, {}),
  templateFeatures: ['intent-snippets', 'example-block', 'faq-block', 'related-links'],
  pages: generated.map((item) => ({
    slug: item.slug,
    term: item.term,
    intent: item.intent,
    url: item.url,
    morse: item.morse
  }))
};
await fs.writeFile(path.join(rebuildDir, 'ai-content-index.json'), `${JSON.stringify(aiContentIndex, null, 2)}\n`, 'utf8');

const llms = `# Morse Code Generator\n\nThis website provides:\n- text to Morse translation\n- Morse to text decoding\n- keyword-specific Morse pages\n- phrase practice workflows\n\nCanonical: https://morsecodegenerator.com/\nKeywords index: https://morsecodegenerator.com/pages/keywords.html\nAI content index: https://morsecodegenerator.com/ai-content-index.json\nBlog hub: https://morsecodegenerator.com/blog/index.html\nGenerated pages: ${generated.length}\nGenerated blog URLs: ${blogUrls.length}\nIntent buckets: ${Object.entries(aiContentIndex.intents)
  .map(([name, count]) => `${name}=${count}`)
  .join(', ')}\nTemplate features: ${aiContentIndex.templateFeatures.join(', ')}\n`;
await fs.writeFile(path.join(rebuildDir, 'llms.txt'), llms, 'utf8');

console.log(`Generated ${generated.length} keyword pages, keywords index, sitemap, llms.txt, and ai-content-index.json`);
