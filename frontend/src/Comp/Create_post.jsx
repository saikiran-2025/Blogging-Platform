// src/Comp/Create_post.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import Ct from "./Ct";

const Create_post = () => {
  const { token, user } = useContext(Ct);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState(""); // comma-separated string
  const [imageFile, setImageFile] = useState(null);
  const API_BASE = "https://blogging-platform-backend-4hwu.onrender.com";

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // For preview date + reading time
  const todayString = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).replace(/ /g, "-");

  const estimatedReadingTime = content
    ? Math.ceil(content.trim().split(/\s+/).length / 200)
    : 1;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file || null);
  };

  const handlePublish = async () => {
    if (!token) {
      setMsg("You must be logged in to publish a post.");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("content", content);
      formData.append("tags", tags); // backend will split string into array
      formData.append("status", "published");

      if (imageFile) {
        // field name must match upload.single("image")
        formData.append("image", imageFile);
      }

      const res = await axios.post(
        "https://blogging-platform-backend-4hwu.onrender.com/createpost",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setMsg(res.data.msg || "Post published successfully.");
      // Optionally, clear form after publish
      setTitle("");
      setCategory("");
      setContent("");
      setTags("");
      setImageFile(null);
    } catch (error) {
      const errMsg =
        error.response?.data?.err ||
        "Error creating post. Please check your fields.";
      setMsg(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // You can add modal logic later; for now we just ensure preview section updates from state.
    setMsg("Preview updated.");
  };

  return (
    <div className="create-post-page">
      {/* Global message */}
      {msg && <p className="create-post-msg">{msg}</p>}

      {/* ---------------------- Page header ---------------------- */}
      <header className="create-post-header">
        <h1>CREATE NEW POST</h1>
        <p>Share your ideas with the world</p>
      </header>

      {/* ---------------------- Layout: left form / right preview ---------------------- */}
      <div className="create-post-layout">
        {/* LEFT SIDE (Form) */}
        <section className="create-post-form">
          {/* Title */}
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Featured Image */}
          <div className="form-group">
            <label>Featured Image</label>
            <input type="file" accept=".jpg,.jpeg" onChange={handleImageChange} />
            <small>Only JPG images are allowed.</small>
          </div>

          {/* Category */}
          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Travel">Travel</option>
              <option value="Nature">Nature</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Technology">Technology</option>
              <option value="Productivity">Productivity</option>
              <option value="Uncategorized">Uncategorized</option>
            </select>
          </div>

          {/* Content */}
          <div className="form-group">
            <label>Content</label>

            {/* Fake toolbar (no functionality yet) */}
            <div className="toolbar">
              <button type="button">B</button>
              <button type="button">I</button>
              <button type="button">U</button>
              <button type="button">Link</button>
              <button type="button">Image</button>
            </div>

            <textarea
              rows={8}
              placeholder="Write your content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="form-group">
            <label>Tags</label>
            <input
              type="text"
              placeholder="Travel, Nature, MERN..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <small>Separate tags with commas.</small>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-preview"
              onClick={handlePreview}
            >
              Preview
            </button>

            <button
              type="button"
              className="btn-publish"
              onClick={handlePublish}
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </section>

        {/* RIGHT SIDE (Preview) */}
        <section className="create-post-preview">
          <h2>Preview</h2>

          {/* Featured Image */}
          <div className="preview-image">
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="preview-img"
              />
            ) : (
              <div className="preview-img-placeholder">
                Featured Image
              </div>
            )}
          </div>

          {/* Category */}
          <p className="preview-category">
            {category ? `Category : ${category}` : "Category : —"}
          </p>

          {/* Post Title + Meta */}
          <h3 className="preview-title">
            {title || "Post Title"}
          </h3>

          <p className="preview-meta">
            Author : {user?.email || "You"} <br />
            Date : {todayString} <br />
            Reading Time : {estimatedReadingTime} min
          </p>

          {/* Content preview */}
          <div className="preview-content">
            <p>
              {content
                ? content.length > 200
                  ? content.substring(0, 197) + "..."
                  : content
                : "Post Description / Content Preview"}
            </p>
          </div>

          {/* Tags preview */}
          <div className="preview-tags">
            <h4>Tags</h4>
            <div className="tags-list">
              {tags
                ? tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t.length > 0)
                    .map((t) => (
                      <span key={t} className="tag-pill">
                        {t}
                      </span>
                    ))
                : (
                  <>
                    <span className="tag-pill">Travel</span>
                    <span className="tag-pill">Nature</span>
                    <span className="tag-pill">Technology</span>
                  </>
                )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Create_post;
