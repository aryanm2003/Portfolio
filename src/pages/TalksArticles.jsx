import React, { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";

const TalksArticles = () => {
  const [activeTab, setActiveTab] = useState("talks");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Talks & Articles | Mahendra Verma";

    const fetchItems = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/talks-articles`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch talks and articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter the fetched data based on the active tab
  // Note: We adjust the type to match the activeTab ('talks' -> 'talk')
  const filteredData = items.filter(item => item.type === activeTab.slice(0, -1));

  return (
    <div className="lg:mt-5 md:mt-5 min-h-screen max-w-7xl justify-center text-white py-12 px-6">
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-10">
        <div className="flex w-70 rounded-full border-2 border-white overflow-hidden">
          <button
            onClick={() => setActiveTab("talks")}
            className={`flex-1 py-3 font-medium transition-all duration-300 text-base lg:text-3xl sm:text-xl md:text-2xl ${
              activeTab === "talks"
                ? "text-green-500"
                : "text-white hover:bg-gray-200 hover:text-black"
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
                : "text-white hover:bg-gray-200 hover:text-black"
            }`}
          >
            Articles
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="transition-all duration-500 ease-in-out">
        <div className="flex flex-col items-center gap-10">
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div className="w-full md:w-7/8 lg:w-[85%]" key={item._id}>
                <BlogCard
                  title={item.title}
                  content={item.content}
                  image={item.image}
                  docLink={item.docLink}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No {activeTab} available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalksArticles;