import React from "react";
import teamData from "../database/teams.json";
import { useEffect } from "react";

const Team = () => {
  const presentMembers = teamData.filter((m) => m.type === "present");
  const pastMembers = teamData.filter((m) => m.type === "past");

  useEffect(() => {
    document.title = "Team | Mahendra Verma";
  }, []);

  return (
    <div className="text-white lg:mt-5 md:mt-5 py-5 px-6">
      <h1 className="text-center text-4xl lg:text-5xl sm:text-5xl md:text-5xl uppercase font-bold mb-8">
        My Team
      </h1>

      {/* Present Members */}
      <h3 className="text-2xl sm:text-3xl md:text-3xl uppercase font-semibold mb-6 text-white text-center">
        Present Members
      </h3>
      <div className="flex flex-wrap justify-center gap-8 mx-auto mb-12">
        {presentMembers.map((member, index) => (
          <div
            key={index}
            className="text-left rounded-lg shadow-lg p-4 w-70"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-70 object-cover rounded-md mb-4"
            />
            <h3 className="text-base sm:text-lg md:text-xl font-bold">
              {member.name}, {member.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 mt-2">
              {member.about}
            </p>
          </div>
        ))}
      </div>

      {/* Past Members */}
      <h3 className="text-2xl sm:text-3xl md:text-3xl font-semibold uppercase mb-6 text-white text-center">
        Past Members
      </h3>
      <div className="flex flex-wrap gap-8 justify-center max-w-6xl mx-auto">
        {pastMembers.map((member, index) => (
          <div
            key={index}
            className="text-left rounded-lg w-70 shadow-lg p-4"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-70 object-cover rounded-md mb-4"
            />
            <h3 className="text-base sm:text-lg md:text-xl font-bold">
              {member.name}, {member.title}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 mt-2">
              {member.about}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
