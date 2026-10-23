import "dotenv/config";
import { betterAuth } from "better-auth";
import { pool } from "./db.js";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is not configured");
}

export const auth = betterAuth({
  database: pool,

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: [
    process.env.FRONTEND_URL
  ],

  emailAndPassword: {
    enabled: true
  }
});
