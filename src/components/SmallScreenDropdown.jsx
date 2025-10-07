// SmallScreenDropdown.jsx
import React, { useState, useRef } from "react";

const SmallScreenDropdown = ({ title, items = [], onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="flex justify-center md:hidden mb-6"> {/* Center wrapper */}
      <div
        className="relative inline-block w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dropdown Button */}
        <button
          className="flex justify-between items-center w-full px-4 py-3 font-medium text-gray-100  border-2 border-green-500 rounded-md hover:text-green-500 transition-colors duration-200 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{title}</span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        {/* Dropdown Items */}
        {isOpen && (
          <div className="absolute left-0  top-full mt-2 bg-black border-t-4 border-green-500 shadow-lg z-10 w-[240px] rounded-md">
            <ul className="py-2">
              {items.map((item, index) => (
                <li key={index}>
                  <button
                    className="block w-[220px] mx-auto py-3 px-4 text-left text-base font-semibold text-gray-100 hover:text-green-500 transition-colors duration-150 uppercase"
                    onClick={() => {
                      if (onSelect) onSelect(item);
                      setIsOpen(false);
                    }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmallScreenDropdown;
