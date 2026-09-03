import { defineConfig } from 'astro/config';

// Served at the domain root via GitHub Pages custom domain (public/CNAME).
// If you instead deploy as a project page (username.github.io/Northend)
// with no custom domain, set base: '/Northend' below and prefix internal
// links accordingly, then delete public/CNAME.
export default defineConfig({
  site: 'https://northendtechnology.com',
  output: 'static',
  trailingSlash: 'never',
});
