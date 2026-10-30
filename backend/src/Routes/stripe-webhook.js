import express from "express";
import { stripe } from "../lib/stripe.js";
import { pool } from "../db.js";

export const stripeWebhook = express.Router();

stripeWebhook.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error("Webhook signature verification failed:", error.message);

      return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Only mark the order as paid when Stripe confirms payment.
        if (session.payment_status === "paid") {
          const orderId = session.metadata.orderId;
          const paymentIntentId =
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null;

          await pool.query(
            `UPDATE orders
             SET status = 'paid',
                 stripe_payment_intent_id = $1,
                 paid_at = NOW()
             WHERE id = $2
               AND status = 'pending'`,
            [paymentIntentId, orderId]
          );
        }
      }

      return res.json({ received: true });
    } catch (error) {
      console.error("Webhook processing failed:", error);

      // A 500 response allows Stripe to retry the event.
      return res.status(500).json({
        message: "Webhook processing failed."
      });
    }
  }
);