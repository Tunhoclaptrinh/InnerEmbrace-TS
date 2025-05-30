import React, { useEffect, useState } from "react";
import "./../../assets/css/PodcastDetail.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getPodcastById,
  getPodcastEpisodes,
  getAllPodcasts,
  Podcast,
  Episode,
  // Import audio player functions
  initializeAudioPlayer,
  playEpisode,
  pauseEpisode,
  resumeEpisode,
  stopEpisode,
  isPlaying,
  getCurrentEpisode,
  getCurrentPlaybackTime,
  getAudioDuration,
  setPlaybackTime,
  togglePlayPause,
  destroyAudioPlayer,
} from "../../services/podcast.service";
import ctaLeafIcon from "../../assets/img/cta-leaf.png";
import pod1Image from "../../assets/img/pod1.png";
import pod2Image from "../../assets/img/pod2.png";
import pod3Image from "../../assets/img/pod3.png";
import pod4Image from "../../assets/img/pod4.png";

interface PodcastEpisode {
  number: string;
  date: string;
  title: string;
  duration: string;
  id: string;
  audioUrl?: string; // Add audio URL
  coverImage?: string;
}

interface RelatedPodcast {
  id: string;
  title: string;
  host: string;
  image: string;
}

const PodcastDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [relatedPodcasts, setRelatedPodcasts] = useState<RelatedPodcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  // Audio player states
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [audioError, setAudioError] = useState<string>("");

  // Player bar states
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [isPlayerHidden, setIsPlayerHidden] = useState(false);

  const fallbackImages = [pod1Image, pod2Image, pod3Image, pod4Image];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      fetchPodcastData(id);
    }

    // Initialize audio player
    initializeAudioPlayer({
      onPlay: () => {
        setIsAudioPlaying(true);
        setAudioError("");
      },
      onPause: () => {
        setIsAudioPlaying(false);
      },
      onEnded: () => {
        setIsAudioPlaying(false);
        setCurrentlyPlaying(null);
        setCurrentTime(0);
        setIsPlayerHidden(true); // Auto hide when ended
      },
      onTimeUpdate: (current: number, duration: number) => {
        setCurrentTime(current);
        setTotalDuration(duration);
      },
      onError: (errorMsg: string) => {
        setAudioError(errorMsg);
        setIsAudioPlaying(false);
        setCurrentlyPlaying(null);
      },
    });

    // Cleanup on unmount
    return () => {
      destroyAudioPlayer();
    };
  }, [id]);

  const fetchPodcastData = async (podcastId: string) => {
    try {
      setLoading(true);
      setError("");

      // Fetch podcast details and episodes in parallel
      const [podcastResult, episodesResult, allPodcastsResult] =
        await Promise.all([
          getPodcastById(podcastId).catch(() => ({ data: null })),
          getPodcastEpisodes(podcastId).catch(() => ({ data: [] })),
          getAllPodcasts().catch(() => ({ data: [] })),
        ]);

      if (podcastResult.data) {
        setPodcast(podcastResult.data);
      } else {
        // Fallback data
        setPodcast({
          id: podcastId,
          title: "In my Feelings",
          description:
            "This is the official Podcast channel of Alexandra Centi Communications. Join Centi, a YouTuber and CEO, directly teaching skills courses. Subscribe to hear interviews and regularly interact with her on the topics you want her to share!",
          authorName: "Henrik Sørensen",
          coverImage: pod4Image,
          categoryId: "1",
        });
      }

      // Convert API episodes to display format
      if (episodesResult.data.length > 0) {
        const formattedEpisodes = episodesResult.data.map(
          (episode: Episode, index: number) => ({
            number: String(index + 1).padStart(2, "0"),
            date: episode.createdAt
              ? new Date(episode.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : `March ${21 + index}, 2025`,
            title: episode.title,
            duration: formatDuration(episode.duration),
            id: episode.id,
            audioUrl: episode.audio, // Include audio URL
            coverImage: episode.coverImage, // Thêm coverImage từ API
          })
        );
        setEpisodes(formattedEpisodes);
      } else {
        // Fallback episodes with sample audio URLs
        setEpisodes([
          {
            number: "01",
            date: "March 21, 2025",
            title: "Handlebars (Feat. Dua Lipa)",
            duration: "03:14",
            id: "episode-1",
            audioUrl:
              "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Sample audio
          },
          {
            number: "02",
            date: "March 22, 2025",
            title: "Understanding AI Ethics",
            duration: "45:30",
            id: "episode-2",
            audioUrl:
              "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Sample audio
          },
          {
            number: "03",
            date: "March 23, 2025",
            title: "The Future of Machine Learning",
            duration: "32:15",
            id: "episode-3",
            audioUrl:
              "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Sample audio
          },
        ]);
      }

      // Set related podcasts (exclude current podcast)
      const related = allPodcastsResult.data
        .filter((p) => p.id !== podcastId)
        .slice(0, 3)
        .map((p, index) => ({
          id: p.id,
          title: p.title,
          host: p.authorName,
          image: p.coverImage || fallbackImages[index % fallbackImages.length],
        }));

      if (related.length > 0) {
        setRelatedPodcasts(related);
      } else {
        // Fallback related podcasts
        setRelatedPodcasts([
          {
            id: "related-1",
            title: "Whether you're looking for 1-on-1 support",
            host: "Alessandro Conti",
            image: pod1Image,
          },
          {
            id: "related-2",
            title: "AI and Mental Health",
            host: "ZukiPasa",
            image: pod2Image,
          },
          {
            id: "related-3",
            title: "The Power of Self-Reflection",
            host: "Alessandro Conti",
            image: pod3Image,
          },
        ]);
      }
    } catch (err: any) {
      console.error("Error fetching podcast data:", err);
      setError("Failed to load podcast data");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAICoachingClick = () => {
    if (isAuthenticated) {
      navigate("/chat/map");
    } else {
      navigate("/login");
    }
  };

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement actual follow/unfollow API call
  };

  const handlePlayEpisode = async (episodeId: string) => {
    try {
      const episode = episodes.find((ep) => ep.id === episodeId);
      if (!episode) {
        console.error("Episode not found");
        return;
      }

      // If same episode is currently playing, toggle play/pause
      if (currentlyPlaying === episodeId) {
        togglePlayPause();
        return;
      }

      // Stop current episode if any
      if (currentlyPlaying) {
        stopEpisode();
      }

      // Create episode object with audio URL
      const episodeToPlay: Episode = {
        id: episode.id,
        title: episode.title,
        description: "",
        duration: 0, // Will be set by audio player
        audio:
          episode.audioUrl ||
          "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Fallback audio
        position: 0,
      };

      // Play the episode
      await playEpisode(episodeToPlay);
      setCurrentlyPlaying(episodeId);
      setAudioError("");
      setIsPlayerHidden(false); // Show player when playing
      setIsPlayerMinimized(false); // Expand player when playing new episode
    } catch (error: any) {
      console.error("Error playing episode:", error);
      setAudioError(error.message);
      setCurrentlyPlaying(null);
    }
  };

  const handlePlayPodcast = () => {
    if (episodes.length > 0) {
      handlePlayEpisode(episodes[0].id);
    }
  };

  const handleRelatedPodcastClick = (podcastId: string) => {
    navigate(`/podcast/detail/${podcastId}`);
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const progressWidth = rect.width;
    const clickRatio = clickX / progressWidth;
    const newTime = clickRatio * totalDuration;

    setPlaybackTime(newTime);
  };

  const handlePlayerToggle = () => {
    if (currentlyPlaying) {
      togglePlayPause();
    }
  };

  const handlePlayerStop = () => {
    stopEpisode();
    setCurrentlyPlaying(null);
    setIsAudioPlaying(false);
    setCurrentTime(0);
    setIsPlayerHidden(true); // Hide player when stopped
  };

  // New handlers for player controls
  const handlePlayerMinimize = () => {
    setIsPlayerMinimized(!isPlayerMinimized);
  };

  const handlePlayerClose = () => {
    setIsPlayerHidden(true);
    // Optionally stop the audio as well
    if (currentlyPlaying) {
      handlePlayerStop();
    }
  };

  const handlePlayerExpand = () => {
    setIsPlayerHidden(false);
    setIsPlayerMinimized(false);
  };

  if (loading) {
    return (
      <div className="podcast-detail">
        <div
          className="loading-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            className="loading-spinner"
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p>Loading podcast details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="podcast-detail">
        <div
          className="error-container"
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#e74c3c",
          }}
        >
          <h3>Error Loading Podcast</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate("/podcasts")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Back to Podcasts
          </button>
        </div>
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="podcast-detail">
        <div
          className="not-found-container"
          style={{
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <h3>Podcast Not Found</h3>
          <Link to="/podcast">Back to Podcasts</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <main className="podcast-detail">
        <Link to="/podcast" className="podcast-detail__back-link">
          Back To All Podcasts
        </Link>

        {/* Audio Error Display */}
        {audioError && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "4px",
              border: "1px solid #e57373",
            }}
          >
            Audio Error: {audioError}
          </div>
        )}

        <div className="podcast-detail__main-container">
          <div className="podcast-detail__content">
            {/* Podcast Header */}
            <div className="podcast-detail__header">
              <img
                src={podcast.coverImage || pod4Image}
                alt={podcast.title}
                className="podcast-detail__header-image"
              />
              <div className="podcast-detail__info">
                <h1 className="podcast-detail__title">{podcast.title}</h1>
                <h2 className="podcast-detail__author">{podcast.authorName}</h2>
                <div className="podcast-detail__actions">
                  <div className="podcast-detail__actions-left">
                    <button
                      className={`podcast-detail__follow-btn ${
                        isFollowing ? "following" : ""
                      }`}
                      onClick={handleFollowClick}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                    <span className="podcast-detail__listeners">
                      100+ monthly listeners
                      {/* {Math.floor(Math.random() * 5000) + 1000} monthly */}
                    </span>
                  </div>
                  <button
                    className="podcast-detail__play-btn"
                    onClick={handlePlayPodcast}
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>

            {/* Episodes List */}
            <h2 className="podcast-detail__section-title">Episodes</h2>
            <ul className="podcast-detail__episodes">
              {episodes.map((episode, index) => (
                <li
                  key={episode.id}
                  className={`podcast-detail__episode ${
                    currentlyPlaying === episode.id ? "playing" : ""
                  }`}
                  onClick={() => handlePlayEpisode(episode.id)}
                >
                  <span className="podcast-detail__episode-number">
                    {episode.number}
                  </span>
                  <img
                    src={
                      episode.coverImage ||
                      podcast.coverImage ||
                      fallbackImages[index % fallbackImages.length]
                    }
                    alt={episode.title}
                    className="podcast-detail__episode-image"
                  />
                  <div className="podcast-detail__episode-info">
                    <div className="podcast-detail__episode-date">
                      {episode.date}
                    </div>
                    <div className="podcast-detail__episode-title">
                      {episode.title}
                      {/* Optional: Audio visualizer for playing episode */}
                      {currentlyPlaying === episode.id && isAudioPlaying && (
                        <div className="audio-visualizer">
                          <div className="bar"></div>
                          <div className="bar"></div>
                          <div className="bar"></div>
                          <div className="bar"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="podcast-detail__episode-duration">
                    {episode.duration}
                  </div>
                  <button
                    className={`podcast-detail__episode-play ${
                      currentlyPlaying === episode.id && isAudioPlaying
                        ? "playing"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayEpisode(episode.id);
                    }}
                  >
                    {currentlyPlaying === episode.id && isAudioPlaying
                      ? "⏸"
                      : "▶"}
                  </button>
                  <button className="podcast-detail__episode-add">+</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar */}
          <div className="podcast-detail__sidebar">
            <img
              src={podcast.coverImage || pod4Image}
              alt={podcast.title}
              className="podcast-detail__sidebar-image"
            />
            <h2 className="podcast-detail__sidebar-title">{podcast.title}</h2>
            <h3 className="podcast-detail__sidebar-author">
              {podcast.authorName}
            </h3>
            <p className="podcast-detail__sidebar-description">
              {podcast.description ||
                "This is the official Podcast channel. Join us for insightful conversations and regular episodes on topics that matter to you!"}
            </p>
            <p className="podcast-detail__sidebar-info">
              Includes {episodes.length} episodes
            </p>
            <p className="podcast-detail__sidebar-info">
              Published in{" "}
              {podcast.createdAt
                ? new Date(podcast.createdAt).getFullYear()
                : 2025}
            </p>
          </div>
        </div>

        {/* Related Podcasts Section */}
        <div className="podcast-detail__related">
          <div className="podcast-detail__related-header">
            <h2 className="podcast-detail__related-title">Related Podcasts</h2>
            <Link to="/podcast" className="podcast-detail__browse-link">
              Browse All Podcasts
            </Link>
          </div>

          <div className="podcast-detail__related-grid">
            {relatedPodcasts.map((relatedPodcast) => (
              <div
                key={relatedPodcast.id}
                className="podcast-detail__related-card"
                onClick={() => handleRelatedPodcastClick(relatedPodcast.id)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="podcast-detail__related-image"
                  style={{ backgroundImage: `url(${relatedPodcast.image})` }}
                >
                  <div className="podcast-detail__related-tag">
                    Inner Embrace
                  </div>
                  <button
                    className="podcast-detail__related-play"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(
                        `Playing related podcast: ${relatedPodcast.id}`
                      );
                    }}
                  >
                    ▶
                  </button>
                </div>
                <div className="podcast-detail__related-content">
                  <p className="podcast-detail__related-description">
                    {relatedPodcast.title}
                  </p>
                  <p className="podcast-detail__related-host">
                    {relatedPodcast.host}
                  </p>
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

      {/* Enhanced Player Bar with controls */}
      {currentlyPlaying && episodes.length > 0 && !isPlayerHidden && (
        <div
          className={`podcast-detail__player ${
            isPlayerMinimized ? "minimized" : ""
          }`}
        >
          {/* Player Toggle Button (when hidden) */}
          {isPlayerHidden && (
            <button
              className="podcast-detail__player-toggle"
              onClick={handlePlayerExpand}
              title="Show Player"
            >
              ▲
            </button>
          )}

          {/* Main Player Content */}
          {!isPlayerMinimized && (
            <>
              <img
                src={
                  episodes.find((e) => e.id === currentlyPlaying)?.coverImage ||
                  podcast.coverImage ||
                  pod4Image
                }
                alt="Episode cover"
                className="podcast-detail__player-cover"
              />

              <button
                className="podcast-detail__player-btn"
                onClick={handlePlayerToggle}
              >
                {isAudioPlaying ? "⏸" : "▶"}
              </button>

              <div className="podcast-detail__player-info">
                <div className="podcast-detail__player-date">
                  {episodes.find((e) => e.id === currentlyPlaying)?.date}
                </div>
                <div className="podcast-detail__player-title">
                  {episodes.find((e) => e.id === currentlyPlaying)?.title}
                </div>
                <div
                  className="podcast-detail__player-progress"
                  onClick={handleProgressClick}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="podcast-detail__player-progress-fill"
                    style={{
                      width:
                        totalDuration > 0
                          ? `${(currentTime / totalDuration) * 100}%`
                          : "0%",
                    }}
                  ></div>
                </div>
                <div className="podcast-detail__player-time-info">
                  <span>{formatTime(currentTime)}</span>
                  <span> / </span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
              </div>
              <button className="podcast-detail__player-add">+</button>
            </>
          )}

          {/* Minimized Player Content */}
          {isPlayerMinimized && (
            <div className="podcast-detail__player-minimized">
              <img
                src={
                  episodes.find((e) => e.id === currentlyPlaying)?.coverImage ||
                  podcast.coverImage ||
                  pod4Image
                }
                alt="Episode cover"
                className="podcast-detail__player-cover-mini"
              />
              <button
                className="podcast-detail__player-btn-mini"
                onClick={handlePlayerToggle}
              >
                {isAudioPlaying ? "⏸" : "▶"}
              </button>
              <div className="podcast-detail__player-info-mini">
                <div className="podcast-detail__player-title-mini">
                  {episodes.find((e) => e.id === currentlyPlaying)?.title}
                </div>
                <div
                  className="podcast-detail__player-progress-mini"
                  onClick={handleProgressClick}
                >
                  <div
                    className="podcast-detail__player-progress-fill"
                    style={{
                      width:
                        totalDuration > 0
                          ? `${(currentTime / totalDuration) * 100}%`
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Player Control Buttons */}
          <div className="podcast-detail__player-controls">
            <button
              className="podcast-detail__player-control-btn"
              onClick={handlePlayerMinimize}
              title={isPlayerMinimized ? "Expand Player" : "Minimize Player"}
            >
              {isPlayerMinimized ? "▲" : "▼"}
            </button>
            <button
              className="podcast-detail__player-control-btn close"
              onClick={handlePlayerClose}
              title="Close Player"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Player Toggle Button (when completely hidden) */}
      {isPlayerHidden && currentlyPlaying && (
        <button
          className="podcast-detail__player-show-btn"
          onClick={handlePlayerExpand}
          title="Show Player"
        >
          <span>♫</span>
          <span>Now Playing</span>
        </button>
      )}
    </div>
  );
};

export default PodcastDetail;
