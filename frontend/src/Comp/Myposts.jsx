// Comp/Myposts.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Ct from "./Ct";

const Myposts = () => {
  const { token, user } = useContext(Ct);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    myPosts: 0,
    comments: 0,
    likes: 0
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setStats(res.data.stats || { myPosts: 0, comments: 0, likes: 0 });
        setRecentPosts(res.data.recentPosts || []);
      } catch (error) {
        setMsg(error.response?.data?.err || "Error loading dashboard.");
      } finally {
        setLoading(false);
      }
    };

    if (!token) {
      navigate("/");
      return;
    }

    fetchDashboard();
  }, [token, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:5000/dashboard/post/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove from UI and update stats
      setRecentPosts((prev) => prev.filter((p) => p._id !== id));
      setStats((prev) => ({
        ...prev,
        myPosts: Math.max(prev.myPosts - 1, 0)
      }));
    } catch (error) {
      setMsg(error.response?.data?.err || "Error deleting post.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/editpost/${id}`);
  };

  const handleView = (id) => {
    navigate(`/viewpost/${id}`);
  };

  if (loading) {
    return (
      <div className="myposts-page" style={{ padding: "20px" }}>
        <h2>My Dashboard</h2>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div
      className="myposts-page"
      style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* Page Heading */}
      <header style={{ marginBottom: "20px" }}>
        <h1 style={{ margin: 0 }}>My Dashboard</h1>
        <p style={{ margin: "5px 0", color: "#555" }}>
          Welcome, {user?.username || "User"}
        </p>
      </header>

      {msg && (
        <div style={{ marginBottom: "10px", color: "red" }}>
          {msg}
        </div>
      )}

      {/* Dashboard Statistics */}
      <section
        className="dashboard-stats"
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap"
        }}
      >
        <div
          className="stat-card"
          style={{
            flex: "1 1 200px",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#f5f5f5",
            textAlign: "center"
          }}
        >
          <h3>Total Posts</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {stats.myPosts}
          </p>
        </div>

        <div
          className="stat-card"
          style={{
            flex: "1 1 200px",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#f5f5f5",
            textAlign: "center"
          }}
        >
          <h3>Total Comments</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {stats.comments}
          </p>
        </div>

        <div
          className="stat-card"
          style={{
            flex: "1 1 200px",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#f5f5f5",
            textAlign: "center"
          }}
        >
          <h3>Total Likes</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>
            {stats.likes}
          </p>
        </div>
      </section>

      {/* My Recent Posts */}
      <section>
        <h2 style={{ marginBottom: "15px" }}>My Recent Posts</h2>

        {recentPosts.length === 0 ? (
          <p>You have not created any posts yet.</p>
        ) : (
          <div
            className="posts-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px"
            }}
          >
            {recentPosts.map((post) => (
              <article
                key={post._id}
                className="post-card"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#fff"
                }}
              >
                {/* Featured Image */}
                {post.featuredImage && (
                  <div
                    style={{
                      width: "100%",
                      height: "180px",
                      overflow: "hidden"
                    }}
                  >
                    <img
                      src={`${API_BASE}${post.featuredImage}`}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                )}

                {/* Card content */}
                <div style={{ padding: "15px", flex: "1" }}>
                  <h3 style={{ margin: "0 0 10px" }}>{post.title}</h3>
                  <p style={{ margin: "0 0 8px", color: "#555" }}>
                    {post.description}
                  </p>
                  <p
                    style={{
                      margin: "0 0 5px",
                      fontSize: "14px",
                      color: "#777"
                    }}
                  >
                    Category:{" "}
                    <strong>{post.category || "General"}</strong>
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#999"
                    }}
                  >
                    {post.date} • {post.time}
                  </p>
                </div>

                {/* Buttons */}
                <div
                  style={{
                    padding: "10px 15px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    borderTop: "1px solid #eee"
                  }}
                >
                  <button
                    onClick={() => handleEdit(post._id)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "4px",
                      border: "none",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "4px",
                      border: "none",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleView(post._id)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "4px",
                      border: "none",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    View Post
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Myposts;