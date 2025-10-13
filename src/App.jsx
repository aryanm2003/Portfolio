import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
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
import EditBanners from './pages/admin/Editbanners'
import EditBooks from './pages/admin/Editbooks'
import EditYear from './pages/admin/EditYear'
import EditSubjectwise from './pages/admin/EditSubjectwise'
import EditTalkArticles from './pages/admin/EditTalkArticles'
import EditCourses from './pages/admin/EditCourses'
import EditTeamMembers from './pages/admin/EditTeamMembers'
import EditBlogs from './pages/admin/EditBlogs'

function App() {
  return (
    <>
      <Navbar/>
      <div>
        <Routes>
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
          <Route path='/admin' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path='/admin/manage-banners' element={<ProtectedRoute><EditBanners/></ProtectedRoute>}/>
          <Route path='/admin/manage-books' element={<ProtectedRoute><EditBooks/></ProtectedRoute>}/>
          <Route path='/admin/manage-yearwise-publications' element={<ProtectedRoute><EditYear/></ProtectedRoute>}/>
          <Route path='/admin/manage-subjectwise-publications' element={<ProtectedRoute><EditSubjectwise/></ProtectedRoute>}/>
          <Route path='/admin/manage-talks-articles' element={<ProtectedRoute><EditTalkArticles/></ProtectedRoute>}/>
          <Route path='/admin/manage-courses' element={<ProtectedRoute><EditCourses/></ProtectedRoute>}/>
          <Route path='/admin/manage-team-members' element={<ProtectedRoute><EditTeamMembers/></ProtectedRoute>}/>
          <Route path='/admin/manage-blogs' element={<ProtectedRoute><EditBlogs/></ProtectedRoute>}/>


        </Routes>
        </div>
      <Footer/>
    </>
  )
}

export default App
