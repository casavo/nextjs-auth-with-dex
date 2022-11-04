import { decodeState } from "../utils/state";
import { parseCookies } from "../utils/cookies";
import { getSessionFromTokenSet } from "../utils/session";

// FIXME: add types

export function callbackHandlerFactory(
  settings: any,
  clientProvider: any,
  store: any
) {
  return async function callbackHandler(req: any, res: any, options: any) {
    if (!res) {
      throw new Error("Response is not available");
    }

    if (!req) {
      throw new Error("Request is not available");
    }

    // Parse the cookies.
    const parsedCookies = parseCookies(req);

    console.log({ parsedCookies });

    // Require that we have a state.
    const state = parsedCookies["rp:state"];
    if (!state)
      throw new Error("Invalid request, an initial state could not be found");

    // Execute the code exchange
    const client = await clientProvider();
    const params = client.callbackParams(req);

    console.log({ params });

    const tokenSet = await client.callback(settings.redirectUri, params, {
      state,
    });

    console.log({ tokenSet });

    const decodedState = decodeState(state);

    console.log({ decodedState });

    // Get the claims without any OIDC specific claim.
    let session = getSessionFromTokenSet(tokenSet);

    console.log({ session });

    // Run the identity validated hook.
    if (options && options.onUserLoaded) {
      session = await options.onUserLoaded(req, res, session, decodedState);
    }

    // If session included profile then fetch profile and attach to session
    // dex does not include scope info into tokens :(
    if (
      // session.accessTokenScope.includes("email") ||
      // session.accessTokenScope.includes("profile")
      settings.scope.includes("email") &&
      settings.scope.includes("profile")
    ) {
      const user = await client.userinfo(tokenSet);
      if (settings.scope.includes("email")) {
        session.user = {
          ...session.user,
          email: user.email,
        };
      }

      if (settings.scope.includes("profile")) {
        session.user = {
          ...session.user,
          ...user.profile,
        };
      }
    }
    await store.save(req, res, session);
    const redirectTo =
      (options && options.redirectTo) || decodedState.redirectTo || "/";
    res.writeHead(302, {
      Location: redirectTo,
    });
    res.end();
  };
}
