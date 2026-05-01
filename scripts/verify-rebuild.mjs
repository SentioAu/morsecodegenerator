import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('rebuild');

function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ ${msg}`);
    process.exit(1);
  }
  console.log(`✅ ${msg}`);
}

function read(p) {
  return fs.readFileSync(p, 'utf8');
}

function exists(p, label) {
  assert(fs.existsSync(p), `${label} exists`);
}

function mustContain(text, token, label) {
  assert(text.includes(token), `${label} contains ${token}`);
}

function verifyPage(pagePath, label) {
  const html = read(pagePath);
  assert(/<h1(\s|>)/i.test(html), `${label}: has h1`);
  assert(/rel=["']canonical["']/i.test(html), `${label}: has canonical`);
  assert(/meta\s+name=["']robots["']/i.test(html), `${label}: has robots meta`);
}

function main() {
  exists(ROOT, 'rebuild root');

  const coreFiles = [
    ['index.html', 'homepage'],
    ['pages/translate.html', 'translate page'],
    ['pages/phrases.html', 'phrases page'],
    ['pages/about.html', 'about page'],
    ['pages/contact.html', 'contact page'],
    ['pages/keywords.html', 'keywords index'],
    ['robots.txt', 'robots'],
    ['sitemap.xml', 'sitemap'],
    ['llms.txt', 'llms.txt'],
    ['ai-content-index.json', 'AI content index'],
    ['blog/index.html', 'blog hub'],
    ['blog/blog-index.json', 'blog machine index'],
    ['blog/rss.xml', 'blog rss'],
    ['_redirects', 'rebuild redirects'],
    ['assets/site.webmanifest', 'manifest']
  ];

  for (const [rel, label] of coreFiles) {
    exists(path.join(ROOT, rel), label);
  }

  verifyPage(path.join(ROOT, 'index.html'), 'home');
  verifyPage(path.join(ROOT, 'pages/translate.html'), 'translate');
  verifyPage(path.join(ROOT, 'pages/phrases.html'), 'phrases');

  const sitemap = read(path.join(ROOT, 'sitemap.xml'));
  mustContain(sitemap, '<loc>https://morsecodegenerator.com/pages/keywords.html</loc>', 'sitemap');
  mustContain(sitemap, '<loc>https://morsecodegenerator.com/words/help.html</loc>', 'sitemap');
  mustContain(sitemap, '<loc>https://morsecodegenerator.com/blog/index.html</loc>', 'sitemap');

  const llms = read(path.join(ROOT, 'llms.txt'));
  mustContain(llms, 'Keywords index:', 'llms.txt');
  mustContain(llms, 'AI content index:', 'llms.txt');

  const aiIndex = read(path.join(ROOT, 'ai-content-index.json'));
  mustContain(aiIndex, '"intents"', 'ai-content-index.json');

  const blogIndex = read(path.join(ROOT, 'blog', 'blog-index.json'));
  mustContain(blogIndex, '"totalPosts"', 'blog index');

  const redirects = read(path.join(ROOT, '_redirects'));
  mustContain(redirects, '/translate/                /pages/translate.html', '_redirects');
  mustContain(redirects, '/a-in-morse-code/          /words/a.html', '_redirects');

  const wordsDir = path.join(ROOT, 'words');
  const wordFiles = fs.readdirSync(wordsDir).filter((f) => f.endsWith('.html'));
  assert(wordFiles.length >= 300, 'generated word pages count >= 300');

  const helpWord = read(path.join(wordsDir, 'help.html'));
  mustContain(helpWord, 'Related keyword pages', 'help word page');
  mustContain(helpWord, 'meta name="intent"', 'help word page');

  console.log('✅ verify-rebuild: all checks passed');
}

main();
