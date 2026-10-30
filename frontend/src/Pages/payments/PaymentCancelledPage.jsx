import { Link } from "react-router-dom";

function PaymentCancelledPage() {
  return (
    <main className="payment-page payment-result-page">
      <section className="payment-panel payment-result-panel">
        <div className="payment-status-symbol payment-status-pending">×</div>
        <p className="payment-eyebrow">CHAPTER HOUSE · CHECKOUT</p>
        <h1>Checkout was cancelled</h1>
        <p>
          No payment confirmation was received. You can return to the books
          and try again whenever you're ready.
        </p>

        <div className="payment-result-actions">
          <Link className="payment-primary-button payment-link-button" to="/books">
            Return to books
          </Link>
          <Link className="payment-secondary-link" to="/">
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}

export default PaymentCancelledPage;
