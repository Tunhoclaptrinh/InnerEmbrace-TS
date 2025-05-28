import React, { useState } from "react";
import "../../assets/css/PodcastList.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
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
  category: string;
}

const PodcastList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { category } = useParams<{ category: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Generate podcast data array with categories
  const podcastData: PodcastData[] = Array(16)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      title: "Whether you're looking for 1-on-1 support",
      host: index % 2 === 0 ? "Alessandro Conti" : "ZukiPasa",
      image: [pod1Image, pod2Image, pod3Image, pod4Image][index % 4],
      category: ["Trending Podcasts", "Relax Podcasts", "Education Podcasts"][
        index % 3
      ],
    }));

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

  // Filter podcasts based on category and search term
  const filteredPodcasts = podcastData.filter(
    (podcast) =>
      (!category || podcast.category === decodeURIComponent(category)) &&
      (podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        podcast.host.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="podcast-list">
      <main className="podcast-list__main-content">
        <section className="podcast-list__section">
          {/* Top Navigation and Search */}
          <div className="podcast-list__top-navigation">
            <Link to="/podcast" className="podcast-list__back-link">
              Back To All Podcasts
            </Link>
            {/* Header Section */}
            <div className="podcast-list__header-container">
              <h2 className="podcast-list__section-heading">
                <img src={ctaLeafIcon} alt="Logo Icon" />
                {category || "All Podcasts"}
              </h2>
            </div>
            <div className="podcast-list__search-container">
              <span className="podcast-list__search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search podcasts..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="podcast-list__search-input"
              />
            </div>
          </div>

          {/* Podcast Grid */}
          <div className="podcast-list__grid-container">
            <div className="podcast-list__podcast-grid">
              {filteredPodcasts.length > 0 ? (
                filteredPodcasts.map((podcast) => (
                  <Link
                    to={`/podcast/detail/${podcast.id}`}
                    key={podcast.id}
                    className="podcast-list__podcast-card"
                  >
                    <div
                      className="podcast-list__podcast-image"
                      style={{ backgroundImage: `url(${podcast.image})` }}
                    >
                      <div className="podcast-list__inner-embrace-tag">
                        Inner Embrace
                      </div>
                      <button
                        className="podcast-list__play-button"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add play logic here
                        }}
                      >
                        <i className="fas fa-play"></i>
                      </button>
                    </div>
                    <div className="podcast-list__podcast-info">
                      <p className="podcast-list__podcast-description">
                        {podcast.title}
                      </p>
                      <p className="podcast-list__podcast-host">
                        {podcast.host}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="podcast-list__no-results">
                  <p>No podcasts found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="podcast-list__newsletter-container">
          <div className="podcast-list__newsletter">
            <h2 className="podcast-list__section-heading">
              <img src={ctaLeafIcon} alt="Logo Icon" />
              Slogan Inner Embrace
            </h2>
            <p className="podcast-list__newsletter-text">
              Whether you're looking for 1-on-1 support, a reflective AI space,
              or clear guidance on a challenge – Inner Embrace offers a path
              that meets you where you are.
            </p>
            <button
              onClick={handleAICoachingClick}
              className="podcast-list__newsletter-btn"
            >
              Try AI Coaching for Free
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PodcastList;
