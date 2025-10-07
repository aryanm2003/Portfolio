import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const Dropdown = ({ title, items = [], staticItems = [], basePath }) => {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200) // delay close
  }

  // Decide which items to render
  const menuItems = staticItems.length > 0 ? staticItems : items

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dropdown Button */}
      <button className="flex items-center gap-1 font-medium text-gray-100 hover:text-green-500 cursor-pointer transition-colors duration-200 focus:outline-none  ">
        <span>{title}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 bg-black border-t-4 border-green-500 shadow-lg z-10 min-w-[200px] sm:min-w-[250px] lg:min-w-[250px] md:min-w-[200px]">
          <ul className="py-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={`/${basePath}/${item.slug}`}
                  className="block w-full py-2 sm:py-3 px-4 text-md text-gray-100 hover:text-green-500 transition-colors duration-150 "
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Dropdown
