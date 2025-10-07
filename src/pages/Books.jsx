import React, { useEffect, useState } from "react";
import booksdata from "../database/books.json";
import BookCard from "../components/Bookcard";

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    document.title = "Books | Mahendra Verma";
  }, []);

  useEffect(() => {
    setBooks(booksdata);
  }, []);

  return (
    <div className="px-4 py-12">
      {/* Page Title */}
      <p className="font-semibold  text-4xl md:text-5xl lg:text-5xl text-white uppercase text-center">
        Books
      </p>

      {/* Book Cards */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 mt-8">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Books;
