import Iron from "@hapi/iron";
import { Session } from "../session";
import { parseCookies, setCookie } from "../../utils/cookies";

// FIXME: add types

export class CookieSessionStore {
  settings: any;

  constructor(settings: any) {
    this.settings = settings;
  }

  /**
   * Read the session from the cookie.
   * @param req HTTP request
   */
  async read(req: any) {
    if (!req) {
      throw new Error("Request is not available");
    }

    const { cookieSecret, cookieName } = this.settings;

    const cookies = parseCookies(req);
    const cookie = cookies[cookieName];

    if (!cookie || cookie.length === 0) {
      return null;
    }

    const unsealed = await Iron.unseal(
      cookies[cookieName],
      cookieSecret,
      Iron.defaults
    );
    if (!unsealed) {
      return null;
    }
    return unsealed;
  }

  /**
   * Write the session to the cookie.
   * @param req HTTP request
   */
  async save(req: any, res: any, session: any) {
    if (!res) {
      throw new Error("Response is not available");
    }

    if (!req) {
      throw new Error("Request is not available");
    }

    const {
      cookieName,
      cookiePath,
      cookieDomain,
      cookieSecret,
      cookieSameSite,
      cookieLifetime,
    } = this.settings;

    const {
      idToken,
      accessToken,
      accessTokenExpiresAt,
      accessTokenScope,
      refreshToken,
      user,
      createdAt,
    } = session;
    const persistedSession = new Session(user, createdAt);

    if (this.settings.storeIdToken && idToken) {
      // @ts-expect-error
      persistedSession.idToken = idToken;
    }

    if (this.settings.storeAccessToken && accessToken) {
      // @ts-expect-error
      persistedSession.accessToken = accessToken;
      // @ts-expect-error
      persistedSession.accessTokenScope = accessTokenScope;
      // @ts-expect-error
      persistedSession.accessTokenExpiresAt = accessTokenExpiresAt;
    }

    if (this.settings.storeRefreshToken && refreshToken) {
      // @ts-expect-error
      persistedSession.refreshToken = refreshToken;
    }

    const encryptedSession = await Iron.seal(
      persistedSession,
      cookieSecret,
      Iron.defaults
    );

    setCookie(req, res, {
      name: cookieName,
      path: cookiePath,
      domain: cookieDomain,
      maxAge: cookieLifetime,
      value: encryptedSession,
      sameSite: cookieSameSite,
    });

    return persistedSession;
  }
}
