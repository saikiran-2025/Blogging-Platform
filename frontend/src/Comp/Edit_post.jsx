// Comp/Edit_post.jsx

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Ct from "./Ct";

const Edit_post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(Ct);
  const API_BASE = "https://blogging-platform-backend-4hwu.onrender.com";

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `https://blogging-platform-backend-4hwu.onrender.com/dashboard/post/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const post = res.data.post;

        setTitle(post.title || "");
        setCategory(post.category || "");
        setContent(post.content || "");
        setTags((post.tags || []).join(", "));
        setStatus(post.status || "draft");
        setCurrentImage(post.featuredImage || "");
      } catch (error) {
        setMsg(error.response?.data?.err || "Error loading post.");
      } finally {
        setLoading(false);
      }
    };

    if (!token) {
      navigate("/");
      return;
    }

    if (id) {
      fetchPost();
    }
  }, [id, token, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file || null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("category", category);
      formData.append("content", content);
      formData.append("tags", tags);
      formData.append("status", status);

      if (newImage) {
        formData.append("featuredImage", newImage);
      }

      await axios.put(
        `https://blogging-platform-backend-4hwu.onrender.com/dashboard/post/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/myposts");
    } catch (error) {
      setMsg(error.response?.data?.err || "Error updating post.");
    }
  };

  if (loading) {
    return (
      <div className="loading-box">
        <h2>Edit Post</h2>
        <p>Loading post...</p>
      </div>
    );
  }

  return (
    <div className="edit-post">

      {/* Heading */}

      <header>
        <h1>Edit Post</h1>
        <p>Update your article and featured image.</p>
      </header>

      {/* Error Message */}

      {msg && <div className="msg">{msg}</div>}

      <form onSubmit={handleUpdate} encType="multipart/form-data">

        {/* Title */}

        <div>
          <label>Title</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category */}

        <div>
          <label>Category</label>

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Content */}

        <div>
          <label>Content</label>

          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        {/* Tags */}

        <div>
          <label>Tags (comma separated)</label>

          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Status */}

        <div>
          <label>Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Current Image */}

        {currentImage && (
          <div>
            <label>Current Featured Image</label>

            <div className="current-image">
              <img
                src={`${API_BASE}${currentImage}`}
                alt="Current Featured"
              />
            </div>
          </div>
        )}

        {/* Upload Image */}

        <div>
          <label>Upload New Featured Image (Optional)</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Buttons */}

        <div className="form-buttons">

          <button
            type="submit"
            className="save-btn"
          >
            Save Changes
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/myposts")}
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
};

export default Edit_post;
