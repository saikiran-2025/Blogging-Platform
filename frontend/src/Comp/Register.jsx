import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import registerImg from "../assets/signin.jpeg"

const Register = () => {
  const [data, setData] = useState({
    fullname: "",
    email: "",
    pwd: "",
    confirmPwd: ""
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault(); 
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/register", data);

      // Backend returns { msg: "Registration successful", user: { ... } }
      setMsg(res.data.msg || "Registration successful");

      // Optionally wait a moment, then go back to login
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      const errMsg =
        error.response?.data?.err ||
        "Registration failed. Please check your details.";
      setMsg(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
    <div className="auth-card">

      {/* Left Image */}
      <div
        className="register-left"
        style={{ backgroundImage: `url(${registerImg})` }}
      ></div>

      {/* Right Form */}
      <div className="register-right">

        {msg && <h3 className="msg">{msg}</h3>}

        <h2>Sign Up</h2>

        <form onSubmit={handleRegister}>

          <div className="input-group">
            <input
              name="fullname"
              value={data.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            <i className="fa-solid fa-user"></i>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            <i className="fa-solid fa-envelope"></i>
          </div>

          <div className="input-group">
            <input
              type="password"
              name="pwd"
              value={data.pwd}
              onChange={handleChange}
              placeholder="Create password"
            />
            <i className="fa-solid fa-eye"></i>
          </div>

          <div className="input-group">
            <input
              type="password"
              name="confirmPwd"
              value={data.confirmPwd}
              onChange={handleChange}
              placeholder="Confirm password"
            />
            <i className="fa-solid fa-eye"></i>
          </div>

          <button type="submit">
            {loading ? "Registering..." : "Sign Up"}
          </button>

        </form>

        <div className="reglink">
          Already have an account?
          <Link to="/"> Login</Link>
        </div>

      </div>

    </div>
  </div>

  );
};

export default Register;