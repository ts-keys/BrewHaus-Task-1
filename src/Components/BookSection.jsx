import BookCard from "./BookCard";
import {books} from '../Data/Books'
import { useState } from "react";

const categories = ['All', 'Non-fiction', 'Staff picks'];

function BookSection() {
  const [category, setCategory] = useState('All');
  const filtered = category === 'All' ? books : books.filter((book) => book.category === category);

  return (
    <section aria-labelledby="books-heading">
      <div className="books-heading">
        <h2>Picked for You</h2>

        <div className="book-filters" aria-label="Filter books by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${
                category === cat ? "active" : ""
              }`}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="books" id="books">
        <div className="book-grid">
          {filtered.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BookSection;