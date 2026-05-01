import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = process.cwd();
const REDIRECTS_PATH = path.join(REPO_ROOT, 'rebuild', '_redirects');
const LEGACY_URLS_PATH = path.join(REPO_ROOT, 'src', 'data', 'legacy-urls.txt');
const REBUILD_ROOT = path.join(REPO_ROOT, 'rebuild');

function normalizeRoute(route) {
  if (!route.startsWith('/')) return `/${route}`;
  return route;
}

function normalizeDestination(route) {
  const clean = route.split('?')[0].split('#')[0];
  if (clean === '/') return '/index.html';
  return clean.endsWith('/') ? `${clean}index.html` : clean;
}

function parseRedirects(contents) {
  return contents
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split(/\s+/))
    .filter((parts) => parts.length >= 3)
    .map(([from, to, status]) => ({
      from: normalizeRoute(from),
      to: normalizeRoute(to),
      status
    }));
}

function parseLegacyUrls(contents) {
  return contents
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => normalizeRoute(line));
}

function exitWithErrors(errors) {
  console.error('\n❌ Redirect coverage check failed.');
  for (const error of errors) {
    console.error(` - ${error}`);
  }
  process.exit(1);
}

function main() {
  if (!fs.existsSync(REDIRECTS_PATH)) {
    throw new Error(`Missing redirects file at ${REDIRECTS_PATH}`);
  }

  if (!fs.existsSync(LEGACY_URLS_PATH)) {
    throw new Error(`Missing legacy URL dataset at ${LEGACY_URLS_PATH}`);
  }

  const redirects = parseRedirects(fs.readFileSync(REDIRECTS_PATH, 'utf8'));
  const legacyUrls = parseLegacyUrls(fs.readFileSync(LEGACY_URLS_PATH, 'utf8'));

  const redirectMap = new Map(redirects.map((entry) => [entry.from, entry]));
  const errors = [];

  for (const legacyRoute of legacyUrls) {
    const redirect = redirectMap.get(legacyRoute);

    if (!redirect) {
      errors.push(`Missing redirect mapping for ${legacyRoute}`);
      continue;
    }

    if (redirect.status !== '301') {
      errors.push(`Redirect for ${legacyRoute} should be 301 (found ${redirect.status})`);
    }

    const destination = normalizeDestination(redirect.to);
    const destinationFile = path.join(REBUILD_ROOT, destination.replace(/^\//, ''));

    if (!fs.existsSync(destinationFile)) {
      errors.push(`Redirect destination does not exist: ${legacyRoute} -> ${redirect.to}`);
    }
  }

  if (errors.length > 0) {
    exitWithErrors(errors);
  }

  console.log(`✅ Redirect coverage verified for ${legacyUrls.length} legacy routes`);
}

main();
