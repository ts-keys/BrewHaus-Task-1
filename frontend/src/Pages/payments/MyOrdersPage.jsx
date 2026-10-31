
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// Function to format the price from cents back to rands
const formatPrice = (cents, currency = "ZAR") =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
  }).format(cents / 100);

const statusLabel = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

function MyOrdersPage() {

  /**************************************
    *  Local variables
  *************************************/
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  /**************************************
    *  Hooks
  *************************************/
  useEffect(() => {

    // Function to fetch all user orders from the database
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not load your orders.");
        }

        setOrders(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main className="payment-page orders-page">

      {/* Back to home */}
      <div className="orders-back-link">
        <Link to="/" className="payment-secondary-button">
          ← Back to Home
        </Link>
      </div>

      <div className="payment-page-heading">
        <p className="payment-eyebrow">CHAPTER HOUSE · YOUR ACCOUNT</p>
        <h1>Your orders</h1>
        <p>A little history of the stories you've chosen.</p>
      </div>

      {isLoading ? (
        <p className="payment-empty-state">Loading your orders...</p>
      ) : error ? (
        <div className="payment-alert payment-alert-error" role="alert">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <section className="payment-panel payment-empty-state">
          <h2>No orders yet</h2>
          <p>Your next favourite read might be waiting for you.</p>
          <Link
            className="payment-primary-button payment-link-button"
            to="/books"
          >
            Explore books
          </Link>
        </section>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="payment-panel order-card" key={order.id}>
              <div className="order-card-heading">
                <div>
                  <p className="payment-eyebrow">ORDER #{order.id}</p>
                  <h2>
                    {new Date(order.created_at).toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </h2>
                </div>

                <span className={`order-status status-${order.status}`}>
                  {statusLabel[order.status] || order.status}
                </span>
              </div>

              <div className="order-items-list">
                {order.items?.map((item) => (
                  <div className="order-item-row" key={item.id}>
                    <span>
                      {item.book_title} <small>× {item.quantity}</small>
                    </span>
                    <strong>
                      {formatPrice(item.line_total_cents, order.currency)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="order-total-row">
                <span>Order total</span>
                <strong>
                  {formatPrice(order.total_cents, order.currency)}
                </strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyOrdersPage;
