import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ title, content, image, docLink, slug }) => {
  const contentRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      setIsTruncated(scrollHeight > clientHeight + 5);
    }
  }, [content]);

  return (
    <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6 mb-8 sm:mb-12">
      {/* Image */}
      <div className="w-full md:w-1/3">
        <img
          src={image}
          alt={title}
          className="w-full h-48 sm:h-60 rounded-md shadow-lg object-cover"
        />
      </div>

      {/* Content */}
      <div className="w-full md:w-2/3">
        <h2 className="text-2xl sm:text-3xl text-left text-gray-200 font-bold mb-2 sm:mb-3">
          {title}
        </h2>

        <p
          ref={contentRef}
          className="text-gray-200 text-base sm:text-lg text-left mb-3 sm:mb-4 overflow-hidden line-clamp-5"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 5,
            WebkitBoxOrient: "vertical",
          }}
        >
          {content}
        </p>

        {isTruncated && (
          <span className="text-gray-400 text-lg select-none"></span>
        )}

        <div className="mt-auto">
          {docLink ? (
            <a
              href={docLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 font-semibold text-sm sm:text-base text-left hover:underline block mt-1 sm:mt-2"
            >
              Read More
            </a>
          ) : slug ? (
            <Link
              to={`/blogs/${slug}`}
              className="text-green-500 font-semibold text-sm sm:text-base text-left hover:underline block mt-1 sm:mt-2"
            >
              Read More
            </Link>
          ) : (
            <p className="text-green-500 font-semibold text-sm sm:text-base text-left hover:underline mt-1 sm:mt-2">
              Read More
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
