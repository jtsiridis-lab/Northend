import { createAuth0Client } from '@auth0/auth0-spa-js';

let clientPromise = null;

function getAuth0Client() {
  if (!clientPromise) {
    clientPromise = createAuth0Client({
      domain: import.meta.env.PUBLIC_AUTH0_DOMAIN,
      clientId: import.meta.env.PUBLIC_AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: import.meta.env.PUBLIC_AUTH0_REDIRECT_URI || window.location.origin + '/',
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

export async function login() {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: { screen_hint: 'login' },
  });
}

/** Routes to the Auth0 Universal Login signup screen, which triggers the
 * Post-User-Registration Action that syncs the new subscriber to Kit. */
export async function signUp() {
  const client = await getAuth0Client();
  await client.loginWithRedirect({
    authorizationParams: { screen_hint: 'signup' },
  });
}

export async function logout() {
  const client = await getAuth0Client();
  await client.logout({
    logoutParams: { returnTo: window.location.origin + '/' },
  });
}
