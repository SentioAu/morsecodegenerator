import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('rebuild');
const BLOG_DIR = path.join(ROOT, 'blog');

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

function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    fail('blog directory missing');
  }

  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.html') && file !== 'index.html');
  if (files.length < 5) {
    fail(`expected at least 5 generated blog posts, found ${files.length}`);
  }

  const forbiddenPhrases = ['internal note', 'debug', 'todo', 'placeholder'];

  for (const file of files) {
    const html = read(path.join(BLOG_DIR, file)).toLowerCase();

    if (!html.includes('practical checklist')) {
      fail(`${file}: missing practical checklist section`);
    }
    if (!html.includes('common mistakes') && !html.includes('execution plan')) {
      fail(`${file}: missing actionable guidance sections`);
    }
    if (!html.includes('frequently asked questions')) {
      fail(`${file}: missing FAQ section`);
    }
    if (!html.includes('related articles')) {
      fail(`${file}: missing related articles section`);
    }

    for (const phrase of forbiddenPhrases) {
      if (html.includes(phrase)) {
        fail(`${file}: contains forbidden phrase (${phrase})`);
      }
    }
  }

  const blogHub = read(path.join(BLOG_DIR, 'index.html')).toLowerCase();
  if (!blogHub.includes('morse code blog')) {
    fail('blog hub missing expected h1/title wording');
  }

  pass(`Blog QA passed for ${files.length} generated posts`);
}

main();
