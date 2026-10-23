import { toast } from "react-toastify";
import BookCard from "./BookCard";
import { useState, useEffect } from "react";

const categories = ['All', 'Non-fiction', 'Staff picks'];

function BookSection() {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const filtered = category === 'All' ? books : books.filter((book) => book.category === category);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await fetch(`${import.meta.env.VITE_API_URL}/api/books`);
        const data = await books.json();
        setBooks(data);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.message);
      }
    }
    fetchBooks();
  },[])
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
      {isLoading? <p>Loading books...</p> : 
      <div className="books" id="books">
        <div className="book-grid">
          {filtered.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      </div>}
    </section>
  );
}

export default BookSection;