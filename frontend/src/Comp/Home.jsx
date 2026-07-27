import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Carousal from "./Carousal";
import Ct from "./Ct";


const Home = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { token } = useContext(Ct); // if you want to send auth later (currently /allposts is public)
  const API_BASE = "https://blogging-platform-backend-4hwu.onrender.com";

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setMsg("");
        const res = await axios.get("https://blogging-platform-backend-4hwu.onrender.com/allposts");
        // Get top 3 recent posts
        const posts = res.data.posts || [];
        setRecentPosts(posts.slice(0, 3));
      } catch (error) {
        const errMsg =
          error.response?.data?.err || "Error loading recent posts.";
        setMsg(errMsg);
      }
    };

    fetchRecentPosts();
  }, []);

  const goToAllPosts = () => {
    navigate("/allposts");
  };

  return (
    <div className="home-page">
      {/* Optional top message */}
      {msg && <p className="home-msg">{msg}</p>}

      {/* ======================= CAROUSEL (BANNER) ======================= */}
      <section className="home-carousel-section">
        <div className="home-carousel-wrapper">
          <Carousal />
        </div>
      </section>

      {/* ======================= RECENT POSTS ======================= */}
      <section className="home-recent-section">
        <h2 className="section-title">Recent Posts</h2>

        <div className="home-cards-row">
          {recentPosts.map((post) => {
            const dateString = new Date(post.date).toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric"
              }
            ).replace(/ /g, "-");

            return (
              <div key={post.id} className="home-post-card">
                {/* Post Image */}
                <div className="home-post-image">
                  {post.featuredImage ? (
                    <img
                      src={`${API_BASE}${post.featuredImage}`}
                      alt={post.title}
                      className="home-post-img"
                    />
                  ) : (
                    <div className="home-post-img-placeholder">
                      Post Image
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="home-post-title">{post.title}</h3>

                {/* Short description */}
                <p className="home-post-description">{post.description}</p>

                {/* Date + Author */}
                <p className="home-post-meta">
                  Date : {dateString} <br />
                  Author : {post.authorName}
                </p>
              </div>
            );
          })}

          {/* If no posts yet */}
          {recentPosts.length === 0 && !msg && (
            <p className="home-no-posts">
              No published posts yet. Create your first post to see it here.
            </p>
          )}
        </div>

        {/* View All Posts button */}
        <div className="home-view-all-wrapper">
          <button className="home-view-all-btn" onClick={goToAllPosts}>
            View All Posts
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
