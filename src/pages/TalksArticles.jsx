import React, { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";
import talksData from "../database/talks.json";
import articlesData from "../database/articles.json";

const TalksArticles = () => {
  const [activeTab, setActiveTab] = useState("talks");
  const data = activeTab === "talks" ? talksData : articlesData;

  useEffect(() => {
    document.title = "Talk/Articles | Mahendra Verma";
  }, []);

  return (
    <div className="lg:mt-5 md:mt-5 min-h-screen max-w-7xl justify-center text-white py-12 px-6">
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-10">
        <div className="flex w-70 rounded-full border-2 border-white-500 overflow-hidden">
          <button
            onClick={() => setActiveTab("talks")}
            className={`flex-1 py-3 font-medium transition-all duration-300 text-base lg:text-3xl sm:text-xl md:text-2xl ${
              activeTab === "talks"
                ? "text-green-500"
                : "text-white-500 hover:bg-gray-200 hover:text-black"
            }`}
          >
            Talks
          </button>
          <div className="w-[2px] bg-white"></div>
          <button
            onClick={() => setActiveTab("articles")}
            className={`flex-1 py-3 font-medium transition-all duration-300 text-base lg:text-3xl sm:text-xl md:text-2xl ${
              activeTab === "articles"
                ? "text-green-500"
                : "text-white-500 hover:bg-gray-200 hover:text-black"
            }`}
          >
            Articles
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
        </div>
      </div>
    </div>
  );
};

export default TalksArticles;
