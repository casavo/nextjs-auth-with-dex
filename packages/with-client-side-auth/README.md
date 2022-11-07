# Client side auth with DEX and Next.js

This repository contains a working implementation of a Next.js app that authenticates against a Dex OIDC auth server.

# How to run it

Edit the [example Dex config](./dex.config.yaml) with your google application client id and client secret:

```yaml
connectors:
  - type: google
    id: google
    name: Google
    config:
      issuer: https://accounts.google.com
      # Connector config values starting with a "$" will read from the environment.
      clientID: <your_client_id>
      clientSecret: <your_client_secret>
      redirectURI: "http://127.0.0.1:4433/dex/callback"
      hostedDomains:
        - casavo.com
```

After this, you can run dex (refer to [Dex docs](https://dexidp.io/)):

```bash
./bin/dex serve ./dex.config.yaml
```

Run the app:

```bash
pnpm --filter with-client-side-auth dev
```

Loading `localhost:3000` will redirect to `localhost:3000/login`. You should be able to login with your Casavo account.

# Notes about the implementation

This implementation handles the authentication flow **purely client side**. This means that tokens are stored in `localStorage`, which is not ideal since it opens the application to XSS attacks. Furthermore, it precludes some uses of Next.js, since SSR for pages that make calls to authenticated APIs is not possible, and it will not be possible to make such calls from Server Components in the future.

Use this pattern only if your apps behave as a SPA (but you should really be questioning Next.js adoption at that point).

# What is missing for production?

* Handle some auth events, such as error paths (e.g. `silentRenewError` for failure of access token renewal, `accessTokenExpired` when the access token is expired and the user must login again)
* Access token should be automatically renewed; nevertheless there needs to be some semaphore system (or retry system) for when the token is being renewed but the frontend tries to make API calls
* The logic should be extracted/refactored, I implemented in the simplest way possible to make the code more understandable.

# Is there a better way?

A more secure way to store the tokens obtain from the auth flow would be to store them as `HttpOnly` cookies. In order to do so, the server should carry auth the auth flow, and set the cookies in the browser. This would have a few implications:

* Tokens would not be accessible from client-side JS; a dedicated `/profile` endpoint would be needed to retrieve user info
* All API calls would need to be proxied through Next.js, in order to read the tokens from the cookies and call the services with `Authorization: Bearer ...` headers
* This implementation would be able to do SSR with protected APIs (same holds for Server Components).

