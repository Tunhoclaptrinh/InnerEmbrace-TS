import React, { useState } from "react";
import "../../assets/css/PodCasts.css";

import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
// Import images
import ctaLeafIcon from "../../assets/img/cta-leaf.png";
import pod1Image from "../../assets/img/pod1.png";
import pod2Image from "../../assets/img/pod2.png";
import pod3Image from "../../assets/img/pod3.png";
import pod4Image from "../../assets/img/pod4.png";

interface PodcastData {
  id: number;
  title: string;
  host: string;
  image: string;
}

const PodcastsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const podcastCategories = [
    "Trending Podcasts",
    "Relax Podcasts",
    "Education Podcasts",
    "Business & Technology Podcasts",
    "Lifestyle & Health Podcasts",
    "Arts & Entertainment Podcasts",
    "Chill vibes for Friday morning",
  ];

  const podcastData: PodcastData[] = [
    {
      id: 1,
      title: "Whether you're looking for 1-on-1 support",
      host: "Alessandro Conti",
      image: pod1Image,
    },
    {
      id: 2,
      title: "Whether you're looking for 1-on-1 support",
      host: "Alessandro Conti",
      image: pod2Image,
    },
    {
      id: 3,
      title: "Whether you're looking for 1-on-1 support",
      host: "Alessandro Conti",
      image: pod3Image,
    },
    {
      id: 4,
      title: "Whether you're looking for 1-on-1 support",
      host: "Alessandro Conti",
      image: pod4Image,
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAICoachingClick = () => {
    if (isAuthenticated) {
      navigate("/chat/map");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="podcasts-page">
      <main className="podcasts-page__main-content">
        <section className="podcasts-page__section">
          {/* Hero Section */}
          <div className="podcasts-page__intro-container">
            <h2 className="podcasts-page__section-heading">
              <img src={ctaLeafIcon} alt="Logo Icon" />
              Podcasts
            </h2>
            <p className="podcasts-page__intro-text">
              Unlock the World of Artificial Intelligence through Podcasts
            </p>
          </div>
          {/* Search Section */}
          <div className="podcasts-page__hero">
            <div className="podcasts-page__search-container">
              <span className="podcasts-page__search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search podcasts..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="podcasts-page__search-input"
              />
            </div>
          </div>
          {/* Featured Cards */}
          <div className="podcasts-page__featured-cards">
            {/* Your featured cards */}
          </div>
          {/* Categories */}
          {podcastCategories.map((category, index) => (
            <div key={index} className="podcasts-page__trending-section">
              <div className="podcasts-page__section-header">
                <div className="podcasts-page__section-header-container">
                  <div className="podcasts-page__section-title">
                    <h2>
                      <img src={ctaLeafIcon} alt="Logo Icon" />
                      {category}
                    </h2>
                  </div>
                </div>
                <Link
                  to={`/podcast/list/${encodeURIComponent(category)}`}
                  className="podcasts-page__read-more"
                >
                  <span>Read More</span> →
                </Link>
              </div>

              {/* Podcast Grid */}
              <div className="podcasts-page__podcast-grid">
                {podcastData.map((podcast) => (
                  <Link
                    to={`/podcast/detail/${podcast.id}`}
                    key={podcast.id}
                    className="podcasts-page__podcast-card"
                  >
                    <div
                      className="podcasts-page__podcast-image"
                      style={{ backgroundImage: `url(${podcast.image})` }}
                    >
                      <div className="podcasts-page__inner-embrace-tag">
                        Inner Embrace
                      </div>
                      <button
                        className="podcasts-page__play-button"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add play logic here
                        }}
                      >
                        <i className="fas fa-play"></i>
                      </button>
                    </div>
                    <div className="podcasts-page__podcast-info">
                      <p className="podcasts-page__podcast-description">
                        {podcast.title}
                      </p>
                      <p className="podcasts-page__podcast-host">
                        {podcast.host}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Newsletter Section */}
        <section className="podcasts-page__newsletter-container">
          <div className="podcasts-page__newsletter">
            <h2 className="podcasts-page__section-heading">
              <img src={ctaLeafIcon} alt="Logo Icon" />
              Slogan Inner Embrace
            </h2>
            <p className="podcasts-page__newsletter-text">
              Whether you're looking for 1-on-1 support, a reflective AI space,
              or clear guidance on a challenge – Inner Embrace offers a path
              that meets you where you are.
            </p>
            <button
              onClick={handleAICoachingClick}
              className="podcasts-page__newsletter-btn"
            >
              Try AI Coaching for Free
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PodcastsPage;
