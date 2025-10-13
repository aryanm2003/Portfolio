import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2 } from "lucide-react";

const BlogPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/${slug}`);
        if (!response.ok) {
          // If the blog is not found (404) or other error, throw an error
          throw new Error('Blog not found');
        }
        const data = await response.json();
        setBlog(data);
        // Set the document title after the blog data is fetched
        document.title = `${data.title} | Mahendra Verma`;
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        setBlog(null); // Ensure blog is null if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]); // Re-run the effect if the slug changes

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied!" text after 2 seconds
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        <h2>Loading blog post...</h2>
      </div>
    );
  }
  
  // Not found state
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300">
        <h2>Blog not found</h2>
      </div>
    );
  }

  // Render the blog post
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