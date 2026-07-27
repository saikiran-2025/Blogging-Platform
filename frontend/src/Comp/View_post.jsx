// src/Comp/SinglePost.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Ct from "./Ct";

const ViewPost = () => {
  const { id } = useParams();
  const { token } = useContext(Ct);
  const [postData, setPostData] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const API_BASE = "https://blogging-platform-backend-4hwu.onrender.com";

  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setMsg("");
        setLoading(true);

        const res = await axios.get(
          `https://blogging-platform-backend-4hwu.onrender.com/viewpost/${id}`
        );
        const p = res.data.post;

        setPostData(p);
        setLikeCount(p.likeCount ?? 0);
        setComments(p.comments || []);
      } catch (error) {
        const errMsg =
          error.response?.data?.err || "Error loading post.";
        setMsg(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!token) {
      setMsg("You must be logged in to like this post.");
      return;
    }

    try {
      setMsg("");
      const res = await axios.post(
        `https://blogging-platform-backend-4hwu.onrender.com/viewpost/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setLikeCount(res.data.likeCount);
    } catch (error) {
      const errMsg =
        error.response?.data?.err || "Error updating like.";
      setMsg(errMsg);
    }
  };

  const handleAddComment = async () => {
    if (!token) {
      setMsg("You must be logged in to comment.");
      return;
    }
    if (!commentText.trim()) {
      setMsg("Comment text is required.");
      return;
    }

    try {
      setMsg("");
      const res = await axios.post(
        `https://blogging-platform-backend-4hwu.onrender.com/viewpost/${id}/comment`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setComments(res.data.comments || []);
      setCommentText("");
    } catch (error) {
      const errMsg =
        error.response?.data?.err || "Error adding comment.";
      setMsg(errMsg);
    }
  };

  if (loading) {
    return <p className="single-post-msg">Loading post...</p>;
  }

  if (!postData) {
    return <p className="single-post-msg">{msg || "Post not found."}</p>;
  }

  const {
    category,
    title,
    author,
    createdAt,
    readingTime,
    featuredImage,
    content,
    tags
  } = postData;

  const dateString = new Date(createdAt).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).replace(/ /g, "-");

  return (
    <div className="single-post-page">
      {msg && <p className="single-post-msg">{msg}</p>}

      {/* ------------------ Header section ------------------ */}
      <section className="single-post-header">
        <p className="single-post-category">Category : {category}</p>

        <h1 className="single-post-title">{title}</h1>

        {/* Author line */}
        <div className="single-post-author-line">
          <div className="single-post-author-info">
            {author.profileImage ? (
              <img
                src={author.profileImage}
                alt={author.name}
                className="single-post-author-img"
              />
            ) : (
              <div className="single-post-author-img placeholder">
                A
              </div>
            )}

            <div>
              <p className="single-post-author-name">{author.name}</p>
              <p className="single-post-author-meta">
                Date : {dateString} &nbsp; | &nbsp;
                Reading Time : {readingTime} min
              </p>
            </div>
          </div>

          {/* Actions: like, comments, share */}
          <div className="single-post-actions">
            <button
              className="like-btn"
              onClick={handleLike}
            >
              ❤️ Like ({likeCount})
            </button>

            <span className="comment-count">
              💬 Comments ({comments.length})
            </span>

            <button
              className="share-btn"
              onClick={() => {
                navigator.clipboard
                  ?.writeText(window.location.href)
                  .then(() => setMsg("Post URL copied to clipboard."));
              }}
            >
              🔗 Share
            </button>
          </div>
        </div>
      </section>

      {/* ------------------ Large banner image ------------------ */}
      <section className="single-post-banner">
        {featuredImage ? (
          <img
            src={`${API_BASE}${featuredImage}`}
            alt={title}
            className="single-post-banner-img"
          />
        ) : (
          <div className="single-post-banner-placeholder">
            Large Banner Image
          </div>
        )}
      </section>

      {/* ------------------ Full blog content ------------------ */}
      <section className="single-post-content">
        {/* Assuming content is plain text or HTML; for HTML you might use dangerouslySetInnerHTML */}
        <div className="single-post-content-body">
          {content.split("\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>
      </section>

      {/* ------------------ Tags ------------------ */}
      <section className="single-post-tags">
        <h3>Tags</h3>
        <div className="tags-list">
          {(tags || []).map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ------------------ Author Card ------------------ */}
      <section className="single-post-author-card">
        <h3>About the Author</h3>
        <div className="author-card">
          {author.profileImage ? (
            <img
              src={`${API_BASE}${author.profileImage}`}
              alt={author.name}
              className="author-card-img"
            />
          ) : (
            <div className="author-card-img placeholder">
              A
            </div>
          )}

          <div className="author-card-info">
            <h4>{author.name}</h4>
            <p>{author.bio || "Author bio coming soon."}</p>

            <div className="author-socials">
              {/* Replace # with real links when you have them */}
              <a href="#" className="social-link">
                Twitter
              </a>
              <a href="#" className="social-link">
                LinkedIn
              </a>
              <a href="#" className="social-link">
                Website
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------ Comments ------------------ */}
      <section className="single-post-comments">
        <h3>Comments</h3>

        {/* Comment box */}
        <div className="comment-box">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
          />
          <button
            className="comment-submit-btn"
            onClick={handleAddComment}
          >
            Post Comment
          </button>
        </div>

        {/* Existing comments */}
        <div className="comments-list">
          {comments.map((c) => {
            const cDate = new Date(c.createdAt).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric"
              }
            ).replace(/ /g, "-");

            return (
              <div key={c.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-name">
                    {c.author?.name || "Anonymous"}
                  </span>
                  <span className="comment-date">{cDate}</span>
                </div>
                <p className="comment-text">{c.text}</p>
                <button className="comment-reply-btn">
                  Reply
                </button>
              </div>
            );
          })}

          {comments.length === 0 && (
            <p className="no-comments">No comments yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewPost;
