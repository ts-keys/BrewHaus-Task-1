import { useState } from "react";
import QuantityStepper from "./QuantityStepper";
import { useNavigate } from "react-router-dom";

function BookCard({ id, image, title, author, category, price_cents }) {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  async function handleBuyNow() {
    navigate("/checkout", {
    state: {
      book: {
        id,
        image,
        title,
        author,
        category,
        price_cents
      },
      quantity
    }
  });
    
  }

  return (
    <article className="book-card">
      <img src={image} alt={`Cover of ${title}`} />

      <h3>{title}</h3>
      <p>{author}</p>
      <p>{category}</p>

      <div className="book-card-actions">
        <span className="book-price">
          {new Intl.NumberFormat("en-ZA", {
            style: "currency",
            currency: "ZAR"
          }).format(price_cents / 100)}
        </span>

        <QuantityStepper
          quantity={quantity}
          onChange={setQuantity}
          min={1}
          max={10}
        />

        <button
          type="button"
          className="buy-now"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>
    </article>
  );
}

export default BookCard;