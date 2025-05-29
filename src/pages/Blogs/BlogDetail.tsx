import React, { useEffect, useState } from "react";
import "../../assets/css/BlogDetail.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  getBlogById,
  getRelatedBlogs,
  Blog,
} from "../../services/blog.service";
import ctaLeaf from "../../assets/img/cta-leaf.png";
import blog1 from "../../assets/img/blog1.png";

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch blog data
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) {
        setError("Blog ID is required");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching blog with ID:", id);

        // Fetch main blog
        const blogData = await getBlogById(id);
        console.log("Blog data received:", blogData);

        if (!blogData) {
          setError("Blog not found");
          setBlog(null);
          return;
        }

        setBlog(blogData);

        // Fetch related blogs (same category)
        if (blogData.categoryId) {
          const related = await getRelatedBlogs(id, blogData.categoryId, 8);
          setRelatedBlogs(related || []);
        } else {
          setRelatedBlogs([]);
        }
      } catch (err) {
        console.error("Error fetching blog data:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load blog";
        setError(errorMessage);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  // Format date with error handling
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "Unknown date";

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown date";
    }
  };

  // Extract table of contents from blog content with better error handling
  const extractTableOfContents = (content: string): string[] => {
    if (!content || typeof content !== "string") {
      return ["Introduction", "Main Content", "Conclusion"];
    }

    try {
      const headingRegex = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/gi;
      const matches = [];
      let match;

      while ((match = headingRegex.exec(content)) !== null) {
        const headingText = match[1].replace(/<[^>]*>/g, "").trim();
        if (headingText) {
          matches.push(headingText);
        }
      }

      return matches.length > 0
        ? matches
        : ["Introduction", "Main Content", "Conclusion"];
    } catch (error) {
      console.error("Error extracting table of contents:", error);
      return ["Introduction", "Main Content", "Conclusion"];
    }
  };

  const handleAICoachingClick = () => {
    if (isAuthenticated) {
      navigate("/chat/map");
    } else {
      navigate("/login");
    }
  };

  // Handle image error with better fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    if (target.src !== blog1) {
      target.src = blog1; // Fallback image
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="blog-detail-page">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            fontSize: "18px",
          }}
        >
          <div>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              Loading blog...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !blog) {
    return (
      <div className="blog-detail-page">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            fontSize: "18px",
            color: "#dc3545",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <p>{error || "Blog not found"}</p>
          <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
            <Link
              to="/blogs"
              style={{
                color: "#007bff",
                textDecoration: "none",
                padding: "10px 20px",
                border: "1px solid #007bff",
                borderRadius: "5px",
                transition: "all 0.3s ease",
              }}
            >
              ← Back to Blogs
            </Link>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tableOfContents = extractTableOfContents(blog.content);

  return (
    <div className="blog-detail-page">
      <div>
        {/* Blog Header */}
        <section>
          <div className="bd-header-title">
            <div>
              <Link to="/blogs" className="bd-back-link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back To All Blogs
              </Link>
            </div>
          </div>

          <div>
            <h1 className="bd-blog-title section-heading">{blog.title}</h1>
          </div>

          {/* Blog Layout */}
          <div className="bd-layout">
            {/* Table of Contents */}
            <aside className="bd-contents">
              <h3>Contents</h3>
              <ol>
                {tableOfContents.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </aside>

            {/* Main Content */}
            <main className="bd-main-content">
              <div className="bd-post-date">{formatDate(blog.createdAt)}</div>

              <div className="bd-image-container">
                <img
                  src={blog.coverImage || blog1}
                  alt={blog.title}
                  className="bd-feature-image"
                  onError={handleImageError}
                />
              </div>

              <div className="bd-content">
                <div
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                  style={{
                    lineHeight: "1.8",
                    fontSize: "16px",
                    color: "#333",
                  }}
                />
              </div>

              {/* Author and Category Info */}
              <div
                style={{
                  marginTop: "40px",
                  padding: "20px 0",
                  borderTop: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <strong>Author:</strong> {blog.authorName || "Unknown Author"}
                </div>
                {blog.category && (
                  <div>
                    <strong>Category:</strong> {blog.category.name}
                  </div>
                )}
              </div>
            </main>

            {/* Related Reading */}
            <aside className="bd-related-reading">
              <h3>Related reading</h3>
              {relatedBlogs.length > 0 ? (
                relatedBlogs.slice(0, 3).map((relatedBlog) => (
                  <Link
                    key={relatedBlog.id}
                    to={`/blog/detail/${relatedBlog.id}`}
                    className="bd-related-post"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                      marginBottom: "20px",
                      padding: "10px",
                      border: "1px solid #eee",
                      borderRadius: "5px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <h4 style={{ marginBottom: "8px", fontSize: "14px" }}>
                      {relatedBlog.title}
                    </h4>
                    <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                      {relatedBlog.content
                        ? relatedBlog.content
                            .replace(/<[^>]*>/g, "")
                            .substring(0, 100) + "..."
                        : "No preview available"}
                    </p>
                  </Link>
                ))
              ) : (
                <p style={{ color: "#666", fontStyle: "italic" }}>
                  No related posts found.
                </p>
              )}
            </aside>
          </div>
        </section>

        {/* Related Blogs Section (Same Category) */}
        <section className="bd-blogs-section bd-section-margin-top">
          <div className="bd-blogs-intro-container">
            <h2 className="bd-section-heading">
              <img
                src={ctaLeaf}
                alt="Logo Icon"
                className="bd-icon-height-30"
              />
              More from {blog.category?.name || "this category"}
            </h2>
            <p className="bd-blogs-intro">
              Explore more articles from the same category to deepen your
              understanding.
            </p>
          </div>

          <div className="bd-blog-cards">
            {relatedBlogs.length > 0 ? (
              relatedBlogs.slice(0, 4).map((relatedBlog) => (
                <Link
                  to={`/blog/detail/${relatedBlog.id}`}
                  key={relatedBlog.id}
                  className="bd-blog-card"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="bd-blog-image"
                    style={{
                      backgroundImage: `url(${
                        relatedBlog.coverImage || blog1
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="bd-blog-content">
                    <div className="bd-blog-date">
                      {formatDate(relatedBlog.createdAt)}
                    </div>
                    <span>{relatedBlog.title}</span>
                    <p>
                      {relatedBlog.content
                        ? relatedBlog.content
                            .replace(/<[^>]*>/g, "")
                            .substring(0, 100) + "..."
                        : "No preview available"}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#666",
                  fontStyle: "italic",
                }}
              >
                No related blogs available at the moment.
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bd-newsletter-container">
          <div className="bd-newsletter">
            <h2>
              <img
                src={ctaLeaf}
                alt="Logo Icon"
                className="bd-icon-height-30"
              />
              Slogan Inner Embrace
            </h2>
            <p>
              Whether you're looking for 1-on-1 support, a reflective AI space,
              or clear guidance on a challenge – Inner Embrace offers a path
              that meets you where you are.
            </p>
            <button
              onClick={handleAICoachingClick}
              className="bd-newsletter-btn"
            >
              Try AI Coaching for Free
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetail;
