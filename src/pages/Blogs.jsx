import React, {useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Blogs | Mahendra Verma";

    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);


  // Convert blog title into slug
  const generateSlug = (title) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  return (
    <div className="md:mt-5 lg:mt-5 max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-semibold mb-6 sm:mb-10 text-center">
        My Blogs
      </h1>

      <div className="flex flex-col gap-6 sm:gap-8">
        {loading ? (
          <p className="text-center text-gray-400">Loading blogs...</p>
        ) : blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              title={blog.title}
              content={blog.content}
              image={blog.image}
              docLink={`/blogs/${blog.slug}`} // 👈 pass link instead of wrapping
            />
          ))
        ) : (
          <p className="text-center text-gray-400">No blogs have been posted yet.</p>
        )}
      </div>

    </div>
  );
};

export default Blogs;
