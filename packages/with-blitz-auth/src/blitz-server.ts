// src/blitz-server.ts
import {
  AuthServerPlugin,
  Session,
  SessionModel,
  simpleRolesIsAuthorized,
} from "@blitzjs/auth";
import { setupBlitzServer } from "@blitzjs/next";

import { authConfig } from "./blitz-client";

let sessionStorage: Record<string, any> = {};

export const { gSSP, gSP, api } = setupBlitzServer({
  plugins: [
    AuthServerPlugin({
      ...authConfig,
      isAuthorized: simpleRolesIsAuthorized,
      storage: {
        createSession: (session: SessionModel): Promise<SessionModel> => {
          sessionStorage[`token:${session.handle}`] = JSON.stringify(session);
          console.log('created session', session)
          return Promise.resolve(session);
        },
        deleteSession: (handle: string): Promise<SessionModel> => {
          const session = JSON.parse(sessionStorage[`token:${handle}`]);
          delete sessionStorage[`token:${handle}`];
          return Promise.resolve(session);
        },
        getSession: (handle: string): Promise<SessionModel | null> => {
          console.log("getSession", sessionStorage[`token:${handle}`]);
          const session = JSON.parse(sessionStorage[`token:${handle}`] ?? null);
          return Promise.resolve(session);
        },
        updateSession: (
          handle: string,
          session: Partial<SessionModel>
        ): Promise<SessionModel> => {
          const oldSession = JSON.parse(sessionStorage[`token:${handle}`]);
          const merged = { ...oldSession, ...session };
          sessionStorage[`token:${session.handle}`] = JSON.stringify(merged);
          return merged;
        },
        getSessions: (
          userId: Session["PublicData"]["userId"]
        ): Promise<SessionModel[]> => {
          return Promise.resolve([]);
        },
      },
    }),
  ],
});
