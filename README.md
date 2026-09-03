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
| `PUBLIC_AUTH0_REDIRECT_URI`   | Callback URL, e.g. `https://northendtechnology.com/` |
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

This repo currently assumes a **custom domain** (`public/CNAME` is set to
`northendtechnology.com`), so all internal links are root-relative
(`/playbooks/ebitda-defense`, etc.). If you're deploying as a project page
instead (`username.github.io/Northend`, no custom domain):

1. Delete `public/CNAME`.
2. Set `base: '/Northend'` in `astro.config.mjs`.
3. Prefix internal links with the base path, or use Astro's `base`-aware
   helpers, so routing resolves correctly.

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
