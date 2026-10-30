import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js"
import { pool } from "./db.js";
import cors from "cors"

import { stripeWebhook } from "./Routes/stripe-webhook.js";
import { checkout } from "./Routes/checkout.js";
import { ordersRouter } from "./Routes/orders.js";

export const app = express();

// cors setup: truts the frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);
// stripe webhook
app.use("/api/webhooks/stripe", stripeWebhook);

// better auth setup
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

/**
 * @route GET /api/books
 * @description Fetch all books from the db
 */
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

// Checkout route
app.use("/api/checkout", checkout);

// Orders route
app.use("/api/orders", ordersRouter);

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
