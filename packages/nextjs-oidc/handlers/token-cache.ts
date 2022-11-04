import { SessionTokenCache } from "../tokens/session-token-cache";

// FIXME: add types

export const tokenCacheHandlerFactory = (
  clientProvider: any,
  sessionStore: any
) => {
  return function tokenCacheHandler(req: any, res: any) {
    if (!req) {
      throw new Error("Request is not available");
    }

    if (!res) {
      throw new Error("Response is not available");
    }

    return new SessionTokenCache(sessionStore, clientProvider, req, res);
  };
};
