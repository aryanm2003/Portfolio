import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const BookPage = () => {
    const { slug } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${slug}`);
                if (!response.ok) {
                    throw new Error('Book not found');
                }
                const data = await response.json();
                setBook(data);
                document.title = `${data.title} | Mahendra Verma`;
            } catch (error) {
                console.error("Failed to fetch book:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchBook();
        }
    }, [slug]);

    if (loading) {
        return <p className="text-center text-green-500 mt-10 text-lg md:text-xl">Loading...</p>;
    }

    if (!book) {
        return <p className="text-center text-green-500 mt-10 text-lg md:text-xl">Book not found</p>;
    }

    return (
        <div className="items-center max-w-[90%] md:max-w-[80%] mx-auto text-black min-h-screen py-8 px-2 md:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-500 mb-6 md:mb-8 text-center md:text-left">
                {book.title}
            </h1>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                {/* Left column */}
                <div className="md:w-3/5 px-2 md:px-7 text-left">
                    <p className="text-gray-200 mb-4 sm:mb-5 md:mb-6 leading-relaxed text-sm sm:text-base md:text-lg">
                        {book.about}
                    </p>
                    {/* <p className="text-gray-200 mb-4 sm:mb-5 md:mb-6 leading-relaxed text-sm sm:text-base md:text-lg">
                        {book.about}
                    </p> */}

                    <div className="flex flex-col items-center sm:flex-row sm:justify-start gap-3 md:gap-4 w-full">
                        <a
                            href="/excerpt"
                            className="bg-green-500 w-1/2 md:w-3/5 lg:w-2/5 hover:bg-green-900 text-white font-semibold uppercase py-2 sm:py-3 px-6 text-sm sm:text-base md:text-lg rounded-full text-center flex-1 sm:flex-none transition-all duration-300"
                        >
                            Read an Excerpt
                        </a>
                        <a
                            href="/sample"
                            className="bg-green-500 w-1/2 md:w-3/5 lg:w-2/5 hover:bg-green-900 text-white font-semibold uppercase py-2 sm:py-3 px-6 text-sm sm:text-base md:text-lg rounded-full text-center flex-1 sm:flex-none transition-all duration-300"
                        >
                            Listen to a Sample
                        </a>
                        <a
                            href="/extras"
                            className="bg-green-500 w-1/2 md:w-1/3 lg:w-1/5 hover:bg-green-900 text-white font-semibold uppercase py-2 sm:py-3 px-6 text-sm sm:text-base md:text-lg rounded-full text-center flex-1 sm:flex-none transition-all duration-300"
                        >
                            Extras
                        </a>
                    </div>
                </div>

                {/* Right column */}
                <div className="md:w-2/5 flex flex-col items-center">
                    {book.image ? (
                        <img
                            src={`${import.meta.env.VITE_API_URL}/uploads/${book.image}`}
                            alt={book.title}
                            className="w-60 sm:w-64 md:w-72 h-auto rounded-lg shadow-lg mb-6 object-contain"
                        />
                    ) : (
                        <div className="w-60 sm:w-64 md:w-72 h-64 bg-gray-200 flex items-center justify-center rounded-lg mb-6">
                            <span className="text-gray-500 text-sm sm:text-base md:text-lg">No image available</span>
                        </div>
                    )}

                    {/* Buy Links */}
                    <div className="w-full flex flex-col items-center mb-6">
                        <h3 className="text-gray-100 uppercase font-semibold mb-2 text-base sm:text-lg md:text-xl">
                            Buy the Book
                        </h3>
                        <div className="flex flex-col w-1/2 lg:1/2 md:w-2/3 gap-2">
                            {book.buyLinks?.length > 0 ? (
                                book.buyLinks.map((link, i) => (
                                    <a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-green-500 hover:bg-black text-white font-medium uppercase text-center py-2 sm:py-3 text-sm sm:text-base md:text-lg transition duration-200"
                                    >
                                        {link.name}
                                    </a>
                                ))
                            ) : (
                                <p className="text-green-500 text-sm sm:text-base md:text-lg">No buy links available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <hr className="mt-5 border-gray-200" />

            <div className="mt-4 w-full">
                {book.reviews?.length > 0 ? (
                    <ul className="space-y-3 sm:space-y-4">
                        {book.reviews.map((rev, i) => (
                            <li key={i} className="flex gap-2 pb-2 sm:pb-3 text-left">
                                <p className="italic text-gray-100 text-sm sm:text-base md:text-lg">
                                    "{rev.text} — {rev.reviewer}"
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-100 text-sm sm:text-base md:text-lg">No reviews available</p>
                )}
            </div>
        </div>
    );
};

export default BookPage;