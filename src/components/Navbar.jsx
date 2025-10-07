import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaXTwitter, FaLinkedin, FaYoutube } from "react-icons/fa6";
import { FaBars, FaTimes } from "react-icons/fa";
import Dropdown from "./Dropdown";
import booksData from "../database/books.json";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className=" text-white px-4 sm:px-6 lg:px-8">
      {/* Top Row */}
      <div className="flex justify-between items-center w-full px-2 py-2">
        <p className="text-base lg:text-2xl md:text-xl sm:text-md uppercase font-medium text-gray-200">
          Physicist and Thinker
        </p>

        {/* Social Icons */}
        <div className="hidden  sm:flex lg:gap-4 md:gap-2">
          <a href="#" className="hover:text-green-500"><FaFacebook size={24} /></a>
          <a href="#" className="hover:text-green-500"><FaXTwitter size={24} /></a>
          <a href="#" className="hover:text-green-500"><FaLinkedin size={24} /></a>
          <a href="#" className="hover:text-green-500"><FaYoutube size={24} /></a>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="sm:hidden flex items-center">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center">
        <h1 className="font-bold text-green-500 lg:text-5xl uppercase text-2xl md:text-4xl">
          Mahendra Verma
        </h1>
      </div>

      <hr className="my-3 border-gray-700" />

      {/* Desktop Navigation */}
      <nav className="hidden  sm:block">
        <ul className="flex justify-center lg:text-lg items-center gap-4 sm:gap-6 lg:gap-8 md:gap-3">
          <Link to="/"><li className="font-medium text-gray-100 hover:text-green-500 transition">HOME</li></Link>
          <Link to="/about"><li className="font-medium text-gray-100 hover:text-green-500 transition">ABOUT</li></Link>
          <Link to="/books"><li className="font-medium text-gray-100 hover:text-green-500 transition">
            <Dropdown title="BOOKS" items={booksData} basePath="books" />
          </li></Link>
          <li className="font-medium text-gray-100 hover:text-green-500 transition">
            <Dropdown
              title="PUBLICATIONS"
              staticItems={[
                { title: "Year-wise", slug: "yearwise" },
                { title: "Subject-wise", slug: "subjectwise" },
              ]}
              basePath="publications"
            />
          </li>
          <li className="font-medium text-gray-100 hover:text-green-500 transition">CODES</li>
          <Link to="/blogs"><li className="font-medium text-gray-100 hover:text-green-500 transition">BLOGS</li></Link>
          <Link to="/talks-articles"><li className="font-medium text-gray-100 hover:text-green-500 transition">TALKS/ARTICLES</li></Link>
          <Link to="/courses"><li className="font-medium text-gray-100 hover:text-green-500 transition">COURSES</li></Link>
          <Link to="/team"><li className="font-medium text-gray-100 hover:text-green-500 transition">TEAM</li></Link>
        </ul>
        <hr className="my-3 border-gray-700"/>
      </nav>

      {/* Mobile / Tablet Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-black border-t-4 mb-5 border-green-500 ">
          <ul className="flex flex-col items-start space-y-3 py-4 px-5">
            <Link to="/" onClick={closeMenu}><li className="hover:text-green-500">HOME</li></Link>
            <Link to="/about" onClick={closeMenu}><li className="hover:text-green-500">ABOUT</li></Link>
            <Dropdown title="BOOKS" items={booksData} basePath="books" />
            <Dropdown
              title="PUBLICATIONS"
              staticItems={[
                { title: "Year-wise", slug: "yearwise" },
                { title: "Subject-wise", slug: "subjectwise" },
              ]}
              basePath="publications"
            />
            <li className="hover:text-green-500">CODES</li>
            <Link to="/blogs" onClick={closeMenu}><li className="hover:text-green-500">BLOGS</li></Link>
            <Link to="/talks-articles" onClick={closeMenu}><li className="hover:text-green-500">TALKS/ARTICLES</li></Link>
            <Link to="/courses" onClick={closeMenu}><li className="hover:text-green-500">COURSES</li></Link>
            <Link to="/team" onClick={closeMenu}><li className="hover:text-green-500">TEAM</li></Link>
          </ul>

        </div>
      )}
    </header>
  );
};

export default Navbar;
