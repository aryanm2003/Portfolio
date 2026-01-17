import React, { useEffect, useState } from "react";
import BookCard from "../components/Bookcard";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Books | Mahendra Verma";

    const fetchBooks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books`);
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="px-4 py-12">
      <p className="font-semibold text-4xl md:text-5xl lg:text-5xl text-white uppercase text-center">
        Books
      </p>

      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 mt-8">
        {loading ? (
          <p className="text-gray-400">Loading books...</p>
        ) : (
          books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))
        )}
      </div>
    </div>
  );
};

export default Books;