import React, { useState } from 'react'; // <-- FIX IS HERE

import BannerCarousel from '../components/BannerCarousel';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  // Just taking the first banner for this example
  const [email, setEmail] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    alert('Your session has expired. Please log in again.');
    navigate('/'); // Or navigate to a specific login page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting with:", { email, suggestion });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, suggestion }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Admin login was successful
        localStorage.setItem('adminToken', data.token);

        // Set a timer for 30 minutes (30 * 60 * 1000 milliseconds)
        setTimeout(handleLogout, 20 * 60 * 1000);

        // Navigate to the admin dashboard
        navigate('/admin');

      } else {
        // This was a feedback submission or a failed login attempt
        alert(data.message || 'Feedback submitted!');
        setEmail('');
        setSuggestion('');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen mt-4 text-white font-sans">
      <BannerCarousel/>

      {/* Main content */}
      <div className="flex flex-col md:flex-row justify-between px-4 gap-4 md:px-24 py-12 ">
        {/* Who is Fonda? */}
        <div className="w-full md:w-1/3 mb-10 md:mb-0">
          <h2 className="text-green-500 text-lg text-left font-semibold mb-4">
            Who is Mahendra Verma?
          </h2>
          <p className="text-sm w-[90%] text-left">
            Fonda Lee is the award-winning science fiction and fantasy author of the Green Bone Saga (Orbit), Unethered Sky (Tordotcom), the Exo series (Scholastic), and Zeroboxer (Flux)...
          </p>
          <a href="/about" className="text-green-500 text-left underline text-xs block mt-3">
            Read More
          </a>
        </div>


        {/* What's New */}
        <div className="w-full md:w-1/3 mb-10 md:mb-0">
          <h2 className="text-green-500 text-left text-lg font-semibold mb-4">WHAT'S NEW</h2>
          <ul className="text-sm w-[90%] text-left space-y-2">
            <li>Streets of Jade: the Green Bone Saga RPG</li>
            <li>Presenting the Cold Edition of the Green Bone Saga</li>
            <li>Breath of the Dragon is one of Google's favorite books of 2025 so far</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="w-full md:w-1/3 ">
          <h2 className="text-green-500 text-left text-lg font-semibold mb-4">NEWSLETTER</h2>
          <p className="text-sm  text-left w-[90%] mb-3">
            Sign up for Fonda’s quarterly email newsletter to receive news on book releases, events, exclusive content, sneak peeks, giveaways, and other random cool stuff.
          </p>
          <form onSubmit={handleSubmit} className="flex max-w-[70%] mx-auto flex-col space-y-4">
            <div className="flex flex-col">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 rounded text-white border border-gray-200 focus:outline-none bg-gray-800"
              />
            </div>
            
            <div className="flex flex-col">
              <textarea
                placeholder="Write your suggestion..."
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                className="p-2 rounded h-[60px] text-white border border-gray-200 focus:outline-none bg-gray-800 resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-gray-100 hover:bg-green-400 text-black font-semibold py-2 rounded transition"
            >
              Send
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Home;