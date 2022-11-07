import type { NextApiRequest, NextApiResponse } from "next";
import handlers from "../../init-auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return handlers.handleCallback(req, res, { redirectTo: "/", authParams: {}  });
}
