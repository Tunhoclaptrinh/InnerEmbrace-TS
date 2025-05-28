import React from "react";
import "./../../assets/css/PodcastDetail.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ctaLeafIcon from "../../assets/img/cta-leaf.png";
import pod1Image from "../../assets/img/pod1.png";
import pod2Image from "../../assets/img/pod2.png";
import pod3Image from "../../assets/img/pod3.png";
import pod4Image from "../../assets/img/pod4.png";

interface Episode {
  number: string;
  date: string;
  title: string;
  duration: string;
}

interface RelatedPodcast {
  id: number;
  title: string;
  host: string;
  image: string;
}

const PodcastDetail: React.FC = () => {
  const { id, category } = useParams<{ id: string; category: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const podcastEpisodes: Episode[] = [
    {
      number: "01",
      date: "March 21, 2025",
      title: "Handlebars (Feat. Dua Lipa)",
      duration: "03:14",
    },
    {
      number: "02",
      date: "March 22, 2025",
      title: "Understanding AI Ethics",
      duration: "45:30",
    },
    {
      number: "03",
      date: "March 23, 2025",
      title: "The Future of Machine Learning",
      duration: "32:15",
    },
  ];

  const relatedPodcasts: RelatedPodcast[] = [
    {
      id: 1,
      title: "Whether you're looking for 1-on-1 support",
      host: "Alessandro Conti",
      image: pod1Image,
    },
    {
      id: 2,
      title: "AI and Mental Health",
      host: "ZukiPasa",
      image: pod2Image,
    },
    {
      id: 3,
      title: "The Power of Self-Reflection",
      host: "Alessandro Conti",
      image: pod3Image,
    },
  ];

  const handleAICoachingClick = () => {
    if (isAuthenticated) {
      navigate("/chat/map");
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <main className="podcast-detail">
        <Link to="/podcasts/list" className="podcast-detail__back-link">
          Back To All Trending
        </Link>

        <div className="podcast-detail__main-container">
          <div className="podcast-detail__content">
            {/* Podcast Header */}
            <div className="podcast-detail__header">
              <img
                src={pod4Image}
                alt="In my Feelings Podcast"
                className="podcast-detail__header-image"
              />
              <div className="podcast-detail__info">
                <h1 className="podcast-detail__title">In my Feelings</h1>
                <h2 className="podcast-detail__author">Henrik Sørensen</h2>
                <div className="podcast-detail__actions">
                  <div className="podcast-detail__actions-left">
                    <button className="podcast-detail__follow-btn">
                      Follow
                    </button>
                    <span className="podcast-detail__listeners">
                      1,738 monthly listeners
                    </span>
                  </div>
                  <button className="podcast-detail__play-btn">▶</button>
                </div>
              </div>
            </div>

            {/* Player Bar */}
            <div className="podcast-detail__player">
              <button className="podcast-detail__player-btn">▶</button>
              <div className="podcast-detail__player-info">
                <div className="podcast-detail__player-date">
                  March 21, 2025
                </div>
                <div className="podcast-detail__player-title">
                  Handlebars (Feat. Dua Lipa)
                </div>
                <div className="podcast-detail__player-progress">
                  <div className="podcast-detail__player-progress-fill"></div>
                </div>
              </div>
              <div className="podcast-detail__player-time">03:14</div>
              <button className="podcast-detail__player-add">+</button>
            </div>

            {/* Episodes List */}
            <h2 className="podcast-detail__section-title">Playlist Podcasts</h2>
            <ul className="podcast-detail__episodes">
              {podcastEpisodes.map((episode, index) => (
                <li key={index} className="podcast-detail__episode">
                  <span className="podcast-detail__episode-number">
                    {episode.number}
                  </span>
                  <img
                    src={pod1Image}
                    alt={episode.title}
                    className="podcast-detail__episode-image"
                  />
                  <div className="podcast-detail__episode-info">
                    <div className="podcast-detail__episode-date">
                      {episode.date}
                    </div>
                    <div className="podcast-detail__episode-title">
                      {episode.title}
                    </div>
                  </div>
                  <div className="podcast-detail__episode-duration">
                    {episode.duration}
                  </div>
                  <button className="podcast-detail__episode-add">+</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar */}
          <div className="podcast-detail__sidebar">
            <img
              src={pod4Image}
              alt="In my Feelings"
              className="podcast-detail__sidebar-image"
            />
            <h2 className="podcast-detail__sidebar-title">In my Feelings</h2>
            <h3 className="podcast-detail__sidebar-author">Henrik Sørensen</h3>
            <p className="podcast-detail__sidebar-description">
              This is the official Podcast channel of Alexandra Centi
              Communications. Join Centi, a YouTuber and CEO, directly teaching
              skills courses. Subscribe to hear interviews and regularly
              interact with her on the topics you want her to share!
            </p>
            <p className="podcast-detail__sidebar-info">Includes 12 podcasts</p>
            <p className="podcast-detail__sidebar-info">Published in 2025</p>
          </div>
        </div>

        {/* Related Podcasts Section */}
        <div className="podcast-detail__related">
          <div className="podcast-detail__related-header">
            <h2 className="podcast-detail__related-title">Another Podcasts</h2>
            <Link to="/podcasts/list" className="podcast-detail__browse-link">
              Browse All Trending Podcasts
            </Link>
          </div>

          <div className="podcast-detail__related-grid">
            {relatedPodcasts.map((podcast) => (
              <div key={podcast.id} className="podcast-detail__related-card">
                <div
                  className="podcast-detail__related-image"
                  style={{ backgroundImage: `url(${podcast.image})` }}
                >
                  <div className="podcast-detail__related-tag">
                    Inner Embrace
                  </div>
                  <button className="podcast-detail__related-play">▶</button>
                </div>
                <div className="podcast-detail__related-content">
                  <p className="podcast-detail__related-description">
                    {podcast.title}
                  </p>
                  <p className="podcast-detail__related-host">{podcast.host}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <section className="podcast-detail__newsletter">
          <h2 className="podcast-detail__newsletter-title">
            <img src={ctaLeafIcon} alt="Logo Icon" />
            Slogan Inner Embrace
          </h2>
          <p className="podcast-detail__newsletter-text">
            Whether you're looking for 1-on-1 support, a reflective AI space, or
            clear guidance on a challenge – Inner Embrace offers a path that
            meets you where you are.
          </p>
          <button
            onClick={handleAICoachingClick}
            className="podcast-detail__newsletter-btn"
          >
            Try AI Coaching for Free
          </button>
        </section>
      </main>
    </div>
  );
};

export default PodcastDetail;
