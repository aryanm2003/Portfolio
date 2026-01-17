import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom' // Import useLocation
// ... import all your existing pages ...
import Books from './pages/Books'
import Home from './pages/Home'
import Bookpage from './pages/Bookpage'
import Footer from './components/Footer'
import Team from './pages/Team'
import Blogs from './pages/Blogs'
import TalksArticles from './pages/TalksArticles'
import About from './pages/About'
import Yearwise from './pages/Yearwise'
import Courses from './pages/Courses'
import Subjectwise from './pages/Subjectwise'
import BlogPage from './pages/Blogpage'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './pages/admin/AdminLayout' // Import the new layout

// Import all Admin Pages
import EditBanners from './pages/admin/Editbanners'
import EditBooks from './pages/admin/Editbooks'
import EditYear from './pages/admin/EditYear'
import EditSubjectwise from './pages/admin/EditSubjectwise'
import EditTalkArticles from './pages/admin/EditTalkArticles'
import EditCourses from './pages/admin/EditCourses'
import EditTeamMembers from './pages/admin/EditTeamMembers'
import EditBlogs from './pages/admin/EditBlogs'

function App() {
  const location = useLocation();
  // Check if current path starts with /admin
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Hide Public Navbar on Admin Pages */}
      {!isAdminRoute && <Navbar/>}
      
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home/>}/>
          <Route path='/books' element={<Books/>}/>
          <Route path="/books/:slug" element={<Bookpage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/about" element={<About />} />
          <Route path="/publications/yearwise" element={<Yearwise />} />
          <Route path="/publications/subjectwise" element={<Subjectwise />} />
          <Route path="/blogs/:slug" element={<BlogPage />} />
          <Route path='/talks-articles' element={<TalksArticles/>}/>
          <Route path='/courses' element={<Courses/>}/>

          {/* Admin Routes Wrapped in Layout */}
          <Route path='/admin' element={<ProtectedRoute><AdminLayout/></ProtectedRoute>}>
            <Route index element={<Dashboard/>}/>
            <Route path='manage-banners' element={<EditBanners/>}/>
            <Route path='manage-books' element={<EditBooks/>}/>
            <Route path='manage-yearwise-publications' element={<EditYear/>}/>
            <Route path='manage-subjectwise-publications' element={<EditSubjectwise/>}/>
            <Route path='manage-talks-articles' element={<EditTalkArticles/>}/>
            <Route path='manage-courses' element={<EditCourses/>}/>
            <Route path='manage-team-members' element={<EditTeamMembers/>}/>
            <Route path='manage-blogs' element={<EditBlogs/>}/>
          </Route>

        </Routes>
      </div>
      
      {/* Hide Public Footer on Admin Pages */}
      {!isAdminRoute && <Footer/>}
    </>
  )
}

export default App