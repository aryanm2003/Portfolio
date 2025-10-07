import React, { useEffect } from "react";

const About = () => {
  useEffect(() => {
    document.title = "About | Mahendra Verma";
  }, []);

  return (
    <div className="min-h-screen max-w-5xl lg:my-4 md:my-4 mx-auto py-12 px-3 text-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Side - About Text */}
        <div className="md:col-span-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-left uppercase mb-4 text-green-400">
            About Mahendra Verma
          </h2>

          <p className="text-gray-200 text-left mb-4 leading-relaxed text-sm sm:text-base md:text-md">
            Dr. Mahendra Kumar Verma is a distinguished Professor in the Department of Physics at the Indian Institute of Technology, Kanpur. He is a leading scientist and researcher, renowned for his significant contributions to the field of fluid dynamics and turbulence. His work bridges the gap between theoretical physics and high-performance computing, providing deep insights into some of the most complex phenomena in nature.
          </p>

          <p className="text-gray-200 text-left mb-4 leading-relaxed text-sm sm:text-base md:text-md">
            Professor Verma's primary research is centered on the dynamics of turbulence, chaos, and nonlinear systems. He has extensively studied hydrodynamic and magnetohydrodynamic (MHD) turbulence, turbulent convection, and dynamo theory. His research employs a combination of direct numerical simulations (DNS), theoretical modeling, and data analysis to explore energy transfers, spectral properties, and the underlying structures of turbulent flows. These studies are crucial for understanding complex systems ranging from weather patterns and climate modeling to astrophysical phenomena like solar flares and galactic dynamics.
          </p>

          <p className="text-gray-200 text-left  lg:md-4 leading-relaxed text-sm sm:text-base md:text-md">
            Professor Verma's primary research is centered on the dynamics of turbulence, chaos, and nonlinear systems. He has extensively studied hydrodynamic and magnetohydrodynamic (MHD) turbulence, turbulent convection, and dynamo theory. His research employs a combination of direct numerical simulations (DNS), theoretical modeling, and data analysis to explore energy transfers, spectral properties, and the underlying structures of turbulent flows. These studies are crucial for understanding complex systems ranging from weather patterns and climate modeling to astrophysical phenomena like solar flares and galactic dynamics.
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="flex md:mt-[55%]  lg:mt-[25%] justify-center">
          <img
            src="https://i.postimg.cc/MGkG30n5/book1.jpg"
            alt="Professor Mahendra Verma"
            className="w-48 sm:w-56 md:w-64 h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      <hr className="bg-gray-200 mt-6" />

      {/* Awards Section */}
      <div className="mt-5 mb-5">
        <h3 className="text-lg sm:text-xl md:text-2xl text-left font-semibold uppercase mb-2 text-green-400">
          Awards Received
        </h3>
        <ul className="list-disc text-left pl-6 space-y-2 text-gray-200 text-sm sm:text-base md:text-lg">
          <li>Shanti Swarup Bhatnagar Prize in Physical Sciences</li>
          <li>Fellow of Indian Academy of Sciences</li>
          <li>Best Researcher Award - IIT Kanpur</li>
          <li>Distinguished Scientist Award (International Society of Physics)</li>
        </ul>
      </div>

      <hr className="bg-gray-200" />

      {/* Research Interests Section */}
      <div className="mt-5">
        <h3 className="text-lg sm:text-xl md:text-2xl text-left font-semibold uppercase mb-3 text-green-400">
          Research Interests
        </h3>
        <ul className="list-disc text-left pl-6 space-y-2 text-gray-200 text-sm sm:text-base md:text-lg">
          <li>Fluid Dynamics and Turbulence</li>
          <li>Nonlinear Physics and Chaos Theory</li>
          <li>Computational Physics</li>
          <li>Energy Transfer in Complex Systems</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
