import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/banners');
        const data = await response.json();
        setBanners(data);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-change every 5 seconds, only if there are banners
  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const prevSlide = () => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return <div className="relative mb-6 w-full h-[420px] bg-gray-800 flex justify-center items-center"><p className="text-white">Loading Banners...</p></div>;
  }
  
  if (banners.length === 0) {
    return <div className="relative mb-6 w-full h-[420px] bg-gray-900 flex justify-center items-center"><p className="text-white">No banners available.</p></div>;
  }

  const banner = banners[currentIndex];

  return (
    <div className="relative mb-6 w-full">
      {/* Banner Image + Arrows + Dots */}
      <div
        className="relative w-full h-[420px] flex items-center justify-center transition-all duration-500 bg-gray-900"
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
          {banners.map((_, index) => (
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