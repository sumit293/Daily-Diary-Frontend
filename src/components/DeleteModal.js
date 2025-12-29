import { useState } from "react";
import "../index.css";

function DeleteModal({ isOpen, onClose, onConfirm, blogTitle }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password !== "1947") {
      setError("Incorrect code. Access denied.");
      return;
    }

    // Pass the password to onConfirm
    onConfirm(password);
    setPassword("");
    setError("");
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Delete Blog</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p className="delete-warning">
            Are you sure you want to delete <strong>"{blogTitle}"</strong>?
          </p>
          <p className="delete-subtitle">
            This action cannot be undone. Enter the secret code to confirm deletion.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="delete-password">Secret Code *</label>
              <input
                type="password"
                id="delete-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secret code"
                className="form-input"
                required
                autoFocus
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-delete"
              >
                Delete Blog
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;

