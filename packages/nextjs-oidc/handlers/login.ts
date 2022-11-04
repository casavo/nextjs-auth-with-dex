import { isRelative } from "../utils/urlHelpers";
import { setCookies } from "../utils/cookies";
import { createState } from "../utils/state";

// FIXME: add types

export const loginHandlerFactory = (settings: any, clientProvider: any) => {
  return async function loginHandler(req: any, res: any, options: any) {
    if (!req) {
      throw new Error("Request is not available");
    }

    if (!res) {
      throw new Error("Response is not available");
    }

    if (req.query.redirectTo) {
      if (typeof req.query.redirectTo !== "string") {
        throw new Error(
          "Invalid value provided for redirectTo, must be a string"
        );
      }

      if (!isRelative(req.query.redirectTo)) {
        throw new Error(
          "Invalid value provided for redirectTo, must be a relative url"
        );
      }
    }

    const opt = options || {};
    const getLoginState =
      opt.getState ||
      function getLoginState() {
        return {};
      };

    const {
      // Generate a state which contains a nonce, the redirectTo uri and potentially custom data
      state = createState({
        redirectTo: (req.query && req.query.redirectTo) || options.redirectTo,
        ...getLoginState(req),
      }),
      ...authParams
    } = (opt && opt.authParams) || {};

    // Create the authorization url.
    const client = await clientProvider();
    const authorizationUrl = client.authorizationUrl({
      redirect_uri: settings.redirectUri,
      audience: settings.audience,
      scope: settings.scope,
      response_type: "code",
      state,
      ...authParams,
    });
    // Set the necessary cookies
    setCookies(req, res, [
      {
        name: "rp:state",
        value: state,
        maxAge: 60 * 10,
        path: "/",
      },
    ]);
    // Redirect to the authorize endpoint.
    res.writeHead(302, {
      Location: authorizationUrl,
    });
    res.end();
  };
};
