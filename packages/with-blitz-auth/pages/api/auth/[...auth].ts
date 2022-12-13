import { passportAuth } from "@blitzjs/auth";
import { api } from "../../../src/blitz-server";
import { Issuer, Strategy as OidcStrategy, TokenSet } from "openid-client";

const issuer = await Issuer.discover("http://localhost:4433/dex");

console.log({ issuer });

const client = new issuer.Client({
  client_id: "app-with-secret",
  client_secret: "ZXhhbXBsZS1hcHAtc2VjcmV0",
  redirect_uris: ["http://localhost:3000/api/auth/oidc/callback"],
  post_logout_redirect_uris: ["http://localhost:3000/login"],
  token_endpoint_auth_method: "client_secret_post",
});

const strategy = new OidcStrategy(
  {
    client,
    usePKCE: false,
    params: {
      scope: "openid profile offline_access email groups",
    },
  },
  function verify(tokenSet: TokenSet, userInfo: object, done: Function) {
    console.log({ tokenSet, userInfo });
    console.log({ claims: tokenSet.claims() });
    const publicData = tokenSet.claims();
    return done(undefined, {
      publicData: {
        ...publicData,
        userId: publicData.email,
      },
    });
  }
);

(strategy as any).name = "oidc";

console.log({ strategy });

export default api(
  passportAuth({
    successRedirectUrl: "/",
    errorRedirectUrl: "/",

    strategies: [
      {
        // authenticateOptions: {
        //   scope: "openid profile offline_access email groups",
        // },
        strategy,
      },
    ],
  })
);
