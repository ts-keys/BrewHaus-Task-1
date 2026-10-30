import { useState } from "react";
import { useLocation, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const formatPrice = (cents) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(cents / 100);

function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const book = location.state?.book;
  const quantity = location.state?.quantity;
  const totalCents = book.price_cents * quantity;

    if (!book || !quantity) {
    return (
      <main className="payment-page payment-empty-state">
        <h1>No book selected</h1>
        <p>Please select a book before proceeding to checkout.</p>
        <Link to="/books" className="payment-primary-button">
          Browse Books
        </Link>
      </main>
    );
  }
  
  const startCheckout = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          bookId: book.id,
          quantity,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        throw new Error("Please sign in before checking out.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not start checkout.");
      }

      if (!data.checkoutUrl) {
        throw new Error("The checkout session did not return a payment URL.");
      }

      window.location.assign(data.checkoutUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <main className="payment-page">
      <div className="payment-page-heading">
        <p className="payment-eyebrow">CHAPTER HOUSE · CHECKOUT</p>
        <h1>Almost your next chapter.</h1>
        <p>Review your selection before continuing to secure payment.</p>
      </div>

      <div className="checkout-layout">
        <section className="payment-panel checkout-summary">
          <h2>Your order</h2>

          <div className="checkout-book">
            <img
              src={`/${book.image}`}
              alt={book.title}
              className="checkout-book-image"
            />
            <div className="checkout-book-details">
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
              <span className="checkout-category">{book.category}</span>
              <p className="checkout-unit-price">
                {formatPrice(book.price_cents)} each
              </p>
            </div>
          </div>

          <div className="payment-divider" />

          <div className="payment-total-row">
            <span>Quantity</span>
            <strong>{quantity}</strong>
          </div>
          <div className="payment-total-row payment-grand-total">
            <span>Total</span>
            <strong>{formatPrice(totalCents)}</strong>
          </div>

          <p className="payment-small-note">
            Your final amount is verified by Chapter House before payment.
          </p>
        </section>

        <aside className="payment-panel checkout-action">
          <div className="secure-payment-icon" aria-hidden="true">✦</div>
          <h2>Secure checkout</h2>
          <p>
            You'll be redirected to Stripe's secure hosted checkout page to
            complete your payment.
          </p>

          {error && (
            <div className="payment-alert payment-alert-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="button"
            className="payment-primary-button"
            onClick={startCheckout}
            disabled={isSubmitting || quantity < 1}
          >
            {isSubmitting ? "Preparing checkout..." : "Continue to payment"}
            {!isSubmitting && <span aria-hidden="true"> →</span>}
          </button>

          <p className="payment-security-note">
            <span aria-hidden="true">⌑</span> Payments are securely processed
            by Stripe.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default CheckoutPage;
