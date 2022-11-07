import { createAuthHandlers } from "nextjs-oidc";
// import config from './config';

export default createAuthHandlers({
  clientId: "app-with-secret",
  clientSecret: "ZXhhbXBsZS1hcHAtc2VjcmV0",
  // clientSecret: "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",
  audience: "my-next-app",
  issuer: "http://127.0.0.1:4433/dex",
  scope: "openid profile offline_access email groups",
  postLogoutRedirectUri: "http://localhost:3000/login",
  // redirectUri: "http://127.0.0.1:4433/dex/callback",
  redirectUri: "http://localhost:3000/api/callback",
  session: {
    // The secret used to encrypt the cookie.
    cookieSecret: "<RANDOMLY_GENERATED_SECRET><RANDOMLY_GENERATED_SECRET>",
    // The cookie lifetime (expiration) in seconds. Set to 8 hours by default.
    cookieLifetime: 60 * 60 * 8,
    // (Optional) The cookie domain this should run on. Leave it blank to restrict it to your domain.
    // cookieDomain: "your-domain.com",
    // (Optional) SameSite configuration for the session cookie. Defaults to 'lax', but can be changed to 'strict' or 'none'. Set it to false if you want to disable the SameSite setting.
    cookieSameSite: "lax",
    // (Optional) Store the id_token in the session. Defaults to false.
    storeIdToken: false,
    // (Optional) Store the access_token in the session. Defaults to false.
    storeAccessToken: true,
    // (Optional) Store the refresh_token in the session. Defaults to false.
    storeRefreshToken: true,
  },
  oidcClient: {
    // (Optional) Configure the timeout in milliseconds for HTTP requests to Auth0.
    httpTimeout: 2500,
    // (Optional) Configure the clock tolerance in milliseconds, if the time on your server is running behind.
    clockTolerance: 10000,
  },
});
