
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PaymentSuccessPage() {
  const orderId = new URLSearchParams(window.location.search).get("order_id");

  const [status, setStatus] = useState(() =>
    orderId ? "checking" : "error"
  );

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    async function checkOrder() {
      for (let attempt = 0; attempt < 8; attempt++) {
        if (cancelled) return;

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`,
            { credentials: "include" }
          );

          if (response.status === 401) {
            setStatus("unauthorized");
            return;
          }

          if (response.status === 404) {
            setStatus("not-found");
            return;
          }

          if (!response.ok) {
            throw new Error("Unable to retrieve order.");
          }

          const data = await response.json();

          if (cancelled) return;

          setOrder(data);

          if (data.status === "paid") {
            setStatus("paid");
            return;
          }

          if (["failed", "cancelled", "refunded"].includes(data.status)) {
            setStatus(data.status);
            return;
          }
        } catch (error) {
          console.error("Order check failed:", error);
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      if (!cancelled) setStatus("pending");
    }

    checkOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const formatPrice = (cents, currency = "ZAR") =>
    new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency,
    }).format(cents / 100);

  const renderContent = () => {
    switch (status) {
      case "checking":
        return (
          <>
            <div className="payment-status-symbol payment-status-pending">
              ...
            </div>
            <h1>Confirming your payment</h1>
            <p>Please wait while we verify your order. This usually takes a few moments.</p>
          </>
        );

      case "paid":
        return (
          <>
            <div className="payment-status-symbol payment-status-paid">
              ✓
            </div>
            <p className="payment-eyebrow">CHAPTER HOUSE · ORDER CONFIRMED</p>
            <h1>Thank you for your order!</h1>
            <p>Your payment was successful. We can't wait for you to enjoy your new reads.</p>

            {order && (
              <div className="payment-confirmation-details">
                <div>
                  <span>Order number</span>
                  <strong>#{order.id}</strong>
                </div>
                <div>
                  <span>Payment status</span>
                  <strong className="paid-text">Paid</strong>
                </div>
                <div>
                  <span>Total paid</span>
                  <strong>
                    {formatPrice(order.total_cents, order.currency)}
                  </strong>
                </div>
              </div>
            )}

            <div className="payment-result-actions">
              <Link to="/orders" className="payment-primary-button">
                View My Orders
              </Link>
              <Link to="/" className="payment-secondary-link">
                Continue exploring books
              </Link>
            </div>
          </>
        );

      case "pending":
        return (
          <>
            <div className="payment-status-symbol payment-status-pending">
              !
            </div>
            <h1>Payment is still processing</h1>
            <p>Your payment hasn't been confirmed yet. Please check your order history shortly.</p>
            <div className="payment-result-actions">
              <Link to="/orders" className="payment-primary-button">
                View My Orders
              </Link>
            </div>
          </>
        );

      case "failed":
      case "cancelled":
        return (
          <>
            <div className="payment-status-symbol payment-status-pending">
              !
            </div>
            <h1>Payment unsuccessful</h1>
            <p>Your order was not completed. You can return to our bookstore and try again.</p>
            <div className="payment-result-actions">
              <Link to="/" className="payment-primary-button">
                Return to Books
              </Link>
            </div>
          </>
        );

      case "refunded":
        return (
          <>
            <div className="payment-status-symbol payment-status-pending">
              ✓
            </div>
            <h1>Payment refunded</h1>
            <p>This order has been refunded. You can view its details in your order history.</p>
            <div className="payment-result-actions">
              <Link to="/orders" className="payment-primary-button">
                View My Orders
              </Link>
            </div>
          </>
        );

      case "not-found":
        return (
          <>
            <div className="payment-status-symbol payment-status-pending">
              !
            </div>
            <h1>Order not found</h1>
            <p>We couldn't find this order under your account.</p>
            <div className="payment-result-actions">
              <Link to="/" className="payment-primary-button">
                Return to Books
              </Link>
            </div>
          </>
        );

      default:
        return (
          <>
            <div className="payment-status-symbol payment-status-pending">
              !
            </div>
            <h1>Something went wrong</h1>
            <p>We couldn't identify your order. Please return to the bookstore.</p>
            <div className="payment-result-actions">
              <Link to="/" className="payment-primary-button">
                Return to Books
              </Link>
            </div>
          </>
        );
    }
  };

  return (
    <main className="payment-page payment-result-page">
      <section className="payment-panel payment-result-panel">
        {renderContent()}
      </section>
    </main>
  );
}

export default PaymentSuccessPage;
