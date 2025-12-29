import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required!");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      formData.append("author", author.trim() || "Admin");
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (audioFile) {
        formData.append("audio", audioFile);
      }
      if (videoFile) {
        formData.append("video", videoFile);
      }

      await axios.post("/api/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Redirect to home page after successful creation
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Create New Blog</h1>
      
      <div className="form-container">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              className="form-textarea"
              rows="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name (optional)"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="form-file-input"
            />
            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="btn-remove-image"
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="audio">Audio (MP3)</label>
            <input
              type="file"
              id="audio"
              accept="audio/*"
              onChange={handleAudioChange}
              className="form-file-input"
            />
            {audioFile && (
              <div className="file-info">
                <span>📻 {audioFile.name}</span>
                <button
                  type="button"
                  onClick={() => setAudioFile(null)}
                  className="btn-remove-file"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="video">Video</label>
            <input
              type="file"
              id="video"
              accept="video/*"
              onChange={handleVideoChange}
              className="form-file-input"
            />
            {videoPreview && (
              <div className="video-preview-container">
                <video src={videoPreview} controls className="video-preview" />
                <button
                  type="button"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview("");
                  }}
                  className="btn-remove-image"
                >
                  ✕ Remove
                </button>
              </div>
            )}
            {videoFile && !videoPreview && (
              <div className="file-info">
                <span>🎥 {videoFile.name}</span>
                <button
                  type="button"
                  onClick={() => setVideoFile(null)}
                  className="btn-remove-file"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-submit"
            >
              {loading ? "Publishing..." : "Publish Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;

