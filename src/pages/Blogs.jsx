import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import blogsData from "../database/blogs.json";

const Blogs = () => {
  useEffect(() => {
    document.title = "Blogs | Mahendra Verma";
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
        {blogsData.map((blog, index) => (
          <Link key={index} to={`/blogs/${generateSlug(blog.title)}`}>
            <BlogCard
              title={blog.title}
              content={blog.content}
              image={blog.image}
              docLink={null}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
