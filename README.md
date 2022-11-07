# Server side auth with OIDC and Next.js

This repository includes a collection of packages developed during a POC to verify the integration between [Dex](https://dexidp.io/) and Next.js.

It includes three packages:

1. [nextjs-oidc](./packages/nextjs-oidc/): an hand-written implementation of API handlers to plug into a Next.js app to implement a working OIDC auth flow;
2. [next-app-vanilla](./packages/next-app-vanilla/): uses `nextjs-oidc` to implement the auth flow;
3. [with-next-auth](./packages/with-next-auth/): a Next.js app using the [next-auth](https://next-auth.js.org) OSS library to implement the auth flow.
4. [with-client-side-auth](./packages/with-client-side-auth/): a Next.js app that carries out the auth flow purely client-side, storing tokens in `localStorage`

Refer to the three packages' README files for instructions on how to run them.
