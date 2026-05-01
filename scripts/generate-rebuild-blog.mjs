import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const rebuildDir = path.join(repoRoot, 'rebuild');
const blogDir = path.join(rebuildDir, 'blog');
const topicsFile = path.join(repoRoot, 'src', 'data', 'blog-topics.json');

const topics = JSON.parse(await fs.readFile(topicsFile, 'utf8'));
await fs.mkdir(blogDir, { recursive: true });

const toDate = () => new Date().toISOString().slice(0, 10);
const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const slugToUrl = (slug) => `https://morsecodegenerator.com/blog/${slug}.html`;

const posts = topics.map((topic, i) => ({
  ...topic,
  publishDate: toDate(),
  readingMinutes: 6 + (i % 3),
  url: slugToUrl(topic.slug)
}));

const relatedFor = (index) => {
  const out = [];
  for (let i = Math.max(0, index - 2); i <= Math.min(posts.length - 1, index + 2); i += 1) {
    if (i !== index) out.push(posts[i]);
  }
  return out.slice(0, 3);
};

for (const [index, post] of posts.entries()) {
  const related = relatedFor(index);
  const checklist = post.takeaways.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n          ');
  const relatedLinks = related
    .map((item) => `<li><a href="./${item.slug}.html">${escapeHtml(item.title)}</a></li>`)
    .join('\n          ');

  const faq = [
    {
      q: `What is the fastest way to improve at ${post.primaryKeyword}?`,
      a: `Use short daily sessions, track mistakes, and keep speed increases gradual so accuracy remains high.`
    },
    {
      q: `How long should I practice this topic each day?`,
      a: `Start with 10–20 focused minutes and increase only when your error rate is stable.`
    }
  ];

  const faqMarkup = faq
    .map((item) => `<details><summary>${escapeHtml(item.q)}</summary><p class="muted">${escapeHtml(item.a)}</p></details>`)
    .join('\n        ');

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    author: {
      '@type': 'Organization',
      name: 'SentioAurum'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Morse Code Generator'
    },
    mainEntityOfPage: post.url,
    description: post.description
  };

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(post.title)} | Morse Code Generator Blog</title>
  <meta name="description" content="${escapeHtml(post.description)}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="${post.url}" />
  <meta property="og:title" content="${escapeHtml(post.title)}" />
  <meta property="og:description" content="${escapeHtml(post.description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${post.url}" />
  <meta property="og:image" content="https://morsecodegenerator.com/og-image.svg" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/styles.css" />
  <script type="application/ld+json">${JSON.stringify(articleJsonLd)}</script>
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
      <a href="./index.html" class="active">Blog</a>
      <a href="../pages/about.html">About</a>
    </nav>
    <button id="themeToggle" class="btn ghost" aria-label="Toggle theme">Theme</button>
  </header>

  <main class="container" id="content">
    <article class="card">
      <p class="eyebrow">Blog · ${escapeHtml(post.intent)}</p>
      <h1>${escapeHtml(post.title)}</h1>
      <p class="muted">${escapeHtml(post.description)}</p>
      <p class="muted">Audience: <strong>${escapeHtml(post.audience)}</strong> · Reading time: ~${post.readingMinutes} min</p>
    </article>

    <section class="card grid2">
      <article>
        <h2>Practical checklist</h2>
        <ul class="muted">
          ${checklist}
        </ul>
      </article>
      <article>
        <h2>Execution plan</h2>
        <p class="muted">Run 3 focused sessions per week, log mistakes after each session, and review missed patterns before increasing speed.</p>
        <p class="muted">Use the translator for single-term accuracy and phrase drills for transfer to realistic communication flow.</p>
      </article>
    </section>

    <section class="card">
      <h2>Frequently asked questions</h2>
      ${faqMarkup}
    </section>

    <section class="card">
      <h2>Related articles</h2>
      <ul class="muted">
          ${relatedLinks}
      </ul>
      <p><a class="btn primary" href="../pages/translate.html">Practice in translator</a></p>
    </section>
  </main>

  <footer class="site-footer">Project By <a href="https://sentioaurum.com" target="_blank" rel="noopener noreferrer">SentioAurum.com</a></footer>
  <script src="../assets/app.js"></script>
</body>
</html>`;

  await fs.writeFile(path.join(blogDir, `${post.slug}.html`), html, 'utf8');
}

const blogIndex = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Morse Code Blog | Tactical Guides, Drills, and Learning Systems</title>
  <meta name="description" content="Read practical Morse code guides covering emergency communication, learning systems, and focused practice workflows." />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="https://morsecodegenerator.com/blog/index.html" />
  <link rel="stylesheet" href="../assets/styles.css" />
</head>
<body>
  <a class="skip-link" href="#content">Skip to content</a>
  <header class="topbar">
    <a class="brand" href="../index.html"><img src="../assets/logo.svg" alt="Morse Code Generator logo" /><span>Morse Code Generator</span></a>
    <nav class="nav" aria-label="Primary">
      <a href="../index.html">Home</a>
      <a href="../pages/translate.html">Translator</a>
      <a href="../pages/phrases.html">Phrases</a>
      <a href="./index.html" class="active">Blog</a>
      <a href="../pages/about.html">About</a>
    </nav>
    <button id="themeToggle" class="btn ghost" aria-label="Toggle theme">Theme</button>
  </header>

  <main class="container" id="content">
    <section class="card">
      <h1>Morse Code Blog</h1>
      <p class="muted">High-value tactical guides designed to improve retention, speed, and real-world Morse communication outcomes.</p>
      <div class="stack">
        ${posts
          .map(
            (post) => `<article class="card"><h2><a href="./${post.slug}.html">${escapeHtml(post.title)}</a></h2><p class="muted">${escapeHtml(post.description)}</p><p class="muted">Keyword: ${escapeHtml(post.primaryKeyword)} · ${escapeHtml(post.intent)}</p></article>`
          )
          .join('\n        ')}
      </div>
    </section>
  </main>

  <footer class="site-footer">Project By <a href="https://sentioaurum.com" target="_blank" rel="noopener noreferrer">SentioAurum.com</a></footer>
  <script src="../assets/app.js"></script>
</body>
</html>`;

await fs.writeFile(path.join(blogDir, 'index.html'), blogIndex, 'utf8');

const blogIndexJson = {
  version: 1,
  generatedAt: new Date().toISOString(),
  hub: 'https://morsecodegenerator.com/blog/index.html',
  totalPosts: posts.length,
  posts: posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    intent: post.intent,
    primaryKeyword: post.primaryKeyword,
    url: post.url,
    publishDate: post.publishDate,
    readingMinutes: post.readingMinutes
  }))
};
await fs.writeFile(path.join(blogDir, 'blog-index.json'), `${JSON.stringify(blogIndexJson, null, 2)}\n`, 'utf8');

const rssItems = posts
  .map(
    (post) => `  <item><title>${escapeHtml(post.title)}</title><link>${post.url}</link><description>${escapeHtml(post.description)}</description><pubDate>${new Date(post.publishDate).toUTCString()}</pubDate><guid>${post.url}</guid></item>`
  )
  .join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Morse Code Generator Blog</title><link>https://morsecodegenerator.com/blog/index.html</link><description>Morse communication guides and practice playbooks.</description>\n${rssItems}\n</channel></rss>\n`;
await fs.writeFile(path.join(blogDir, 'rss.xml'), rss, 'utf8');

console.log(`Generated ${posts.length} blog posts + blog index + blog-index.json + rss.xml`);
