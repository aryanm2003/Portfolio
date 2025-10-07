import React from "react";
import { FaFacebook, FaXTwitter, FaLinkedin, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="mt-4 border-blue-100 px-4 sm:px-6 lg:px-10">
      {/* Bottom Divider */}
      <hr className="border-gray-200" />

      {/* Footer content */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-center md:text-left space-y-3 md:space-y-0">
        <p className="text-sm sm:text-base md:text-md text-gray-100">
          © {new Date().getFullYear()} MahendraVerma.in - All Rights Reserved.
        </p>

        <div className="flex gap-3 sm:gap-4 text-white">
          <a href="#" className="hover:text-green-500 transition">
            <FaFacebook className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </a>
          <a href="#" className="hover:text-green-500 transition">
            <FaXTwitter className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </a>
          <a href="#" className="hover:text-green-500 transition">
            <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </a>
          <a href="#" className="hover:text-green-500 transition">
            <FaYoutube className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
