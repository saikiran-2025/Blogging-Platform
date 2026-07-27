import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import resetImg from "../assets/reset.jpeg"

const Reset_pwd = () => {
  const [data, setData] = useState({
    email: "",
    new_pwd: "",
    confirm_pwd: ""
  });
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/reset", data);

      // Backend returns { success: true, message: "Password reset successfully." }
      setMsg(res.data.message || "Password reset successfully.");
      setSuccess(res.data.success);

      // Optionally redirect back to login after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        "Password reset failed. Please check your details.";
      setMsg(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">

  <div className="auth-card">

    {/* Left Side Image */}

    <div
      className="login-left"
      style={{ backgroundImage: `url(${resetImg})` }}
    >
      
    </div>

    {/* Right Side */}

    <div className="login-right">

      {msg && (
        <h3 className={`msg ${success ? "msg-success" : "msg-error"}`}>
          {msg}
        </h3>
      )}

      <h2>Reset Password</h2>

      <form onSubmit={handleReset}>

        <div className="input-group">
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Enter your registered E-mail"
          />
          <i className="fa-solid fa-envelope"></i>
        </div>

        <div className="input-group">
          <input
            type="password"
            name="new_pwd"
            value={data.new_pwd}
            onChange={handleChange}
            placeholder="New Password"
          />
          <i className="fa-solid fa-lock"></i>
        </div>

        <div className="input-group">
          <input
            type="password"
            name="confirm_pwd"
            value={data.confirm_pwd}
            onChange={handleChange}
            placeholder="Confirm Password"
          />
          <i className="fa-solid fa-lock"></i>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </form>

      <div className="reglink">
        Back to
        <Link to="/"> Login</Link>
      </div>

    </div>

  </div>

</div>

  );
};

export default Reset_pwd;