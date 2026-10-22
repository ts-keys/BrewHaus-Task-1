import QuantityStepper from "./QuantityStepper";

function BookCard({ image, title, author, category, price }) {
  return (
    <article className="book-card">
      <img src={image} alt={`Cover of ${title}`} />

      <h3>{title}</h3>
      <p>{author}</p>
      <p>{category}</p>

      <div className="book-card-actions">
        <span className="book-price">{price}</span>
        <QuantityStepper />
      </div>
    </article>
  );
}

export default BookCard;