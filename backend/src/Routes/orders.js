import express from "express";
import { pool } from "../db.js";
import { requireAuth } from "../Middleware/require-auth.js";

export const ordersRouter = express.Router();

// Get all orders belonging to the signed-in user.
ordersRouter.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
          o.id,
          o.status,
          o.total_cents,
          o.currency,
          o.created_at,
          COALESCE(
            json_agg(
              json_build_object(
                'id', oi.id,
                'book_id', oi.book_id,
                'book_title', oi.book_title,
                'quantity', oi.quantity,
                'unit_price_cents', oi.unit_price_cents,
                'line_total_cents', oi.line_total_cents
              )
            ) FILTER (WHERE oi.id IS NOT NULL),
            '[]'::json
          ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to retrieve orders:", error);

    res.status(500).json({
      message: "Failed to retrieve orders."
    });
  }
});

// Get one order belonging to the signed-in user.
ordersRouter.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      message: "Invalid order ID."
    });
  }

  try {
    const result = await pool.query(
      `SELECT
          o.id,
          o.status,
          o.total_cents,
          o.currency,
          o.created_at,
          o.paid_at,
          COALESCE(
            json_agg(
              json_build_object(
                'id', oi.id,
                'book_id', oi.book_id,
                'book_title', oi.book_title,
                'quantity', oi.quantity,
                'unit_price_cents', oi.unit_price_cents,
                'line_total_cents', oi.line_total_cents
              )
            ) FILTER (WHERE oi.id IS NOT NULL),
            '[]'::json
          ) AS items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found."
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to retrieve order:", error);

    res.status(500).json({
      message: "Failed to retrieve order."
    });
  }
});