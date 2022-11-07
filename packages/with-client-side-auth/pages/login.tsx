import { useRouter } from "next/router";
import { useAuth } from "react-oidc-context";

const Login = () => {
  const router = useRouter();
  const auth = useAuth();

  if (auth.isAuthenticated) {
    router.replace("/");
  }

  return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
};

export default Login;
