# North End Technology

Product & platform advisory site, built with Astro and deployed to GitHub Pages
via GitHub Actions. Auth0 handles identity; a successful signup fires an Auth0
Action that syncs the subscriber into Kit; the contact form posts to Formspree.

## Stack

- **Astro** (`output: 'static'`) — the whole site prerenders to `/dist`.
- **Auth0 SPA SDK** (`@auth0/auth0-spa-js`) — client-side session state for the
  nav (Sign In / Subscribe vs. My Account / Sign Out).
- **Kit** (formerly ConvertKit) — new subscribers land here via an Auth0
  Post-User-Registration Action (see `auth0-actions/`).
- **Formspree** — contact form submissions route to `info@northendtechnology.com`.

## Local development

Requires Node 20+.

```bash
npm install
cp .env.example .env   # fill in your Auth0 + Formspree values
npm run dev
```

## Environment variables

Set these both locally (`.env`, git-ignored) and as GitHub Actions repo
secrets (Settings > Secrets and variables > Actions) so the deploy workflow
can inject them at build time:

| Variable                     | Description                                    |
| ----------------------------- | ----------------------------------------------- |
| `PUBLIC_AUTH0_DOMAIN`         | Auth0 tenant domain                             |
| `PUBLIC_AUTH0_CLIENT_ID`      | Auth0 SPA application client ID                 |
| `PUBLIC_AUTH0_REDIRECT_URI`   | Callback URL, e.g. `https://jtsiridis-lab.github.io/Northend/` |
| `PUBLIC_FORMSPREE_FORM_ID`    | Formspree form ID                               |

In the Auth0 SPA application settings, add the redirect URI, allowed logout
URL, and allowed web origin as your production URL.

## Kit sync (Auth0 Action)

`auth0-actions/post-registration-kit-sync.js` is reference code, not built by
this repo. Paste it into Auth0 Dashboard > Actions > Library > Build Custom
(trigger: **Post User Registration**), add it to that flow, and set the
Action secrets `KIT_API_KEY` and `KIT_FORM_ID`.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site
and publishes `/dist` to GitHub Pages. In the repo's Settings > Pages, set
the source to **GitHub Actions**.

This repo is currently deployed as a GitHub Pages **project page** at
`https://jtsiridis-lab.github.io/Northend/` (no custom domain live yet), so
`astro.config.mjs` sets `base: '/Northend'` and every internal link is built
from `import.meta.env.BASE_URL` rather than being hardcoded — see
`Navigation.astro`, `Footer.astro`, `BaseLayout.astro`'s favicon link, and
each page's playbook/anchor links.

Once `northendtechnology.com` DNS is pointed at GitHub Pages, switch to a
custom domain:

1. In `astro.config.mjs`, set `site: 'https://northendtechnology.com'` and
   `base: '/'`.
2. Re-add `public/CNAME` containing `northendtechnology.com`.
3. Update `PUBLIC_AUTH0_REDIRECT_URI` (and the Auth0 app's allowed
   callback/logout URLs) to the new domain.

No link changes are needed for that switch — they're all base-aware already.

## Structure

```text
src/
├── components/
│   ├── Navigation.astro
│   ├── Footer.astro
│   └── LayeredArchitectureGraphic.astro
├── layouts/
│   └── BaseLayout.astro
├── lib/
│   └── auth0.js
├── pages/
│   ├── index.astro
│   └── playbooks/
│       ├── ebitda-defense.astro
│       ├── ai-monetization.astro
│       ├── nrr-acceleration.astro
│       └── platform-convergence.astro
└── styles/
    └── global.css
```
