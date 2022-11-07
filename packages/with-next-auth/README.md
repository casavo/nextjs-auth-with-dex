# Server side auth with DEX and next-auth

This implementation authenticates against a Dex instance with the [next-auth](https://next-auth.js.org/) library.

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

After this, you can run dex (refer to [Dex docs]()):

```bash
./bin/dex serve ./dex.config.yaml
```

Run the app:

```bash
pnpm --filter with-next-auth dev
```

# What is missing for production

* Refresh token rotation is not handled automatically, but a reference implementation is shared in the library docs: https://next-auth.js.org/tutorials/refresh-token-rotation#implementation


