import * as handlers from "./handlers";
import { oidcClientFactory } from "./utils/oidc";
import { CookieSessionStore } from "./session/cookie-store";
import { CookieSessionStoreSettings } from "./session/cookie-store/settings";

// FIXME: add types

export function createAuthHandlers(settings: any) {
  if (!settings.issuer) {
    throw new Error("A valid Issuer must be provided");
  }

  if (!settings.clientId) {
    throw new Error("A valid Client ID must be provided");
  }

  // if (!settings.clientSecret) {
  //   throw new Error("A valid Client Secret must be provided");
  // }

  if (!settings.session) {
    throw new Error("The session configuration is required");
  }

  if (!settings.session.cookieSecret) {
    throw new Error("A valid session cookie secret is required");
  }

  const clientProvider = oidcClientFactory(settings);
  const sessionSettings = new CookieSessionStoreSettings(settings.session);
  const store = new CookieSessionStore(sessionSettings);

  return {
    // getSession: handlers.(store),
    tokenCache: handlers.tokenCacheHandlerFactory(clientProvider, store),
    handleLogin: handlers.loginHandlerFactory(settings, clientProvider),
    handleProfile: handlers.profileHandlerFactory(store, clientProvider),
    handleCallback: handlers.callbackHandlerFactory(
      settings,
      clientProvider,
      store
    ),
    handleLogout: handlers.logoutHandlerFactory(
      settings,
      sessionSettings,
      clientProvider,
      store
    ),
  };
}
