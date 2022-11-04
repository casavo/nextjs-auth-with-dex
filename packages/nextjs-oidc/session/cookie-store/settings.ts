// FIXME: add types

export class CookieSessionStoreSettings {
  cookieSecret: any;
  cookieName: any;
  cookieSameSite: any;
  cookieDomain: string;
  cookieLifetime: any;
  cookiePath: any;
  storeIdToken: boolean;
  storeAccessToken: boolean;
  storeRefreshToken: boolean;

  constructor(settings: any) {
    this.cookieSecret = settings.cookieSecret;
    if (!this.cookieSecret || !this.cookieSecret.length) {
      throw new Error("The cookieSecret setting is empty or null");
    }

    if (this.cookieSecret.length < 32) {
      throw new Error("The cookieSecret should be at least 32 characters long");
    }

    this.cookieName = settings.cookieName || "rp:sid";
    if (!this.cookieName || !this.cookieName.length) {
      throw new Error("The cookieName setting is empty or null");
    }

    this.cookieSameSite = settings.cookieSameSite;
    if (this.cookieSameSite === undefined) {
      this.cookieSameSite = "none";
    }

    this.cookieDomain = settings.cookieDomain || "localhost";
    this.cookieLifetime = settings.cookieLifetime || 60 * 60 * 8;

    this.cookiePath = settings.cookiePath || "/";
    if (!this.cookiePath || !this.cookiePath.length) {
      throw new Error("The cookiePath setting is empty or null");
    }

    this.storeIdToken = settings.storeIdToken || false;
    this.storeAccessToken = settings.storeAccessToken || false;
    this.storeRefreshToken = settings.storeRefreshToken || false;
  }
}
