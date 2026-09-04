import { defineConfig } from 'astro/config';

// Currently deployed as a GitHub Pages PROJECT page (no custom domain live
// yet): https://jtsiridis-lab.github.io/Northend/ — hence base: '/Northend'.
// All internal links use import.meta.env.BASE_URL so they resolve correctly
// under that subpath.
//
// Once northendtechnology.com DNS is pointed at GitHub Pages, switch to:
//   site: 'https://northendtechnology.com',
//   base: '/',
// and re-add public/CNAME with that domain — internal links need no changes,
// since they already go through BASE_URL.
export default defineConfig({
  site: 'https://jtsiridis-lab.github.io',
  base: '/Northend',
  output: 'static',
  trailingSlash: 'never',
});
