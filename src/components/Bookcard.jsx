import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const BookCard = ({ book }) => {
    const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/books/${book.slug}`)}
     className="rounded-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <img 
        src={book.image} 
        alt={book.title} 
        className="w-80 h-fit object-fit"
      />
    </div>
  );
};

export default BookCard;
