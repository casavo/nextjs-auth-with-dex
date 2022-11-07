import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { hasAuthParams, useAuth } from "react-oidc-context";

// auth stuff done here should probably be done in a reusable layout
export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !hasAuthParams() &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.isLoading
    ) {
      router.replace("/login");
    }
  }, [auth.isAuthenticated, auth.activeNavigator, auth.isLoading]);

  console.log(auth);

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        Hello {auth.user?.profile.name}{" "}
        <button onClick={() => void auth.removeUser()}>Log out</button>
      </div>
    );
  }

  return null;
}
