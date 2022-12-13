// src/blitz-client.ts:
import { AuthClientPlugin } from "@blitzjs/auth"
import { setupBlitzClient } from "@blitzjs/next"

export const authConfig = {
  cookiePrefix: "blitz-auth-with-next-app",
}

export const { withBlitz } = setupBlitzClient({
  plugins: [AuthClientPlugin(authConfig)],
})