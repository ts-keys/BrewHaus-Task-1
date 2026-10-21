import { Pool } from "pg";

const connectionString = process.env.DB_Connection;

if (!connectionString) {
  throw new Error("DB_Connection is not configured");
}

export const pool = new Pool({
  connectionString
});
