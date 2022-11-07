import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { UserManagerSettings, WebStorageStateStore } from "oidc-client-ts";
import { AuthProvider } from "react-oidc-context";

import "../styles/globals.css";

const oidcConfig: UserManagerSettings = {
  authority: "http://127.0.0.1:4433/dex",
  client_id: "app-pkce",
  redirect_uri: "http://127.0.0.1:3000/callback",
  post_logout_redirect_uri: "http://127.0.0.1:3000/login",
  response_type: "code",
  automaticSilentRenew: true,
  scope: "openid profile offline_access email groups",
  // necessary to persist auth state across different tabs, default is sessionStorage
  userStore:
    typeof window !== "undefined"
      ? new WebStorageStateStore({ store: window.localStorage })
      : undefined,
};  

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // TODO: configure custom usermanager instance and configure custom events to
  // respond to auth events (eg silentRenewError and accessTokenExpired)

  return (
    <AuthProvider
      {...oidcConfig}
      onSigninCallback={() => {
        // removes `code` and `state` query params
        router.replace(router.pathname);
      }}
    >
      <Component {...pageProps} />
    </AuthProvider>
  );
}
