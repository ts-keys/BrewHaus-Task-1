import { useState } from "react";
import QuantityStepper from "./QuantityStepper";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { toast } from "react-toastify";

function BookCard({ id, image, title, author, category, price_cents }) {

  /**************************************
    *  Local variables
  *************************************/
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  /**************************************
    *  Local methods
  *************************************/

  /**
   * @name - handleBuyNow
   * @description - creates a snapshot of purchase data and sends the data to the checkout page
   */
  const handleBuyNow = () => {
    if (!session) {
      toast.error('Please login to make a purchase')
      return;
    }
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
      
      <div className="book-cover">
        <img src={image} alt={`Cover of ${title}`} />
      </div>

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