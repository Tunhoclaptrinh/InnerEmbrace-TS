import React, { useState, useEffect } from "react";
import "../../assets/css/PodcastList.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getAllPodcasts,
  getPodcastsByCategory,
  getAllCategories,
  searchPodcasts,
  Podcast,
  PodcastCategory,
} from "../../services/podcast.service";
import ctaLeafIcon from "../../assets/img/cta-leaf.png";
import pod1Image from "../../assets/img/pod1.png";
import pod2Image from "../../assets/img/pod2.png";
import pod3Image from "../../assets/img/pod3.png";
import pod4Image from "../../assets/img/pod4.png";

const PodcastList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState<Podcast[]>([]);
  const [currentCategory, setCurrentCategory] =
    useState<PodcastCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const { category: categoryParam } = useParams<{ category: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Default fallback images
  const fallbackImages = [pod1Image, pod2Image, pod3Image, pod4Image];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch data when component mounts or category changes
  useEffect(() => {
    fetchPodcastData();
  }, [categoryParam]);

  const fetchPodcastData = async () => {
    try {
      setLoading(true);
      setError("");

      // Get categories to find current category info
      const categoriesResult = await getAllCategories().catch(() => ({
        data: [],
      }));

      // Find current category if categoryParam exists
      let categoryInfo: PodcastCategory | null = null;
      if (categoryParam) {
        categoryInfo =
          categoriesResult.data.find(
            (cat) =>
              cat.id === categoryParam ||
              cat.slug === categoryParam ||
              cat.name === decodeURIComponent(categoryParam)
          ) || null;
        setCurrentCategory(categoryInfo);
      }

      // Fetch podcasts based on category
      let podcastsResult;
      if (categoryParam && categoryInfo) {
        // Fetch podcasts by category
        podcastsResult = await getPodcastsByCategory(categoryInfo.id).catch(
          () => ({ data: [] })
        );
      } else {
        // Fetch all podcasts
        podcastsResult = await getAllPodcasts().catch(() => ({ data: [] }));
      }

      setPodcasts(podcastsResult.data);
      setFilteredPodcasts(podcastsResult.data);

      // Show info message if no data found
      if (podcastsResult.data.length === 0) {
        setError(
          categoryParam
            ? `No podcasts found in "${
                categoryInfo?.name || categoryParam
              }" category. Using sample data.`
            : "No podcasts available. Using sample data."
        );
      }
    } catch (err: any) {
      console.error("Error fetching podcast data:", err);
      setError("Failed to load podcasts. Using fallback content.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      setSearchLoading(true);
      try {
        // Try search from API first
        const result = await searchPodcasts(value);

        // If we have a category filter, further filter the search results
        let filteredResults = result.data;
        if (categoryParam && currentCategory) {
          filteredResults = result.data.filter(
            (podcast) => podcast.categoryId === currentCategory.id
          );
        }

        setFilteredPodcasts(filteredResults);
      } catch (err: any) {
        console.error("Search API error, falling back to local search:", err);

        // Fallback: search local data
        const filtered = podcasts.filter(
          (podcast) =>
            podcast.title.toLowerCase().includes(value.toLowerCase()) ||
            podcast.authorName.toLowerCase().includes(value.toLowerCase()) ||
            (podcast.description &&
              podcast.description.toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredPodcasts(filtered);
      } finally {
        setSearchLoading(false);
      }
    } else {
      // Reset to all podcasts when search is cleared
      setFilteredPodcasts(podcasts);
    }
  };

  const handleAICoachingClick = () => {
    if (isAuthenticated) {
      navigate("/chat/map");
    } else {
      navigate("/login");
    }
  };

  const getImageUrl = (podcast: Podcast, index: number) => {
    if (podcast.coverImage && podcast.coverImage.startsWith("http")) {
      return podcast.coverImage;
    }
    return fallbackImages[index % fallbackImages.length];
  };

  const handlePlayPodcast = (e: React.MouseEvent, podcast: Podcast) => {
    e.preventDefault();
    console.log(`Playing podcast: ${podcast.title}`);
    // TODO: Implement actual play functionality
  };

  // Get page title
  const getPageTitle = () => {
    if (currentCategory) {
      return currentCategory.name;
    }
    if (categoryParam) {
      return decodeURIComponent(categoryParam);
    }
    return "All Podcasts";
  };

  if (loading) {
    return (
      <div className="podcast-list">
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
          <p>Loading podcasts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="podcast-list">
      <main className="podcast-list__main-content">
        <section className="podcast-list__section">
          {/* Top Navigation and Search */}
          <div className="podcast-list__top-navigation">
            <Link to="/podcasts" className="podcast-list__back-link">
              Back To All Podcasts
            </Link>

            {/* Header Section */}
            <div className="podcast-list__header-container">
              <h2
                className="section-heading"
                style={{
                  fontWeight: 600,
                }}
              >
                <img src={ctaLeafIcon} alt="Logo Icon" />
                {getPageTitle()}
              </h2>
            </div>

            {/* Search Section */}
            <div className="podcast-list__search-container">
              <span className="podcast-list__search-icon">
                {searchLoading ? "⏳" : "🔍"}
              </span>
              <input
                type="text"
                placeholder="Search podcasts..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="podcast-list__search-input"
                disabled={searchLoading}
              />
            </div>
          </div>

          {/* Error/Info Message */}
          {error && (
            <div
              className="info-message"
              style={{
                color: "#2563eb",
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "8px",
                padding: "12px 16px",
                margin: "20px 0",
                textAlign: "center",
              }}
            >
              <strong>ℹ️ Info:</strong> {error}
            </div>
          )}

          {/* Podcast Grid */}
          <div className="podcast-list__grid-container">
            <div className="podcast-list__podcast-grid">
              {filteredPodcasts.length > 0 ? (
                filteredPodcasts.map((podcast, index) => (
                  <Link
                    to={`/podcast/detail/${podcast.id}`}
                    key={podcast.id}
                    className="podcast-list__podcast-card"
                  >
                    <div
                      className="podcast-list__podcast-image"
                      style={{
                        backgroundImage: `url(${getImageUrl(podcast, index)})`,
                      }}
                    >
                      <div className="podcast-list__inner-embrace-tag">
                        Inner Embrace
                      </div>
                      <button
                        className="podcast-list__play-button"
                        onClick={(e) => handlePlayPodcast(e, podcast)}
                      >
                        <i className="fas fa-play"></i>
                      </button>
                    </div>
                    <div className="podcast-list__podcast-info">
                      <p className="podcast-list__podcast-description">
                        {podcast.title}
                      </p>
                      <p className="podcast-list__podcast-host">
                        {podcast.authorName}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div
                  className="podcast-list__no-results"
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "40px",
                    color: "#666",
                    fontStyle: "italic",
                  }}
                >
                  {searchTerm ? (
                    <div>
                      <h3>No podcasts found for "{searchTerm}"</h3>
                      <p>
                        Try searching with different keywords or browse other
                        categories.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h3>No podcasts available</h3>
                      <p>
                        {categoryParam
                          ? `No podcasts found in "${getPageTitle()}" category.`
                          : "No podcasts are currently available."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Results count */}
          {filteredPodcasts.length > 0 && (
            <div
              style={{
                textAlign: "center",
                margin: "20px 0",
                color: "#666",
                fontSize: "14px",
              }}
            >
              {searchTerm
                ? `Found ${filteredPodcasts.length} podcast${
                    filteredPodcasts.length !== 1 ? "s" : ""
                  } for "${searchTerm}"`
                : `Showing ${filteredPodcasts.length} podcast${
                    filteredPodcasts.length !== 1 ? "s" : ""
                  }`}
              {categoryParam && ` in ${getPageTitle()}`}
            </div>
          )}
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
