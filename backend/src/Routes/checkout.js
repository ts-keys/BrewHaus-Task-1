import express from "express";
import { pool } from "../db.js";
import { stripe } from "../Lib/stripe.js";
import { requireAuth } from "../Middleware/require-auth.js";

export const checkout = express.Router();

checkout.post("/", requireAuth, async (req, res) => {
  const { bookId, quantity = 1 } = req.body;

  // Validate the values sent by the frontend.
  if (
    !Number.isInteger(Number(bookId)) ||
    !Number.isInteger(Number(quantity)) ||
    Number(bookId) < 1 ||
    Number(quantity) < 1 ||
    Number(quantity) > 10
  ) {
    return res.status(400).json({
      message: "Invalid book or quantity."
    });
  }

  let orderId;

  try {
    // Always retrieve the price from the database.
    const bookResult = await pool.query(
      `SELECT id, title, price_cents
       FROM books
       WHERE id = $1`,
      [bookId]
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found."
      });
    }

    const book = bookResult.rows[0];
    const totalCents = book.price_cents * Number(quantity);

    // Create the order and order item in one transaction.
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const orderResult = await client.query(
        `INSERT INTO orders (user_id, total_cents)
         VALUES ($1, $2)
         RETURNING id`,
        [req.userId, totalCents]
      );

      orderId = orderResult.rows[0].id;

      await client.query(
        `INSERT INTO order_items
          (order_id, book_id, book_title, quantity, unit_price_cents)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          orderId,
          book.id,
          book.title,
          Number(quantity),
          book.price_cents
        ]
      );

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }

    // Create the Stripe Checkout session.
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "zar",
            product_data: {
              name: book.title
            },
            unit_amount: book.price_cents
          },
          quantity: Number(quantity)
        }
      ],

      success_url:
        `${process.env.FRONTEND_URL}/checkout/success?order_id=${orderId}`,

      cancel_url:
        `${process.env.FRONTEND_URL}/checkout/cancel?order_id=${orderId}`,

      metadata: {
        orderId: String(orderId),
        userId: req.userId
      }
    });

    // Save the Checkout Session ID against the order.
    await pool.query(
      `UPDATE orders
       SET stripe_checkout_session_id = $1
       WHERE id = $2`,
      [session.id, orderId]
    );

    return res.json({
      checkoutUrl: session.url
    });

  } catch (error) {
    console.error("Checkout error:", error);

    // If Stripe session creation failed, don't leave the order pending.
    if (orderId) {
      await pool.query(
        `UPDATE orders
         SET status = 'failed'
         WHERE id = $1 AND status = 'pending'`,
        [orderId]
      ).catch(console.error);
    }

    return res.status(500).json({
      message: "Unable to start checkout."
    });
  }
});