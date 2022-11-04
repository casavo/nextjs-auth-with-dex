import { parse, serialize } from "cookie";

// FIXME: add types

/**
 * Parses the cookies from an API Route or from Pages and returns a key/value object containing all the cookies.
 * @param req Incoming HTTP request.
 */
export function parseCookies(req: any) {
  const { cookies } = req;

  // For API Routes we don't need to parse the cookies.
  if (cookies) {
    return cookies;
  }

  // For pages we still need to parse the cookies.
  const cookie = req && req.headers && req.headers.cookie;
  return parse(cookie || "");
}

/**
 * Based on the environment and the request we know if a secure cookie can be set.
 */
function isSecureEnvironment(req: any) {
  if (!req || !req.headers || !req.headers.host) {
    throw new Error('The "host" request header is not available');
  }

  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  const host =
    (req.headers.host.indexOf(":") > -1 && req.headers.host.split(":")[0]) ||
    req.headers.host;
  if (["localhost", "127.0.0.1"].indexOf(host) > -1) {
    return false;
  }

  return true;
}

/**
 * Serialize a cookie to a string.
 * @param cookie The cookie to serialize
 * @param secure Create a secure cookie.
 */
function serializeCookie(cookie: any, secure: boolean) {
  return serialize(cookie.name, cookie.value, {
    secure,
    httpOnly: secure,
    path: cookie.path,
    domain: cookie.domain,
    maxAge: cookie.maxAge,
    sameSite: cookie.sameSite,
    expires: new Date(Date.now() + cookie.maxAge * 1000),
  });
}

/**
 * Set one or more cookies.
 * @param res The HTTP response on which the cookie will be set.
 */
export function setCookies(req: any, res: any, cookies: any) {
  res.setHeader(
    "Set-Cookie",
    cookies.map((cookie: any) => serializeCookie(cookie, isSecureEnvironment(req)))
  );
}

/**
 * Set one or more cookies.
 * @param res The HTTP response on which the cookie will be set.
 */
export function setCookie(req: any, res: any, cookie: any) {
  res.setHeader(
    "Set-Cookie",
    serializeCookie(cookie, isSecureEnvironment(req))
  );
}
