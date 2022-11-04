// FIXME: add types

export function getSessionFromTokenSet(tokenSet: any) {
  // Get the claims without any OIDC specific claim.
  const claims = tokenSet.claims();

  console.log({ claims });

  if (claims.aud) {
    delete claims.aud;
  }

  if (claims.exp) {
    delete claims.exp;
  }

  if (claims.iat) {
    delete claims.iat;
  }

  if (claims.iss) {
    delete claims.iss;
  }

  // Create the session.
  return {
    user: {
      ...claims,
    },
    idToken: tokenSet.id_token,
    accessToken: tokenSet.access_token,
    accessTokenScope: tokenSet.scope,
    accessTokenExpiresAt: tokenSet.expires_at,
    refreshToken: tokenSet.refresh_token,
    createdAt: Date.now(),
  };
}
