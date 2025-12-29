import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteModal from "./DeleteModal";
import "../index.css";
import api from "../api.js"

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/api/blogs/${id}`)
      .then((res) => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch blog.");
        setLoading(false);
      });
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "No Date";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (password) => {
    setDeleting(true);
    try {
      // Send password as query param for backend verification
      await api.delete(`/api/blogs/${id}?password=${encodeURIComponent(password)}`);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to delete blog.");
      setShowDeleteModal(false);
      setDeleting(false);
    }
  };

  if (loading) return <div className="container"><p className="loading-text">Loading blog...</p></div>;
  if (error) return <div className="container"><p className="error-text">{error}</p></div>;
  if (!blog) return <div className="container"><p className="error-text">Blog not found</p></div>;

  return (
    <div className="container">
      <div className="blog-detail-header-actions">
        <button onClick={() => navigate("/")} className="btn btn-back">
          ← Back to Blogs
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="btn btn-delete-action"
          disabled={deleting}
        >
          🗑️ Delete Blog
        </button>
      </div>
      
      <div className="blog-detail">
        <div className="blog-detail-header">
          <div className="blog-detail-date">{formatDate(blog.createdAt)}</div>
          <div className="blog-detail-author">By {blog.author || "Unknown"}</div>
        </div>
        
        <h1 className="blog-detail-title">{blog.title}</h1>
        
        {blog.image && (
          <div className="blog-detail-image-container">
            <img src={blog.image} alt={blog.title} className="blog-detail-image" />
          </div>
        )}

        {blog.video && (
          <div className="blog-detail-media-container">
            <video controls className="blog-detail-video">
              <source src={blog.video} type="video/mp4" />
              <source src={blog.video} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {blog.audio && (
          <div className="blog-detail-media-container">
            <audio controls className="blog-detail-audio">
              <source src={blog.audio} type="audio/mpeg" />
              <source src={blog.audio} type="audio/mp3" />
              <source src={blog.audio} type="audio/wav" />
              Your browser does not support the audio tag.
            </audio>
          </div>
        )}
        
        <div className="blog-detail-content">
          {blog.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        blogTitle={blog.title}
      />
    </div>
  );
}

export default BlogDetail;


