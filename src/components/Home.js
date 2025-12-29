import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import api from "../api";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/blogs")
      .then((res) => {
        console.log("Blogs:", res.data);
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch blogs.");
        setLoading(false);
      });
  }, []);

  const formatDate = (date) => {
    if (!date) return "No Date";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) return <div className="container"><p className="loading-text">Loading blogs...</p></div>;
  if (error) return <div className="container"><p className="error-text">{error}</p></div>;

  return (
    <div className="container">
      <div className="header-section">
        <h1 className="title">Daily Diary</h1>
        <div className="header-buttons">
          <button
            onClick={() => navigate("/create")}
            className="btn btn-add"
          >
            <span>✨</span> Add New Blog
          </button>
          <button
            onClick={() => navigate("/private")}
            className="btn btn-private"
          >
            <span>🔒</span> Private
          </button>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="empty-state">
          <p>No blogs available. Create your first blog!</p>
        </div>
      ) : (
        blogs.map((blog) => (
          <div 
            className="entry blog-card" 
            key={blog._id}
            onClick={() => navigate(`/blog/${blog._id}`)}
          >
            {blog.image && (
              <div className="blog-card-image">
                <img src={blog.image} alt={blog.title} />
              </div>
            )}
            <div className="blog-card-content">
              <div className="date">{formatDate(blog.createdAt)}</div>
              <h2>{blog.title}</h2>
              <p className="blog-card-excerpt">
                {blog.content.length > 150 
                  ? blog.content.substring(0, 150) + "..." 
                  : blog.content}
              </p>
              <div className="blog-card-footer">
                <span className="blog-card-author">By {blog.author || "Unknown"}</span>
                <span className="blog-card-read-more">Read more →</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;


