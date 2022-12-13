import { SimpleRolesIsAuthorized } from "@blitzjs/auth";

export type Role = "ADMIN" | "USER";

declare module "@blitzjs/auth" {
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>;
    PublicData: {
      userId: string;
      email: string;
    };
  }
}
