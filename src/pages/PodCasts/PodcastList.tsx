import React, { useState, useEffect, useMemo, useCallback } from "react";
import "../../assets/css/PodcastList.css";
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
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

// Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      if (currentPage > 3) {
        pageNumbers.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push("...");
      }

      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div
      className="pagination-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        margin: "32px 0",
        padding: "20px 0",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        Showing {startItem}-{endItem} of {totalItems} podcasts
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            background: currentPage === 1 ? "#f9fafb" : "#ffffff",
            color: currentPage === 1 ? "#9ca3af" : "#374151",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
        >
          ← Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span
                style={{
                  padding: "8px 4px",
                  color: "#9ca3af",
                  fontSize: "14px",
                }}
              >
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: page === currentPage ? "#3b82f6" : "#ffffff",
                  color: page === currentPage ? "#ffffff" : "#374151",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: page === currentPage ? "600" : "500",
                  minWidth: "40px",
                  transition: "all 0.2s",
                }}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            background: currentPage === totalPages ? "#f9fafb" : "#ffffff",
            color: currentPage === totalPages ? "#9ca3af" : "#374151",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
        >
          Next →
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        <span>Show:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            const event = new CustomEvent("itemsPerPageChange", {
              detail: { value: parseInt(e.target.value) },
            });
            window.dispatchEvent(event);
          }}
          style={{
            padding: "4px 8px",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            background: "#ffffff",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <option value={6}>6 per page</option>
          <option value={12}>12 per page</option>
          <option value={18}>18 per page</option>
          <option value={24}>24 per page</option>
        </select>
      </div>
    </div>
  );
};

const PodcastList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [filteredPodcasts, setFilteredPodcasts] = useState<Podcast[]>([]);
  const [currentCategory, setCurrentCategory] =
    useState<PodcastCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const [searchParams, setSearchParams] = useSearchParams();

  const { category: categoryParam } = useParams<{ category: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Default fallback images
  const fallbackImages = [pod1Image, pod2Image, pod3Image, pod4Image];

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Initialize page and items per page from URL params
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "12");

    setCurrentPage(page);
    setItemsPerPage(perPage);
  }, [searchParams]);

  // Update URL when pagination changes
  const updateUrlParams = useCallback(
    (page: number, perPage: number) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", page.toString());
      newSearchParams.set("per_page", perPage.toString());
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams]
  );

  // Handle items per page change
  useEffect(() => {
    const handleItemsPerPageChange = (event: any) => {
      const newItemsPerPage = event.detail.value;
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
      updateUrlParams(1, newItemsPerPage);
    };

    window.addEventListener("itemsPerPageChange", handleItemsPerPageChange);
    return () => {
      window.removeEventListener(
        "itemsPerPageChange",
        handleItemsPerPageChange
      );
    };
  }, [updateUrlParams]);

  // Calculate pagination values
  const paginationData = useMemo(() => {
    const totalItems = filteredPodcasts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredPodcasts.slice(startIndex, endIndex);

    return {
      totalItems,
      totalPages,
      currentItems,
      startIndex,
      endIndex,
    };
  }, [filteredPodcasts, currentPage, itemsPerPage]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch data when component mounts or category changes
  useEffect(() => {
    fetchPodcastData();
  }, [categoryParam]);

  // Reset to first page when search term or category changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      updateUrlParams(1, itemsPerPage);
    }
  }, [debouncedSearchTerm, categoryParam, updateUrlParams, itemsPerPage]);

  // Handle search when debounced search term changes
  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, podcasts, currentCategory, categoryParam]);

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
        podcastsResult = await getPodcastsByCategory(categoryInfo.id).catch(
          () => ({ data: [] })
        );
      } else {
        podcastsResult = await getAllPodcasts().catch(() => ({ data: [] }));
      }

      setPodcasts(podcastsResult.data);

      // If no search term, show all podcasts
      if (!debouncedSearchTerm.trim()) {
        setFilteredPodcasts(podcastsResult.data);
      }

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

  const handleSearch = async (searchValue: string) => {
    if (!searchValue.trim()) {
      // Reset to all podcasts when search is cleared
      setFilteredPodcasts(podcasts);
      return;
    }

    setSearchLoading(true);
    try {
      // Try search from API first
      const result = await searchPodcasts(searchValue);

      // If we have a category filter, further filter the search results
      let filteredResults = result.data || [];
      if (categoryParam && currentCategory) {
        filteredResults = filteredResults.filter(
          (podcast) => podcast.categoryId === currentCategory.id
        );
      }

      setFilteredPodcasts(filteredResults);
    } catch (err: any) {
      console.error("Search API error, falling back to local search:", err);

      // Fallback: search local data
      const filtered = podcasts.filter((podcast) => {
        const searchLower = searchValue.toLowerCase();
        return (
          podcast.title?.toLowerCase().includes(searchLower) ||
          podcast.authorName?.toLowerCase().includes(searchLower) ||
          (podcast.description &&
            podcast.description.toLowerCase().includes(searchLower))
        );
      });
      setFilteredPodcasts(filtered);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams(page, itemsPerPage);

    // Scroll to top of podcast grid
    const podcastGrid = document.querySelector(".podcast-list__podcast-grid");
    if (podcastGrid) {
      podcastGrid.scrollIntoView({ behavior: "smooth" });
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

  // Clear search function
  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setFilteredPodcasts(podcasts);
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
            <div
              className="podcast-list__search-container"
              style={{ position: "relative" }}
            >
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
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "#666",
                    padding: "0",
                    lineHeight: "1",
                  }}
                  title="Clear search"
                >
                  ×
                </button>
              )}
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

          {/* Results summary */}
          {paginationData.totalItems > 0 && (
            <div
              style={{
                textAlign: "center",
                margin: "20px 0",
                color: "#666",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {searchTerm
                ? `Found ${paginationData.totalItems} podcast${
                    paginationData.totalItems !== 1 ? "s" : ""
                  } for "${searchTerm}"`
                : `${paginationData.totalItems} podcast${
                    paginationData.totalItems !== 1 ? "s" : ""
                  } available`}
              {categoryParam && ` in ${getPageTitle()}`}
            </div>
          )}

          {/* Podcast Grid */}
          <div className="podcast-list__grid-container">
            <div className="podcast-list__podcast-grid">
              {paginationData.currentItems.length > 0 ? (
                paginationData.currentItems.map((podcast, index) => (
                  <Link
                    to={`/podcast/detail/${podcast.id}`}
                    key={podcast.id}
                    className="podcast-list__podcast-card"
                  >
                    <div
                      className="podcast-list__podcast-image"
                      style={{
                        backgroundImage: `url(${getImageUrl(
                          podcast,
                          paginationData.startIndex + index
                        )})`,
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
                      <button
                        onClick={handleClearSearch}
                        style={{
                          marginTop: "10px",
                          padding: "8px 16px",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Clear Search
                      </button>
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

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={paginationData.totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={paginationData.totalItems}
          />
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
