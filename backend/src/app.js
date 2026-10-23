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

// test to check users
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

app.get('/api/books', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM books ORDER BY id
      `)
      res.json(result.rows)
  } catch (error) {
    console.log('failed')
    res.status(500).json({
      message: 'Failed to retrieve books'
    })
  }
})