import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Ct from "./Ct";
import loginImg from "../assets/login.jpeg"

const Login = () => {
  const [data, setData] = useState({ email: "", pwd: "" });
  const [msg, setMsg] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const obj = useContext(Ct);
  const navigate = useNavigate();

  const fun = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const login = async () => {
    try {
      setMsg(""); // clear old message
      const res = await axios.post("https://blogging-platform-backend-4hwu.onrender.com/login", data);

      if (res.data.token) {
        // Save token and user info in context
        obj.setToken(res.data.token);
        obj.setUser({
          email: res.data.email,
          _id: res.data._id
        });

        // Navigate to home page
        navigate("/home");
      } else {
        setMsg("Login failed. No token received.");
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.err ||
        error.response?.data?.msg ||
        "Login failed. Please check your credentials.";
      setMsg(errMsg);
    }
  };

  return (
    <div className="auth-wrapper">
    <div className="auth-card">

      {/* Left Side Image */}
      <div
        className="login-left"
        style={{ backgroundImage: `url(${loginImg})` }}
      >
      </div>

      {/* Right Side Form */}
      <div className="login-right">

        {msg && <h3 className="msg">{msg}</h3>}

        <h2>Login</h2>

        <div className="input-group">
          <input
            name="email"
            value={data.email}
            onChange={fun}
            placeholder="Enter E-mail"
          />
          <i className="fa-solid fa-envelope"></i>
        </div>

        <div className="input-group">
          <input
            type={showPwd ? "text" : "password"}
            name="pwd"
            value={data.pwd}
            onChange={fun}
            placeholder="Enter Password"
          />
          <i
            className="fa-solid fa-eye"
            onMouseDown={() => setShowPwd(true)}
            onMouseUp={() => setShowPwd(false)}
            onMouseLeave={() => setShowPwd(false)}
          ></i>
        </div>

        <div className="forgot-link">
          <Link to="/resetpwd">Forgot Password?</Link>
        </div>

        <button onClick={login}>Login</button>

        <div className="reglink">
          Don't have an account?
          <Link to="/register"> Sign Up</Link>
        </div>

      </div>

    </div>
  </div>

  );
};

export default Login;
