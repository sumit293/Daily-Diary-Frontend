import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PrivateCreateBlog from "./PrivateCreateBlog";
import "../index.css";

function PrivateDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  // Check if already authenticated from sessionStorage
  useEffect(() => {
    const auth = sessionStorage.getItem("privateAuth");
    if (auth === "authenticated") {
      setIsAuthenticated(true);
      fetchPersonalBlogs();
    }
  }, []);

  const fetchPersonalBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/blogs/personal");
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch personal blogs.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (password === "1947") {
      setIsAuthenticated(true);
      sessionStorage.setItem("privateAuth", "authenticated");
      fetchPersonalBlogs();
    } else {
      setError("Access denied. Incorrect code.");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("privateAuth");
    setBlogs([]);
    setPassword("");
  };

  const formatDate = (date) => {
    if (!date) return "No Date";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="private-login-container">
        <div className="private-login-box">
          <div className="private-login-header">
            <h1 className="private-title">🔒 Private Space</h1>
            <p className="private-subtitle">Enter access code to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="private-login-form">
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access code"
                className="private-input"
                required
                autoFocus
              />
              {error && <div className="error-message">{error}</div>}
            </div>
            
            <button type="submit" className="btn-private-login">
              <span>🚀</span> Access Private Space
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="private-dashboard">
      <div className="private-header">
        <div className="private-header-content">
          <h1 className="private-dashboard-title">✨ My Private Space</h1>
          <div className="private-header-actions">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn-private-add"
            >
              {showCreateForm ? "📋 View Blogs" : "➕ New Blog"}
            </button>
            <button onClick={handleLogout} className="btn-private-logout">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="private-content">
        {showCreateForm ? (
          <PrivateCreateBlog
            onSuccess={() => {
              setShowCreateForm(false);
              fetchPersonalBlogs();
            }}
          />
        ) : (
          <div className="private-blogs-container">
            {loading ? (
              <div className="loading-text">Loading your blogs...</div>
            ) : blogs.length === 0 ? (
              <div className="empty-state-private">
                <p>No personal blogs yet. Create your first one! 🎉</p>
              </div>
            ) : (
              blogs.map((blog) => (
                <div className="private-blog-card" key={blog._id}>
                  {blog.image && (
                    <div className="private-blog-image">
                      <img src={blog.image} alt={blog.title} />
                    </div>
                  )}
                  <div className="private-blog-content">
                    <div className="private-blog-date">{formatDate(blog.createdAt)}</div>
                    <h2 className="private-blog-title">{blog.title}</h2>
                    <p className="private-blog-excerpt">
                      {blog.content.length > 200 
                        ? blog.content.substring(0, 200) + "..." 
                        : blog.content}
                    </p>
                    {(blog.audio || blog.video) && (
                      <div className="private-blog-media-indicators">
                        {blog.audio && <span className="media-badge">🎵 Audio</span>}
                        {blog.video && <span className="media-badge">🎥 Video</span>}
                      </div>
                    )}
                    <div className="private-blog-footer">
                      <span className="private-blog-author">By {blog.author || "You"}</span>
                      <button
                        onClick={() => navigate(`/blog/${blog._id}`)}
                        className="btn-private-view"
                      >
                        View → linked to public blog page
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PrivateDashboard;

