// src/Comp/All_posts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const All_posts = () => {
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE = "https://blogging-platform-backend-4hwu.onrender.com";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setMsg("");
        const res = await axios.get("https://blogging-platform-backend-4hwu.onrender.com/allposts");
        setPosts(res.data.posts || []);
      } catch (error) {
        const errMsg =
          error.response?.data?.err || "Error fetching posts.";
        setMsg(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const goToPost = (id) => {
    navigate(`/viewpost/${id}`);
  };

  return (
    <div className="all-posts-page">
      {/* Page title */}
      <h1 className="all-posts-title">All Posts</h1>

      {/* Status / error */}
      {msg && <p className="all-posts-msg">{msg}</p>}
      {loading && <p className="all-posts-msg">Loading posts...</p>}

      {/* Cards list */}
      <div className="all-posts-list">
        {posts.map((post) => {
          const dateString = new Date(post.date).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }
          ).replace(/ /g, "-");

          return (
            <div key={post.id} className="all-post-card">
              {/* Image */}
              <div className="all-post-image">
                {post.featuredImage ? (
                  <img
                    src={`${API_BASE}${post.featuredImage}`}
                    alt={post.title}
                    className="all-post-img"
                  />
                ) : (
                  <div className="all-post-img-placeholder">
                    Image
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="all-post-content">
                <h2 className="all-post-card-title">{post.title}</h2>
                <p className="all-post-card-description">{post.description}</p>
                <p className="all-post-card-meta">
                  <span>{post.authorName}</span>
                  <span> • </span>
                  <span>{dateString}</span>
                </p>
              </div>

              {/* Read More Button */}
              <div className="all-post-card-actions">
                <button
                  className="read-more-btn"
                  onClick={() => goToPost(post.id)}
                >
                  Read More
                </button>
              </div>
            </div>
          );
        })}

        {!loading && posts.length === 0 && !msg && (
          <p className="all-posts-msg">
            No published posts yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default All_posts;
