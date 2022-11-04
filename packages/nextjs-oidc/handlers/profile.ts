import { tokenCacheHandlerFactory } from "./token-cache";

// FIXME: add types

export const profileHandlerFactory = (store: any, clientProvider: any) => {
  const tokenHandler = tokenCacheHandlerFactory(clientProvider, store);

  return async function profileHandler(req: any, res: any, options: any) {
    console.log("------ PROFILE --------");

    if (!req) {
      throw new Error("Request is not available");
    }

    if (!res) {
      throw new Error("Response is not available");
    }

    const session = await store.read(req);

    console.log({ session });

    if (!session || !session.user) {
      res.status(401).json({
        error: "not_authenticated",
        description:
          "The user does not have an active session or is not authenticated",
      });
      return;
    }
    if (options && options.refetch) {
      const tokenCache = tokenHandler(req, res);

      const { accessToken } = await tokenCache.getAccessToken();
      if (!accessToken) {
        throw new Error("No access token available to refetch the profile");
      }

      const client = await clientProvider();
      const userInfo = await client.userinfo(accessToken);

      const updatedUser = {
        ...session.user,
        ...userInfo,
      };

      await store.save(req, res, {
        ...session,
        user: updatedUser,
      });

      res.json(updatedUser);
      return;
    }

    res.json(session.user);
  };
};
