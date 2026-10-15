function BookCard({ image, title, author, category, price }) {
  return (
    <article className="book-card">
      <img src={image} alt={`Cover of ${title}`} />

      <h3>{title}</h3>
      <p>{author}</p>
      <p>{category}</p>

      <span>{price}</span>
    </article>
  );
}

export default BookCard;