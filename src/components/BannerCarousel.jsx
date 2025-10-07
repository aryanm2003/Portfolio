import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import bannersData from "../database/banners.json";

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-change every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannersData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + bannersData.length) % bannersData.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % bannersData.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const banner = bannersData[currentIndex];

  return (
    <div className="relative mb-6 w-full">
      {/* Banner Image + Arrows + Dots */}
      <div
        className="relative w-full h-[420px] flex items-center justify-center transition-all duration-500"
        style={{
          backgroundImage: `url(${banner.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-100 hover:text-green-500 transition"
        >
          <ChevronLeft size={40} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-100 hover:text-green-500 transition"
        >
          <ChevronRight size={40} />
        </button>

        {/* Dots (Fixed at bottom center of banner) */}
        <div className="absolute bottom-4 flex space-x-2">
          {bannersData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition ${
                index === currentIndex ? "bg-green-500" : "bg-gray-300/70"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Banner Description */}
      <div className="w-full flex mt-2">
        <p className="text-sm text-left text-gray-100">{banner.description}</p>
      </div>
    </div>
  );
};

export default BannerCarousel;
