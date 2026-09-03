/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_AUTH0_DOMAIN: string;
  readonly PUBLIC_AUTH0_CLIENT_ID: string;
  readonly PUBLIC_AUTH0_REDIRECT_URI: string;
  readonly PUBLIC_FORMSPREE_FORM_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
