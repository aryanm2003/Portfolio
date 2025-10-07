import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import blogsData from "../database/blogs.json";
import { ArrowLeft, Share2 } from "lucide-react";

const BlogPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const blog = blogsData.find(
    (item) =>
      item.title.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );

  useEffect(() => {
    if (blog) document.title = `${blog.title} | Mahendra Verma`;
  }, [blog]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        <h2>Blog not found</h2>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen lg:mt-8 md:mt-5 py-8 px-4 md:py-12 lg:py-16">
      <div className="max-w-4xl mx-auto text-gray-100 p-4 sm:p-6 md:p-8 lg:p-10 relative">
        {/* Header Icons */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-100 hover:text-green-600 transition text-sm sm:text-base"
          >
            <ArrowLeft size={20} /> <span>Back</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-gray-100 hover:text-green-600 transition text-sm sm:text-base"
          >
            <Share2 size={20} />
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>
        </div>

        {/* Blog Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl text-green-500 font-bold text-left mb-5">
          {blog.title}
        </h1>

        {/* Blog Content */}
        <div
          className="prose prose-invert text-left max-w-none text-gray-200 text-base sm:text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.fullContent }}
        />
      </div>
    </div>
  );
};

export default BlogPage;
