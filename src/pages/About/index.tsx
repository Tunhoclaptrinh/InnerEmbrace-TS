import React from "react";
import "../../assets/css/About.css";
import heroImage from "../../assets/img/image2.jpg";
import logoStory from "../../assets/img/logo-story.png";
import ctaLeaf from "../../assets/img/cta-leaf.png";
import cauchuyen from "../../assets/img/cauchuyen.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AboutPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAICoachingClick = () => {
    if (isAuthenticated) {
      navigate("/chat/map");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="about-page">
      {/* Story Section */}
      <section className="about-connection-and-story">
        <div className="about-connection-and-story-container">
          <div className="about-story">
            <h2 className="about-story-heading">
              <span className="about-logo-story-text">Câu chuyện của '</span>
              <img
                className="about-logo-story"
                src={logoStory}
                alt="Logo Icon"
              />
            </h2>
            <div className="story__paragraph p-content">
              <p>
                Inner Embrace sinh ra cho những người không còn muốn sống theo
                lộ trình có sẵn. Họ không cần ai chỉ đường. <br /> Họ chỉ đang
                chờ một không gian đủ yên để có thể lắng nghe sự sống động trong
                chính con người mình — và rồi hành động từ đó. <br /> Chúng mình
                không dạy bạn thế nào là sống là chính mình. Chúng mình ở đây để
                giữ cho bạn một khoảng trống — nơi cái đẹp độc bản trong bạn có
                thể bung nở tự nhiên.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          width: "100%",
          zIndex: 3,
          height: "100%",
          display: "flex",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      >
        <img
          style={{
            width: "100%",
            zIndex: 3,
            height: "100%",
            display: "flex",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
          src={cauchuyen}
          alt=""
        />
      </section>

      {/* Newsletter/CTA Section */}
      <section className="about-newsletter-container">
        <div className="about-newsletter">
          <h2 className="section-heading">
            <img src={ctaLeaf} alt="Logo Icon" className="about-cta-leaf" />
            Subscribe With Email
          </h2>
          <p className="about-newsletter-text">
            Subscribe Inner Embrace — nhận những thông báo mới nhất
          </p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Nhập Email Liên Hệ"
              required
              className="about-newsletter-btn about-btn "
            />
            <button
              type="submit"
              className="newsletter-btn about-newsletter-btn about-btn about-btn-primary"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
