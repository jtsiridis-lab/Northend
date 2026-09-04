import { createAuth0Client } from '@auth0/auth0-spa-js';

let clientPromise = null;

// import.meta.env.BASE_URL has no guaranteed trailing slash, so strip it
// and always join with an explicit "/" — see components for the same pattern.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

function isAuth0Configured() {
  return Boolean(import.meta.env.PUBLIC_AUTH0_DOMAIN && import.meta.env.PUBLIC_AUTH0_CLIENT_ID);
}

function getAuth0Client() {
  if (!clientPromise) {
    clientPromise = createAuth0Client({
      domain: import.meta.env.PUBLIC_AUTH0_DOMAIN,
      clientId: import.meta.env.PUBLIC_AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: import.meta.env.PUBLIC_AUTH0_REDIRECT_URI || `${window.location.origin}${base}/`,
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
    });
  }
  return clientPromise;
}

/**
 * Resolves the current session, completing the Auth0 redirect callback
 * (?code=&state=) on load if one is present, then strips those params
 * from the URL so GitHub Pages routing stays clean.
 */
export async function resolveAuth0Session() {
  const client = await getAuth0Client();
  const query = window.location.search;

  if (query.includes('code=') && query.includes('state=')) {
    await client.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const isAuthenticated = await client.isAuthenticated();
  const user = isAuthenticated ? await client.getUser() : null;
  return { client, isAuthenticated, user };
}

/**
 * Until PUBLIC_AUTH0_DOMAIN / PUBLIC_AUTH0_CLIENT_ID are set (see
 * .env.example and the README), there's no Auth0 tenant to redirect to —
 * so login/signUp send visitors straight to the account page instead of
 * silently failing. That page's own sign-in gate explains the rest.
 */
export async function login() {
  if (!isAuth0Configured()) {
    window.location.href = `${base}/account`;
    return;
  }
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: { screen_hint: 'login' },
  });
}

/** Routes to the Auth0 Universal Login signup screen, which triggers the
 * Post-User-Registration Action that syncs the new subscriber to Kit. */
export async function signUp() {
  if (!isAuth0Configured()) {
    window.location.href = `${base}/account`;
    return;
  }
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: { screen_hint: 'signup' },
  });
}

export async function logout() {
  const client = await getAuth0Client();
  await client.logout({
    logoutParams: { returnTo: `${window.location.origin}${base}/` },
  });
}
