import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import icons for a richer UI
import {
  LayoutTemplate, BookOpen, PenSquare, GraduationCap,
  Presentation, Users, BookCopy, ListTree, LogOut
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  // We create an array of objects to hold both the name and a corresponding icon
  const adminSections = [
    { name: 'Banners', icon: <LayoutTemplate size={32} /> },
    { name: 'Books', icon: <BookOpen size={32} /> },
    { name: 'Blogs', icon: <PenSquare size={32} /> },
    { name: 'Courses', icon: <GraduationCap size={32} /> },
    { name: 'Talks & Articles', icon: <Presentation size={32} /> },
    { name: 'Team Members', icon: <Users size={32} /> },
    { name: 'Yearwise Publications', icon: <BookCopy size={32} /> },
    { name: 'Subjectwise Publications', icon: <ListTree size={32} /> }
  ];

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <div className='mx-5'>
            <h1 className="text-3xl md:text-4xl text-left font-bold text-gray-100">
              Hello, Sir
            </h1>
            <p className="text-gray-400 mt-3">Welcome to your content management panel.</p>
          </div>
          <button
            onClick={handleLogout}
            className="  mx-6 text-red-400 hover:text-red-500 font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2"
          >
            <LogOut size={30} />
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mt-10">
          {adminSections.map((section) => (
            <Link
              key={section.name}
              to={`/admin/manage-${section.name
                .toLowerCase()
                .replace(/ & /g, '-')
                .replace(/ /g, '-')}`}
              className=" border border-gray-700 p-8 rounded-xl shadow-lg hover:border-green-500 hover:-translate-y-2 transition-all duration-300 group w-72"
            >
              <div className="text-green-400 group-hover:text-green-300 transition-colors flex justify-center">
                {section.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-200 mt-5 text-center group-hover:text-white transition-colors">
                Manage {section.name}
              </h2>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;