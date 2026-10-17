import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchArticle, articleImage } from "../lib/articles";
import { apiFetch } from "../config/api";
import "./AddArticle.css";

const EMPTY_FORM = {
  title: "",
  summary: "",
  body: "",
  category: "",
  image: null,
  status: "draft",
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const VALID_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const AddArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // present when editing
  const editing = Boolean(id);
  const [loadingArticle, setLoadingArticle] = useState(editing);
  const fileInputRef = useRef(null);
  const redirectTimer = useRef(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  // Editing: load the article (admins can load drafts too)
  useEffect(() => {
    if (!editing) return;
    fetchArticle(id)
      .then((res) => {
        if (!res.success || !res.data) throw new Error(res.message || "Article not found.");
        const a = res.data;
        setFormData({ title: a.title, summary: a.summary, body: a.body || "", category: a.category, image: null, status: a.status || "published" });
        setImagePreview(articleImage(a, 800));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingArticle(false));
  }, [editing, id]);

  const categories = [
    "Budgeting",
    "Savings",
    "Investing",
    "Debt Management",
    "Financial Planning",
    "Retirement",
    "Tax Planning",
    "Insurance",
    "Credit Cards",
    "Real Estate",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Reset the input on a bad file so picking the same file again re-triggers onChange
      if (file.size > MAX_IMAGE_BYTES) {
        setError("Image size should be less than 5MB");
        e.target.value = "";
        return;
      }

      if (!VALID_TYPES.includes(file.type)) {
        setError("Please upload a valid image (JPEG, PNG, or WebP)");
        e.target.value = "";
        return;
      }

      setError("");

      setFormData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Article title is required");
      return false;
    }
    if (!formData.summary.trim()) {
      setError("Article summary is required");
      return false;
    }
    if (!formData.body.trim()) {
      setError("Article body is required");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category");
      return false;
    }
    if (!formData.image && !editing) {
      setError("Please upload an article image");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("summary", formData.summary);
      submitData.append("body", formData.body);
      submitData.append("category", formData.category);
      submitData.append("status", formData.status);
      if (formData.image) submitData.append("image", formData.image);
      if (editing) submitData.append("id", id);

      const data = await apiFetch(editing ? "api/update_article.php" : "api/add_article.php", {
        method: "POST",
        body: submitData,
      });

      if (data.success) {
        setSuccess(editing ? "Changes saved." : data.message || "Article created.");
        setFormData(EMPTY_FORM);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        redirectTimer.current = setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setError(data.message || "Failed to create article. Please try again.");
      }
    } catch (err) {
      setError(err.message);
      console.error("Add article error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-article-page">
      <div className="add-article-container">
        <div className="add-article-header">
          <h1>{editing ? "Edit article" : "Create new article"}</h1>
          <button type="button" className="btn-back" onClick={() => navigate("/dashboard")}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="success-message" role="status">
            {success}
          </div>
        )}

        <form className="add-article-form" onSubmit={handleSubmit} noValidate>
          <div className="form-section">
            <h2>Article Details</h2>

            <div className="form-group">
              <label htmlFor="title">Article Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter article title"
                value={formData.title}
                onChange={handleChange}
                maxLength="200"
              />
              <span className="char-count">{formData.title.length}/200</span>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}>
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="summary">Article Summary *</label>
              <textarea
                id="summary"
                name="summary"
                placeholder="Write a brief summary (shown on hover)"
                value={formData.summary}
                onChange={handleChange}
                rows="3"
                maxLength="300"></textarea>
              <span className="char-count">{formData.summary.length}/300</span>
            </div>

            <div className="form-group">
              <label htmlFor="body">Article Body *</label>
              <textarea
                id="body"
                name="body"
                placeholder="Write the full article content here..."
                value={formData.body}
                onChange={handleChange}
                rows="12"></textarea>
            </div>
          </div>

          <div className="form-section">
            <h2>Article Image</h2>

            <div className="form-group">
              <label htmlFor="image">{editing ? "Image (choose a file to replace it)" : "Upload Image *"}</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="file-input"
                />
                <label htmlFor="image" className="file-label">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="image-preview"
                    />
                  ) : (
                    <div className="upload-placeholder">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2">
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <p>Click to upload image</p>
                      <span>JPEG, PNG or WebP (Max 5MB)</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/dashboard")}
              disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || loadingArticle || !!success}>
              {loading ? "Saving..." : editing ? "Save changes" : "Create article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddArticle;
