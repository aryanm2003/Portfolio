import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutTemplate, BookOpen, PenSquare, GraduationCap, 
  Presentation, Users, BookCopy, ListTree, LogOut, 
  Menu, X, Home 
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <Home size={20} />, exact: true },
    { name: 'Banners', path: '/admin/manage-banners', icon: <LayoutTemplate size={20} /> },
    { name: 'Books', path: '/admin/manage-books', icon: <BookOpen size={20} /> },
    { name: 'Blogs', path: '/admin/manage-blogs', icon: <PenSquare size={20} /> },
    { name: 'Courses', path: '/admin/manage-courses', icon: <GraduationCap size={20} /> },
    { name: 'Talks & Articles', path: '/admin/manage-talks-articles', icon: <Presentation size={20} /> },
    { name: 'Team', path: '/admin/manage-team-members', icon: <Users size={20} /> },
    { name: 'Yearwise Pubs', path: '/admin/manage-yearwise-publications', icon: <BookCopy size={20} /> },
    { name: 'Subjectwise Pubs', path: '/admin/manage-subjectwise-publications', icon: <ListTree size={20} /> },
  ];

  return (
    // FIX 1: Removed 'bg-gray-950' so the body background shows through
    // Added 'bg-black/50' for a slight dimming effect over your background image
    <div className="fixed inset-0 z-50 flex h-screen bg-black/40 font-sans overflow-hidden">
      
      {/* Sidebar with Glass Effect */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-black/60 backdrop-blur-md border-r border-white/10 transition-all duration-300 flex flex-col relative z-20 h-full shadow-2xl`}
      >
        {/* Header */}
        <div className="h-16 flex items-center mx-auto gap-20 justify-between px-4 border-b border-white/10">
          <span className={`font-bold text-white text-lg tracking-wide truncate ${!isSidebarOpen && 'hidden'}`}>
            Admin<span className="text-green-500">Panel</span>
          </span>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 hover:bg-white/10 mx-auto rounded-lg text-gray-300 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-green-600/80 text-white shadow-lg shadow-green-900/20 border border-green-500/30' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'}
                  `}
                >
                  <div className={`transition-transform duration-200 ${!isSidebarOpen && 'mx-auto group-hover:scale-110'}`}>
                    {item.icon}
                  </div>
                  <span className={`whitespace-nowrap font-medium ${!isSidebarOpen && 'hidden'}`}>
                    {item.name}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t  bg-black/20">
          <button 
            onClick={handleLogout}
            className={`flex items-center  gap-3 w-full px-3 py-2 mb-5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} />
            <span className={`font-medium ${!isSidebarOpen && 'hidden'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - Transparent so bg shows */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
           <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;