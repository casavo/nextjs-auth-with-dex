import NextAuth, { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    {
      id: "dex",
      name: "Dex",
      type: "oauth",
      wellKnown: "http://localhost:4433/dex/.well-known/openid-configuration",
      authorization: {
        params: { scope: "openid email profile offline_access groups" },
      },
      idToken: true,
      checks: ["pkce", "state"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      clientId: "app-with-secret",
      clientSecret: "ZXhhbXBsZS1hcHAtc2VjcmV0",
    },
  ],
};

export default NextAuth(authOptions);
