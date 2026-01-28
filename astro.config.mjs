import { defineConfig } from "astro/config";

const SITE = String(process.env.SITE_URL || "https://morsecodegenerator.com").replace(/\/$/, "");

export default defineConfig({
  site: SITE,
  trailingSlash: "always",
  output: "static",

  // Ensure /route/ => dist/route/index.html (matches your sitemap + redirects)
  build: {
    format: "directory",
  },

  // You already generate sitemap.xml in scripts/postbuild-sitemap.mjs
  // Keeping @astrojs/sitemap enabled can create duplicates or extra sitemap variants.
  integrations: [],
});
