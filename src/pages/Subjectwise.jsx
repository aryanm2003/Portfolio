import React, { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";
import SmallScreenDropdown from "../components/SmallScreenDropdown";

const Subjectwise = () => {
  const categories = [
    "MHD Turbulence",
    "Turbulence Convection",
    "Turbulence (Misc)",
    "Nonequilibrium Statmech",
    "HPC",
  ];

  const [activeTab, setActiveTab] = useState(categories[0]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Publications | Mahendra Verma";
    
    const fetchPublications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/publications/subjectwise');
        const data = await response.json();
        setPublications(data);
      } catch (error) {
        console.error("Failed to fetch publications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const filteredData = publications.filter(
    (item) => item.category === activeTab
  );

  return (
    <div className="min-h-screen lg:mt-5 md:mt-5 max-w-6xl mx-auto text-white py-12 px-6">
      {/* Tabs / Dropdown */}
      <div className="mb-8">
        <div className="sm:hidden mb-2 flex justify-center">
          <SmallScreenDropdown
            title={activeTab}
            items={categories}
            onSelect={(category) => setActiveTab(category)}
          />
        </div>
        <div className="hidden sm:flex justify-center">
          <div className="flex flex-wrap rounded-full border-2 border-white overflow-hidden">
            {categories.map((category, index) => (
              <React.Fragment key={category}>
                <button
                  onClick={() => setActiveTab(category)}
                  className={`flex-1 py-3 px-4 sm:px-6 font-medium transition-all duration-300 text-base sm:text-lg md:text-2xl ${
                    activeTab === category
                      ? "text-green-500"
                      : "text-white hover:bg-gray-200 hover:text-black"
                  }`}
                >
                  {category}
                </button>
                {index < categories.length - 1 && <div className="w-[2px] bg-white"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="transition-all duration-500 ease-in-out">
        <div className="flex flex-col items-center gap-10">
          {loading ? (
            <p>Loading publications...</p>
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
              // FIX: Use the unique database ID for the key
              <div className="w-full md:w-7/8 lg:w-[85%]" key={item._id}> 
                <BlogCard
                  title={item.title}
                  content={item.description}
                  image={item.image}
                  docLink={item.link}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-lg sm:text-xl md:text-2xl">
              No publications available for this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subjectwise;