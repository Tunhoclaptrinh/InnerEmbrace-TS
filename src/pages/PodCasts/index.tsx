import React, { useState, useEffect, useCallback } from "react";
import "../../assets/css/PodCasts.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ctaLeafIcon from "../../assets/img/cta-leaf.png";
import pod1Image from "../../assets/img/pod1.png";
import pod2Image from "../../assets/img/pod2.png";
import pod3Image from "../../assets/img/pod3.png";
import pod4Image from "../../assets/img/pod4.png";

// Import fixed services - UPDATED IMPORT
import {
  getAllPodcasts,
  getAllCategories,
  searchPodcasts,
  getPodcastsByCategory,
  Podcast,
  PodcastCategory,
} from "../../services/podcast.service";

const PodcastsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState<Podcast[]>([]);
  const [categories, setCategories] = useState<PodcastCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Default fallback images
  const fallbackImages = [pod1Image, pod2Image, pod3Image, pod4Image];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch podcasts and categories in parallel
      const [podcastsResult, categoriesResult] = await Promise.all([
        getAllPodcasts().catch((err) => {
          console.warn("Failed to fetch podcasts:", err);
          return { data: [] };
        }),
        getAllCategories().catch((err) => {
          // Updated function name
          console.warn("Failed to fetch categories:", err);
          return { data: [] };
        }),
      ]);

      setPodcasts(podcastsResult.data);
      setFilteredPodcasts(podcastsResult.data);
      setCategories(categoriesResult.data);

      // Show info message if using fallback data
      if (
        podcastsResult.data.length === 0 &&
        categoriesResult.data.length > 0
      ) {
        setError(
          "Using sample data. Connect to your API to see real podcasts."
        );
      }
    } catch (err: any) {
      console.error("Error fetching initial data:", err);
      setError("Failed to load data. Using fallback content.");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchValue: string) => {
      if (searchValue.trim()) {
        setSearchLoading(true);
        try {
          // Try search from API first
          const result = await searchPodcasts(searchValue);
          setFilteredPodcasts(result.data);
        } catch (err: any) {
          console.error("Search API error, falling back to local search:", err);

          // Fallback: search local data
          const filtered = podcasts.filter(
            (podcast) =>
              podcast.title.toLowerCase().includes(searchValue.toLowerCase()) ||
              podcast.authorName
                .toLowerCase()
                .includes(searchValue.toLowerCase()) ||
              (podcast.description &&
                podcast.description
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()))
          );
          setFilteredPodcasts(filtered);
        } finally {
          setSearchLoading(false);
        }
      } else {
        // Reset to all podcasts when search is cleared
        setFilteredPodcasts(podcasts);
        setSearchLoading(false);
      }
    }, 500), // 500ms delay
    [podcasts]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Call debounced search
    debouncedSearch(value);
  };

  const handleAICoachingClick = () => {
    if (isAuthenticated) {
      navigate("/chat/map");
    } else {
      navigate("/login");
    }
  };

  const getPodcastsByCategoryLocal = (categoryId: string) => {
    // Updated to use string ID
    const podcastsToFilter = searchTerm ? filteredPodcasts : podcasts;
    return podcastsToFilter.filter(
      (podcast) => podcast.categoryId === categoryId
    );
  };

  const getImageUrl = (podcast: Podcast, index: number) => {
    // Updated field name from image to coverImage
    if (podcast.coverImage && podcast.coverImage.startsWith("http")) {
      return podcast.coverImage;
    }
    return fallbackImages[index % fallbackImages.length];
  };

  const handlePlayPodcast = (e: React.MouseEvent, podcast: Podcast) => {
    e.preventDefault();
    console.log(`Playing podcast: ${podcast.title}`);
    // TODO: Implement actual play functionality
    // You might want to:
    // 1. Navigate to a player page
    // 2. Open a modal player
    // 3. Start playing in a mini player
  };

  if (loading) {
    return (
      <div className="podcasts-page">
        <div
          className="loading-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
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
            {/* Search Section */}
            <div className="podcasts-page__hero">
              <div className="podcasts-page__search-container">
                <span className="podcasts-page__search-icon">
                  {searchLoading ? "⏳" : "🔍"}
                </span>
                <input
                  type="text"
                  placeholder="Search podcasts..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="podcasts-page__search-input"
                />
              </div>
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

          {/* Categories */}
          {categories.map((category) => {
            const categoryPodcasts = getPodcastsByCategoryLocal(category.id);

            return (
              <div
                key={category.id}
                className="podcasts-page__trending-section"
              >
                <div className="podcasts-page__section-header">
                  <div className="podcasts-page__section-header-container">
                    <div className="podcasts-page__section-title">
                      <h2>
                        <img src={ctaLeafIcon} alt="Logo Icon" />
                        {category.name}
                      </h2>
                    </div>
                  </div>
                  <Link
                    to={`/podcast/list/${category.id}`}
                    className="podcasts-page__read-more"
                  >
                    <span>Read More</span> →
                  </Link>
                </div>

                {/* Podcast Grid */}
                <div className="podcasts-page__podcast-grid">
                  {categoryPodcasts.length > 0 ? (
                    categoryPodcasts
                      .slice(0, 4) // Show max 4 podcasts per category
                      .map((podcast, index) => (
                        <Link
                          to={`/podcast/detail/${podcast.id}`}
                          key={podcast.id}
                          className="podcasts-page__podcast-card"
                        >
                          <div
                            className="podcasts-page__podcast-image"
                            style={{
                              backgroundImage: `url(${getImageUrl(
                                podcast,
                                index
                              )})`,
                            }}
                          >
                            <div className="podcasts-page__inner-embrace-tag">
                              Inner Embrace
                            </div>
                            <button
                              className="podcasts-page__play-button"
                              onClick={(e) => handlePlayPodcast(e, podcast)}
                            >
                              <i className="fas fa-play"></i>
                            </button>
                          </div>
                          <div className="podcasts-page__podcast-info">
                            <p className="podcasts-page__podcast-description">
                              {podcast.title}
                            </p>
                            <p className="podcasts-page__podcast-host">
                              {podcast.authorName} {/* Updated field name */}
                            </p>
                          </div>
                        </Link>
                      ))
                  ) : (
                    <div
                      className="no-podcasts-message"
                      style={{
                        gridColumn: "1 / -1",
                        textAlign: "center",
                        padding: "40px",
                        color: "#666",
                        fontStyle: "italic",
                      }}
                    >
                      {searchTerm
                        ? `No podcasts found in "${category.name}" for "${searchTerm}"`
                        : `No podcasts available in "${category.name}" category`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Global no results message */}
          {searchTerm && filteredPodcasts.length === 0 && (
            <div
              className="no-results-global"
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#666",
              }}
            >
              <h3>No podcasts found for "{searchTerm}"</h3>
              <p>
                Try searching with different keywords or browse by category.
              </p>
            </div>
          )}
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

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

export default PodcastsPage;
