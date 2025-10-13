import React, { useState, useEffect } from "react";

const Yearwise = () => {
  const [activeTab, setActiveTab] = useState("Journal");
  const [publications, setPublications] = useState([]); // State to hold fetched data
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch publications from the API when the component mounts
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/publications/yearwise');
        const data = await response.json();
        setPublications(data);
      } catch (error) {
        console.error("Failed to fetch publications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []); // Empty dependency array means this runs once on mount

  // Filter data based on the active tab from the state
  const filteredData = publications
    .filter((pub) => pub.category.toLowerCase() === activeTab.toLowerCase())
    .sort((a, b) => b.year - a.year);

  return (
    <div className="min-h-screen lg:mt-5 md:mt-8 max-w-6xl mx-auto text-white py-12 px-2">
      {/* Toggle Buttons */}
      <div className="flex justify-center mb-8">
        <div className="flex w-[600px] rounded-full border-2 border-white overflow-hidden">
          {["Journal", "Review Paper", "Conference Proceedings"].map(
            (tab, index) => (
              <React.Fragment key={index}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 font-medium transition-all duration-300 text-base sm:text-lg md:text-xl ${
                    activeTab === tab
                      ? "text-green-500"
                      : "text-white hover:bg-gray-200 hover:text-black"
                  }`}
                >
                  {tab}
                </button>
                {index < 2 && <div className="w-[2px] bg-white"></div>}
              </React.Fragment>
            )
          )}
        </div>
      </div>

      {/* Publications List */}
      <div className="flex flex-col text-left gap-4">
        {loading ? (
          <p>Loading publications...</p>
        ) : (
          <ol className="list-decimal list-inside space-y-3 text-sm sm:text-base md:text-lg">
            {filteredData.length > 0 ? (
              filteredData.map((pub, index) => (
                <li key={pub._id || index}> {/* Use database ID as key */}
                  {pub.title}{" "}
                  <span className="text-green-400 font-semibold">({pub.year})</span>
                </li>
              ))
            ) : (
              <p className="text-gray-400 text-sm sm:text-base md:text-lg">
                No publications available for this category.
              </p>
            )}
          </ol>
        )}
      </div>
    </div>
  );
};

export default Yearwise;