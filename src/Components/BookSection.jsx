import BookCard from "./BookCard";
import {books} from '../Data/Books'

function BookSection() {
  return (
    <section aria-labelledby="books-heading">
      <h2 id="books-heading">Picked for You</h2>

      <div className="books" id="books">
        <div className="book-grid">
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BookSection;