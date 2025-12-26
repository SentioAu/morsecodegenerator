import sitemap from "@astrojs/sitemap";

/** @type {import('astro').AstroUserConfig} */
export default {
  site: "https://morsecodegenerator.com",
  integrations: [sitemap()],
  trailingSlash: "always",
};
