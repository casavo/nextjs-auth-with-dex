import { setCookies } from "../utils/cookies";

// FIXME: add types

export const logoutHandlerFactory = (
  settings: any,
  sessionSettings: any,
  clientProvider: any,
  store: any
) => {
  return async function logoutHandler(req: any, res: any) {
    if (!req) {
      throw new Error("Request is not available");
    }

    if (!res) {
      throw new Error("Response is not available");
    }

    const session = await store.read(req);
    let endSessionUrl;
    try {
      const client = await clientProvider();
      endSessionUrl = client.endSessionUrl({
        id_token_hint: session ? session.idToken : undefined,
        post_logout_redirect_uri: settings.postLogoutRedirectUri,
      });

      // Also revoke current Access Token
      await client.revoke(session.accessToken, "Bearer");
    } catch (err) {
      throw err;
    }

    // Remove the cookies
    setCookies(req, res, [
      {
        value: "",
        maxAge: -1,
        name: "rp:state",
        path: sessionSettings.cookiePath,
        domain: sessionSettings.cookieDomain,
      },
      {
        value: "",
        maxAge: -1,
        name: sessionSettings.cookieName,
        path: sessionSettings.cookiePath,
        domain: sessionSettings.cookieDomain,
      },
    ]);

    // Redirect to the logout endpoint.
    res.writeHead(302, {
      Location: endSessionUrl,
    });
    res.end();
  };
};
