import "dotenv/config";
import { pool } from "../db.js";


 const books = [
  {
    id: 1,
    image: "Images/staff picks/fear of death.jpg",
    title: "How the fear of death shaped human society",
    author: "Rachel E. Menzies & Ross G. Menzies",
    category: "Staff picks",
    price: "R410",
  },
  {
    id: 2,
    image: "Images/non-fiction/How to kill your ego.jpg",
    title: "How to kill your ego",
    author: "Helen Marcos",
    category: "Non-fiction",
    price: "R330",
  },
  {
    id: 3,
    image: "Images/non-fiction/Hyper Focus.jpg",
    title: "Hyper focus",
    author: "Chris Bailey",
    category: "Non-fiction",
    price: "R320",
  },
  {
    id: 4,
    image: "Images/staff picks/the subtle art.jpg",
    title: "The subtle art of not giving a f*ck",
    author: "Mark Manson",
    category: "Staff picks",
    price: "R209",
  },
];

async function seedBooks() {
  try {
    for (const book of books) {
      // Convert "R249" into 24900 cents.
      const priceCents = Number(
        book.price.replace("R", "")
      ) * 100;

      await pool.query(
        `
          INSERT INTO books (
            id,
            image,
            title,
            author,
            category,
            price_cents
          )
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id)
          DO UPDATE SET
            image = EXCLUDED.image,
            title = EXCLUDED.title,
            author = EXCLUDED.author,
            category = EXCLUDED.category,
            price_cents = EXCLUDED.price_cents
        `,
        [
          book.id,
          book.image,
          book.title,
          book.author,
          book.category,
          priceCents
        ]
      );

      console.log(`Seeded book: ${book.id} - ${book.title}`);
    }

    // Ensure future automatically generated IDs
    // continue after the highest existing ID.
    await pool.query(`
      SELECT setval(
        pg_get_serial_sequence('books', 'id'),
        COALESCE((SELECT MAX(id) FROM books), 1),
        EXISTS (SELECT 1 FROM books)
      )
    `);

    console.log("Books seeded successfully!");
  } catch (error) {
    console.error("Failed to seed books:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedBooks();
