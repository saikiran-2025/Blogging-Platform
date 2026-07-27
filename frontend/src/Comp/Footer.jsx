import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub
} from "react-icons/fa";

import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About */}
        <div className="footer-section">
          <h2>MyBlog – Blogging Platform</h2>

          <p>
            MyBlog is a simple and friendly blogging platform where writers
            can share stories, tutorials, and personal experiences, and
            readers can explore ideas across travel, lifestyle, technology,
            productivity, and more.
          </p>

          <p>
            Our goal is to make writing and reading enjoyable, with clean
            layouts, easy navigation, and a space for thoughtful discussion.
          </p>
        </div>

        {/* Features */}
        <div className="footer-section">
          <h3>Platform Features</h3>

          <ul>
            <li>Create and publish blog posts</li>
            <li>Like and comment on articles</li>
            <li>View all posts in one place</li>
            <li>Author profiles and tags</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>

          <p>Email : support@myblog.com</p>
          <p>Location : India</p>
          <p>Available : Monday - Saturday</p>
        </div>

        {/* Social */}
        <div className="footer-section">
          <h3>Follow Us</h3>

          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
            <a href="#"><FaGithub /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {year} MyBlog. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;