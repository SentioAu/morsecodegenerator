import { defineConfig } from "astro";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://morsecodegenerator.com",
  integrations: [sitemap()],
  trailingSlash: "always",
});
