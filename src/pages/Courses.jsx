import React, { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";
import coursesData from "../database/courses.json";

const Courses = () => {
  const [activeTab, setActiveTab] = useState("online");

  // Filter data dynamically based on category
  const data = coursesData.filter((course) => course.category === activeTab);

  useEffect(() => {
    document.title = "Courses | Mahendra Verma";
  }, []);

  return (
    <div className="min-h-screen lg:mt-5 md:mt-5 max-w-7xl justify-center text-white py-12 px-6">
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-10">
        <div className="flex w-80 rounded-full border-2 border-white overflow-hidden">
          <button
            onClick={() => setActiveTab("online")}
            className={`flex-1 py-3 font-medium transition-all duration-300 text-xl lg:text-3xl sm:text-xl md:text-2xl ${
              activeTab === "online"
                ? "text-green-500"
                : "text-white hover:bg-gray-200 hover:text-black"
            }`}
          >
            Online
          </button>
          <div className="w-[2px] bg-white"></div>
          <button
            onClick={() => setActiveTab("offline")}
            className={`flex-1 py-3 font-medium transition-all duration-300 text-xl lg:text-3xl sm:text-xl md:text-2xl ${
              activeTab === "offline"
                ? "text-green-500"
                : "text-white hover:bg-gray-200 hover:text-black"
            }`}
          >
            Offline
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="transition-all duration-500 ease-in-out">
        <div className="flex flex-col items-center gap-10">
          {data.map((item, index) => (
            <div className="w-full md:w-7/8 lg:w-[85%]" key={index}>
              <BlogCard
                title={item.title}
                content={item.content}
                image={item.image}
                docLink={item.docLink}
              />
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-gray-400">No courses available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
