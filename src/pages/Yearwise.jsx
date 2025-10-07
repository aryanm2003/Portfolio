import React, { useState } from "react";
import publicationsData from "../database/publications.json";

const Yearwise = () => {
  const [activeTab, setActiveTab] = useState("Journal");

  // Filter data based on active tab
  const filteredData = publicationsData
    .filter((pub) => pub.category.toLowerCase() === activeTab.toLowerCase())
    .sort((a, b) => b.year - a.year); // latest first

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
        <ol className="list-decimal list-inside space-y-3 text-sm sm:text-base md:text-lg">
          {filteredData.map((pub, index) => (
            <li key={index}>
              {pub.title}{" "}
              <span className="text-green-400 font-semibold">({pub.year})</span>
            </li>
          ))}
        </ol>
        {filteredData.length === 0 && (
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            No publications available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Yearwise;
