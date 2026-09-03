/**
 * Auth0 Action — Trigger: Post User Registration
 *
 * Not deployed by this repo's build/CI. Paste this into the Auth0 Dashboard
 * under Actions > Library > Build Custom (Trigger: Post User Registration),
 * then add it to the "post-user-registration" flow.
 *
 * Configure these as Action Secrets (Auth0 Dashboard > Actions > this
 * Action > Settings > Secrets) — never commit real values:
 *   KIT_API_KEY   - Kit (ConvertKit) API key
 *   KIT_FORM_ID   - Kit form/sequence ID new subscribers should join
 *
 * This runs after signup completes, so a failure here must never block
 * the user's registration — errors are caught and logged only.
 */
exports.onExecutePostUserRegistration = async (event, api) => {
  const KIT_API_KEY = event.secrets.KIT_API_KEY;
  const KIT_FORM_ID = event.secrets.KIT_FORM_ID;

  if (!KIT_API_KEY || !KIT_FORM_ID) {
    console.log('Kit sync skipped: KIT_API_KEY or KIT_FORM_ID secret not configured');
    return;
  }

  const email = event.user.email;
  const name = event.user.name || event.user.given_name || undefined;

  if (!email) {
    return;
  }

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: KIT_API_KEY,
        email,
        first_name: name,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.log(`Kit subscribe failed (${response.status}): ${body}`);
    }
  } catch (err) {
    console.log(`Kit subscribe request errored: ${err.message}`);
  }
};
