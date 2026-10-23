import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js"
import { pool } from "./db.js";
import cors from "cors"

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running"
  });
});

app.get("/api/users", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * from public.\"user\""
    );
    res.json(result.rows)
  } catch{
    console.error('no')
  }
})
app.get("/api/db-health", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT NOW() AS current_time"
    );

    res.json({
      connected: true,
      databaseTime: result.rows[0].current_time
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      connected: false,
      message: "Could not connect to the database"
    });
  }
});