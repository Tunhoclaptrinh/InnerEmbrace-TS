import React from "react";
import "./assets/css/Footer.css";
import footerLogo from "./assets/img/footer-logo.png";
import facebookIcon from "./assets/icon/bxl_facebook.png";
import tiktokIcon from "./assets/icon/bxl_tiktok.png";
import youtubeIcon from "./assets/icon/ant-design_youtube-outlined.png";

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-left">
          <img src={footerLogo} alt="Inner Embrace Logo" />
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        <div className="footer-right">
          <div className="footer-right-text">
            <div className="footer-item">
              <h3>Programs</h3>
            </div>
            <div className="footer-item">
              <h3>Podcasts</h3>
            </div>
            <div className="footer-item">
              <h3>Blogs</h3>
            </div>
            <div className="footer-item">
              <h3>Contact</h3>
            </div>
          </div>
          <div className="footer-right-social">
            <div className="footer-item">
              <div
                className="footer-item-social-icon"
                style={{ backgroundImage: `url(${facebookIcon})` }}
              ></div>
            </div>
            <div className="footer-item">
              <div
                className="footer-item-social-icon"
                style={{ backgroundImage: `url(${tiktokIcon})` }}
              ></div>
            </div>
            <div className="footer-item">
              <div
                className="footer-item-social-icon"
                style={{ backgroundImage: `url(${youtubeIcon})` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; Copyright 2025 Inner Embrace, All rights reserved * Inner
          Embrace giữ bản quyền nội dung trên website này
        </p>
      </div>
    </footer>
  );
};

export default Footer;
