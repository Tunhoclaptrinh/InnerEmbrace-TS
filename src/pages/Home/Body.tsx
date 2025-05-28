import React from "react";
import "../../assets/css/Home.css";
import logoStoryImage from "../../assets/img/logo-story.png";
import ctaLeafImage from "../../assets/img/cta-leaf.png";
import pointerIcon from "../../assets/icon/pointer.png";
import pod1Image from "../../assets/img/pod1.png";
import pod2Image from "../../assets/img/pod2.png";
import pod3Image from "../../assets/img/pod3.png";
import pod4Image from "../../assets/img/pod4.png";
import blog1Image from "../../assets/img/blog1.png";
import blog2Image from "../../assets/img/blog2.png";
import blog3Image from "../../assets/img/blog3.png";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const BodyHomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAICoachingClick = () => {
    if (isAuthenticated) {
      navigate("/chat/map");
    } else {
      navigate("/login");
    }
  };

  const handleExploreClick = () => {
    if (isAuthenticated) {
      navigate("/about");
    } else {
      navigate("/login");
    }
  };

  const handlePlayPodcast = (e: React.MouseEvent, podcastId: number) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate(`/podcast/detail/${podcastId}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content-container">
          <div className="hero-content">
            <h1 className="hero-content__heading">
              We don't just connect devices — we connect lives.
            </h1>
            <p>Ready? Get in touch with your inner world now...</p>
          </div>
        </div>
        <div className="hero-gradient-overlay"></div>
        <div className="hero-image"></div>
      </section>

      <section className="connection-and-story">
        <div className="connection-and-story-container">
          {/* AI Connection Section */}
          <div className="ai-connection">
            <div className="ai-connection-content">
              <h2>
                <div className="ai-connection-content__titile">
                  <span className="ai-connection-content__titile-content homepage-section-heading">
                    Explore Human
                  </span>
                  <span className="highlight-blue"></span>
                  <span className="highlight-blue-icon"></span>
                </div>
              </h2>
              <h2>
                <div className="ai-connection-content__sub-titile homepage-section-heading">
                  <div>Connection through</div>
                  <div className="ai-connection-content__tag highlight">
                    AI.
                  </div>
                </div>
              </h2>
              <p className="ai-connection-content__text">
                Your Journey to Tomorrow Begins Here
              </p>
              <button
                className="ai-connection-btn homepage-btn homepage-btn-primary"
                onClick={handleAICoachingClick}
              >
                <div
                  className="pointer-icon"
                  style={{ backgroundImage: `url(${pointerIcon})` }}
                ></div>
                <div>Try AI Coaching for Free</div>
              </button>
            </div>
          </div>

          {/* Story Section */}
          <div className="story">
            <h2>
              <img
                className="logo-story"
                src={logoStoryImage}
                alt="Logo Icon"
              />
              <span className="logo-story-text homepage-section-heading">
                Story
              </span>
            </h2>
            <div className="story__paragraph">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                egestas arcu ultricies, pulvinar lacus at, ullamcorper dolor.
                Nullam efficitur imperdiet velit. Etiam id pellentesque lorem.
                Aliquam erat volutpat. Etiam tellus felis, facilisis maximus
                dapibus ligula imperdiet malesuada feugiat. Nullp egesta ea
                tellus sed posuere. Morbi metus magna, maximus vitae congue a,
                viverra sit amet nulla. Curabitur arcu massa, finibus in metus.
              </p>
              <p>
                Duis at magna sit amet turpis luctus bibendum. Sed non nibh
                venenatis tellus lacinia ultrices et at nisl. Quisque malesuada,
                dolor et hendrerit luctus, elit sem convallis dolor, a
                condimentum ante ante a lacus. In vitae facilisis felis. Fusce
                elementum dui cursus gravida feugiat. Donec porttitor luctus
                metus et sagittis. Fusce volutpat vitae dolor sit amet varius.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2 className="homepage-section-heading">
          <img
            src={ctaLeafImage}
            alt="Logo Icon"
            style={{
              display: "block",
              width: "30px",
              height: "fit-content",
              marginRight: "10px",
            }}
          />
          Ready to Explore Your Path?
        </h2>
        <p>Ready? Get in touch with your inner world now...</p>
        <button
          className="cta-btn homepage-btn homepage-btn-primary"
          onClick={handleExploreClick}
        >
          I'm Ready To Explore
        </button>
        <span className="cta-bg"></span>
      </section>

      {/* Podcasts Section */}
      <section className="podcasts">
        <div className="podcasts-intro-cotainer">
          <h2 className="homepage-section-heading">
            <img
              src={ctaLeafImage}
              alt="Logo Icon"
              style={{
                display: "block",
                width: "30px",
                height: "fit-content",
                marginRight: "10px",
              }}
            />
            Podcasts
          </h2>
          <p className="podcasts-intro">
            Whether you're looking for 1-on-1 support, a reflective AI space, or
            clear guidance on a challenge – Inner Embrace offers a path that
            meets you where you are.
          </p>
        </div>

        <div className="podcast-cards">
          {[pod1Image, pod2Image, pod3Image, pod4Image].map((image, index) => (
            <Link
              to={`/podcast/detail/${index + 1}`}
              key={index}
              className="podcast-card"
            >
              <div
                className="podcast-image"
                style={{ backgroundImage: `url(${image})` }}
              >
                <div
                  className="play-button"
                  onClick={(e) => handlePlayPodcast(e, index + 1)}
                >
                  ▶
                </div>
              </div>
              <div className="podcast-content">
                <span>
                  Whether you're looking for 1-on-1 support, a reflective AI
                  space, or
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Blogs Section */}
      <section className="blogs">
        <div className="blogs-intro-container">
          <h2 className="homepage-section-heading">
            <img src={ctaLeafImage} alt="Logo Icon" /> Latest on Our Blogs
          </h2>
          <p className="blogs-intro">
            Whether you're looking for 1-on-1 support, a reflective AI space, or
            clear guidance on a challenge – Inner Embrace offers a path that
            meets you where you are.
          </p>
        </div>

        <div className="blog-cards">
          {[
            { image: blog1Image, id: 1 },
            { image: blog2Image, id: 2 },
            { image: blog3Image, id: 3 },
          ].map(({ image, id }) => (
            <Link to={`/blog/detail/${id}`} key={id} className="blog-card">
              <div
                className="blog-image"
                style={{ backgroundImage: `url(${image})` }}
              ></div>
              <div className="blog-content">
                <div className="blog-date">March 21, 2025</div>
                <span>
                  Whether you're looking for 1-on-1 support, a reflective AI
                  space, or
                </span>
                <p>
                  Whether you're looking for 1-on-1 support, a reflective AI
                  space, or clear guidance on a challenge...
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-container">
        <div className="newsletter">
          <h2 className="homepage-section-heading">
            <img src={ctaLeafImage} alt="Logo Icon" /> Slogan Inner Embrace
          </h2>
          <p>
            Whether you're looking for 1-on-1 support, a reflective AI space, or
            clear guidance on a challenge – Inner Embrace offers a path that
            meets you where you are.
          </p>
          <button className="newsletter-btn homepage-btn homepage-btn-primary">
            Subscribe with Email
          </button>
        </div>
      </section>
    </div>
  );
};

export default BodyHomePage;
