import { Issuer, custom } from "openid-client";

// FIXME: add types

/**
 *
 * @param {Object} settings
 * settings: {
 * ISSUER,
 * CLIENT_ID,
 * CLIENT_SECRET,
 * REDIRECT_URI,
 * }
 */
export const oidcClientFactory = (settings: any) => {
  let client: any = null;
  const clientSettings = settings.oidcClient || {
    httpTimeout: 2500,
  };

  return async function getOrCreateOidcClient() {
    if (client) {
      return client;
    }

    const issuer = await Issuer.discover(settings.issuer);
    client = new issuer.Client({
      response_types: ["code"],
      client_id: settings.clientId,
      client_secret: settings.clientSecret,
      redirect_uris: [settings.redirectUri],
      post_logout_redirect_uris: [settings.postLogoutRedirectUri],
    });

    if (clientSettings.httpTimeout) {
      const timeout = clientSettings.httpTimeout;
      client[custom.http_options] = function setHttpOptions(options: any) {
        return {
          ...options,
          timeout,
        };
      };
    }

    if (clientSettings.clockTolerance) {
      client[custom.clock_tolerance] = clientSettings.clockTolerance / 1000;
    }

    return client;
  };
};
