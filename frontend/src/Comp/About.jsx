// src/Comp/About.jsx
import React from "react";
import aboutImg from "../assets/about.jpeg"; // replace with your actual image file

const About = () => {
  return (
    <div className="about-page">
      {/* Main content row: text + image */}
      <div className="about-content">
        {/* Left side: text */}
        <div className="about-text">
          <h1>About MyBlog</h1>

          <p>
            MyBlog is a simple blogging platform where anyone can share
            their thoughts, experiences, and knowledge in a clean and
            friendly environment.
          </p>

          <p>
            Our mission is to provide a place where writers can share ideas
            and readers can explore knowledge across topics like travel,
            lifestyle, productivity, technology, and more.
          </p>

          <p>
            Thank you for being a part of our journey ❤️
          </p>
        </div>

        {/* Right side: image */}
        <div className="about-image">
          <img
            src={aboutImg}
            alt="Laptop blogging illustration"
            className="about-img"
          />
        </div>
      </div>
    </div>
  );
};

export default About;