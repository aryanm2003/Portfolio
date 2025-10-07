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
        </Routes>
        </div>
      <Footer/>
    </>
  )
}

export default App
