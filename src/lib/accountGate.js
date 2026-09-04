import { resolveAuth0Session, login, logout } from './auth0';

/**
 * Shared gate for every /account page: wires the Sign In / Sign Out
 * controls, checks the Auth0 session, and toggles the page between its
 * [data-account-gate] (signed-out) and [data-account-content]
 * (signed-in) sections. Defaults to the gate showing and content hidden
 * so protected content never flashes before the check resolves.
 */
export async function gateAccountPage() {
  const gate = document.querySelector('[data-account-gate]');
  const content = document.querySelector('[data-account-content]');

  document.querySelectorAll('[data-account-signin]').forEach((btn) => {
    btn.addEventListener('click', () => login());
  });
  document.querySelectorAll('[data-account-signout]').forEach((btn) => {
    btn.addEventListener('click', () => logout());
  });

  try {
    const { isAuthenticated, user } = await resolveAuth0Session();

    if (isAuthenticated) {
      gate?.setAttribute('hidden', '');
      content?.removeAttribute('hidden');
      document.querySelectorAll('[data-user-name]').forEach((el) => {
        el.textContent = user?.name || user?.email || 'Client User';
      });
      document.querySelectorAll('[data-user-email]').forEach((el) => {
        el.textContent = user?.email || '';
      });
    } else {
      gate?.removeAttribute('hidden');
      content?.setAttribute('hidden', '');
    }
  } catch (err) {
    console.warn('Auth0 session check failed:', err);
    gate?.removeAttribute('hidden');
    content?.setAttribute('hidden', '');
  }
}
