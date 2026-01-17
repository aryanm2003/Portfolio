import React, { useState, useEffect } from "react";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Team | Mahendra Verma";

    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/team`);
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Filter the fetched data into present and past members
  const presentMembers = teamMembers.filter((m) => m.type === "present");
  const pastMembers = teamMembers.filter((m) => m.type === "past");

  return (
    <div className="text-white lg:mt-5 md:mt-5 py-5 px-6">
      <h1 className="text-center text-4xl lg:text-5xl sm:text-5xl md:text-5xl uppercase font-bold mb-8">
        My Team
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading team members...</p>
      ) : (
        <>
          {/* Present Members */}
          <h3 className="text-2xl sm:text-3xl md:text-3xl uppercase font-semibold mb-6 text-white text-center">
            Present Members
          </h3>
          <div className="flex flex-wrap justify-center gap-8 mx-auto mb-12">
            {presentMembers.map((member) => (
              <div
                key={member._id}
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
            {pastMembers.map((member) => (
              <div
                key={member._id}
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
        </>
      )}
    </div>
  );
};

export default Team;