import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('rebuild');
const WORDS_DIR = path.join(ROOT, 'words');

const bannedPublicPhrases = [
  'SEO Word Target',
  'automatically generated from the repository keyword dataset',
  'debug',
  'internal note'
];

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`✅ ${message}`);
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function matchOrFail(text, regex, label) {
  const match = text.match(regex);
  if (!match) fail(`${label} missing`);
  return match[1] || match[0];
}

function main() {
  if (!fs.existsSync(WORDS_DIR)) {
    fail('rebuild words directory missing');
  }

  const files = fs.readdirSync(WORDS_DIR).filter((file) => file.endsWith('.html'));
  if (files.length < 300) {
    fail(`expected at least 300 word pages, found ${files.length}`);
  }

  const seenTitles = new Map();
  const seenDescriptions = new Map();

  for (const file of files) {
    const html = read(path.join(WORDS_DIR, file));
    const title = matchOrFail(html, /<title>([^<]+)<\/title>/i, `${file}: title`);
    const description = matchOrFail(
      html,
      /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,
      `${file}: meta description`
    );

    if (description.length < 90 || description.length > 180) {
      fail(`${file}: meta description length out of range (${description.length})`);
    }

    if (!html.includes('Frequently asked questions')) {
      fail(`${file}: FAQ section missing`);
    }

    if (!html.includes('Related keyword pages')) {
      fail(`${file}: related-links section missing`);
    }

    if (!html.includes('meta name="intent"')) {
      fail(`${file}: intent meta missing`);
    }

    if (html.includes('N/A')) {
      fail(`${file}: contains N/A placeholder`);
    }

    for (const phrase of bannedPublicPhrases) {
      if (html.includes(phrase)) {
        fail(`${file}: contains internal/public-leak phrase (${phrase})`);
      }
    }

    if (seenTitles.has(title)) {
      fail(`${file}: duplicate title with ${seenTitles.get(title)}`);
    }
    seenTitles.set(title, file);

    if (seenDescriptions.has(description)) {
      fail(`${file}: duplicate meta description with ${seenDescriptions.get(description)}`);
    }
    seenDescriptions.set(description, file);
  }

  const keywordsPage = read(path.join(ROOT, 'pages', 'keywords.html'));
  if (keywordsPage.includes('Morse SEO Keywords Index')) {
    fail('keywords page still contains internal SEO-index heading');
  }

  if (keywordsPage.includes('repository keyword dataset')) {
    fail('keywords page contains internal-generation wording');
  }

  pass(`SEO QA passed for ${files.length} generated word pages`);
}

main();
