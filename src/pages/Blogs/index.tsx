import React, { useState, useEffect } from "react";
import "../../assets/css/BlogsPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ctaLeaf from "../../assets/img/cta-leaf.png";
import heroImage from "../../assets/img/image1.jpg";
import blog1 from "../../assets/img/blog1.png";
import blog2 from "../../assets/img/blog2.png";
import blog3 from "../../assets/img/blog3.png";
import {
  getBlogs,
  getCategories,
  Blog,
  Category,
  BlogListResponse,
} from "../../services/blog.service";

const BlogsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All Blogs");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [blogResponse, setBlogResponse] = useState<BlogListResponse>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const BLOGS_PER_PAGE = 12;

  // Fetch categories and initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch categories for blog
        const categoriesData = await getCategories("BLOG");
        setCategories(categoriesData);

        // Fetch featured blogs (first 3 blogs for hero section)
        const featuredResponse = await getBlogs({ limit: 3, page: 1 });
        setFeaturedBlogs(featuredResponse.data);

        // Fetch all blogs for main content
        const blogsResponse = await getBlogs({
          page: 1,
          limit: BLOGS_PER_PAGE,
        });
        setBlogResponse(blogsResponse);
        setBlogs(blogsResponse.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch blogs when filters change
  const fetchBlogs = async (params: {
    categoryId?: string;
    page?: number;
    search?: string;
  }) => {
    setLoading(true);
    try {
      const response = await getBlogs({
        categoryId: params.categoryId,
        page: params.page || 1,
        limit: BLOGS_PER_PAGE,
        search: params.search,
      });
      setBlogResponse(response);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogResponse({
        data: [],
        total: 0,
        page: params.page || 1,
        totalPages: 0,
      });
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab click
  const handleTabClick = (tab: string, categoryId?: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");

    if (tab === "All Blogs") {
      fetchBlogs({ page: 1 });
    } else {
      fetchBlogs({ categoryId, page: 1 });
    }
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);

    const currentCategoryId =
      activeTab !== "All Blogs"
        ? categories.find((cat) => cat.name === activeTab)?.id
        : undefined;

    fetchBlogs({
      categoryId: currentCategoryId,
      page: 1,
      search: value,
    });
  };

  // Handle page change
  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      setCurrentPage(page);

      const currentCategoryId =
        activeTab !== "All Blogs"
          ? categories.find((cat) => cat.name === activeTab)?.id
          : undefined;

      fetchBlogs({
        categoryId: currentCategoryId,
        page,
        search: searchTerm,
      });

      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAICoachingClick = () => {
    if (isAuthenticated) {
      navigate("/chat/map");
    } else {
      navigate("/login");
    }
  };

  const handleBlogClick = (blogId: string) => {
    navigate(`/blog/detail/${blogId}`);
  };

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const pages = [];
    const totalPages = blogResponse.totalPages;

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      // Show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Create tabs array with categories
  const tabs = [
    "All Blogs",
    ...categories.slice(0, 7).map((cat) => cat.name), // Limit to 7 categories + "All Blogs"
  ];

  return (
    <div className="blogs-page">
      {/* Header with blogs as current page */}
      <Header currentPage="blogs" />

      {/* Main Content */}
      <main className="bp-main-content">
        {/* Blogs Section */}
        <section className="bp-blogs-section">
          {/* Intro */}
          <div className="bp-blogs-intro-container">
            <h2 className="bp-section-heading">
              <img src={ctaLeaf} alt="Logo Icon" />
              Latest on Our Blogs
            </h2>
            <p className="bp-blogs-intro">
              Whether you're looking for 1-on-1 support, a reflective AI space,
              or clear guidance on a challenge – Inner Embrace offers a path
              that meets you where you are.
            </p>
          </div>

          {/* Hero Section */}
          {/* <section className="bp-hero">
            <div className="bp-hero-content-container">
              <div className="bp-hero-content">
                <h1>We don't just connect devices — we connect lives.</h1>
                <p>Ready? Get in touch with your inner world now...</p>
              </div>
            </div>
            <div className="bp-hero-gradient-overlay"></div>
            <div
              className="bp-hero-image"
              style={{ backgroundImage: `url(${heroImage})` }}
            ></div>
          </section> */}

          {/* Featured Blog Cards */}
          <div className="bp-featured-blog-cards">
            {featuredBlogs.length > 0
              ? featuredBlogs.map((blog, index) => (
                  <div
                    key={blog.id}
                    className="bp-featured-blog-card"
                    onClick={() => handleBlogClick(blog.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="bp-featured-blog-image"
                      style={{
                        backgroundImage: `url(${
                          blog.coverImage ||
                          [blog1, blog2, blog3][index] ||
                          blog1
                        })`,
                      }}
                    />
                    <div className="bp-featured-blog-content">
                      <div className="bp-featured-blog-date">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <span>{blog.title}</span>
                      <p>
                        {blog.content
                          ? blog.content
                              .replace(/<[^>]*>/g, "")
                              .substring(0, 100) + "..."
                          : "No preview available"}
                      </p>
                    </div>
                  </div>
                ))
              : // Fallback to default cards while loading
                [
                  { img: blog1, id: "1" },
                  { img: blog2, id: "2" },
                  { img: blog3, id: "3" },
                ].map(({ img, id }) => (
                  <div
                    key={id}
                    className="bp-featured-blog-card"
                    style={{ cursor: "pointer", opacity: 0.7 }}
                  >
                    <div
                      className="bp-featured-blog-image"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                    <div className="bp-featured-blog-content">
                      <div className="bp-featured-blog-date">Loading...</div>
                      <span>Loading blog content...</span>
                      <p>Please wait while we load the latest blogs...</p>
                    </div>
                  </div>
                ))}
          </div>
        </section>

        {/* Blog Container */}
        <div className="bp-blog-container">
          {/* Blog Header */}
          <div className="bp-blog-header">
            <img
              src={ctaLeaf}
              alt="Logo Icon"
              style={{
                display: "block",
                width: "23px",
                height: "fit-content",
                marginRight: "10px",
                position: "absolute",
                left: "0",
                transform: "translateX(-30px)",
              }}
            />
            <h2 className="bp-section-heading">Blogs của Inner Embrace</h2>
          </div>

          <p className="bp-blog-description">
            Blogs của Inner Embrace — nơi bạn được dừng lại, để thấy rõ hơn điều
            đang thì thầm bên trong mình.
          </p>

          {/* Tabs and Search */}
          <div className="bp-tabs-and-search">
            <div className="bp-filter-tabs">
              {tabs.map((tab) => {
                const category = categories.find((cat) => cat.name === tab);
                return (
                  <div
                    key={tab}
                    onClick={() => handleTabClick(tab, category?.id)}
                    className={`bp-tab ${activeTab === tab ? "active" : ""}`}
                  >
                    {tab}
                  </div>
                );
              })}
            </div>

            <div className="bp-search-container">
              <span className="bp-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                fontSize: "18px",
                color: "#666",
              }}
            >
              Loading blogs...
            </div>
          )}

          {/* Blog Grid */}
          {!loading && (
            <>
              <div className="bp-blog-grid">
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="bp-blog-card"
                      onClick={() => handleBlogClick(blog.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={blog.coverImage || blog1}
                        alt="Blog thumbnail"
                        className="bp-blog-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = blog1;
                        }}
                      />
                      <div className="bp-blog-card-content">
                        <p className="bp-blog-date">
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <h3 className="bp-blog-title">{blog.title}</h3>
                        <p className="bp-blog-excerpt">
                          {blog.content
                            ? blog.content
                                .replace(/<[^>]*>/g, "")
                                .substring(0, 100) + "..."
                            : "No preview available"}
                        </p>
                        {blog.category && (
                          <div
                            style={{
                              marginTop: "8px",
                              fontSize: "12px",
                              color: "#666",
                              fontWeight: "500",
                            }}
                          >
                            Category: {blog.category.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      padding: "40px",
                      color: "#666",
                      fontSize: "16px",
                    }}
                  >
                    {searchTerm
                      ? `No blogs found for "${searchTerm}"`
                      : "No blogs available in this category"}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {blogResponse.totalPages > 1 && (
                <div className="bp-pagination">
                  {/* Previous button */}
                  {currentPage > 1 && (
                    <div
                      className="bp-page-item prev"
                      onClick={() => handlePageClick(currentPage - 1)}
                    >
                      ‹
                    </div>
                  )}

                  {/* Page numbers */}
                  {generatePaginationNumbers().map((page, index) => (
                    <div
                      key={index}
                      onClick={() => handlePageClick(page)}
                      className={`bp-page-item ${
                        currentPage === page ? "active" : ""
                      } ${page === "..." ? "ellipsis" : ""}`}
                      style={{
                        cursor: page === "..." ? "default" : "pointer",
                      }}
                    >
                      {page}
                    </div>
                  ))}

                  {/* Next button */}
                  {currentPage < blogResponse.totalPages && (
                    <div
                      className="bp-page-item next"
                      onClick={() => handlePageClick(currentPage + 1)}
                    >
                      ›
                    </div>
                  )}
                </div>
              )}

              {/* Results info */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#666",
                  fontSize: "14px",
                }}
              >
                Showing {blogs.length} of {blogResponse.total} blogs
                {activeTab !== "All Blogs" && ` in ${activeTab}`}
                {searchTerm && ` for "${searchTerm}"`}
              </div>
            </>
          )}
        </div>

        {/* Newsletter Section */}
        <section className="bp-newsletter-container">
          <div className="bp-newsletter-blog">
            <h2 className="bp-section-heading">
              <img src={ctaLeaf} alt="Logo Icon" />
              Slogan Inner Embrace
            </h2>
            <p>
              Whether you're looking for 1-on-1 support, a reflective AI space,
              or clear guidance on a challenge – Inner Embrace offers a path
              that meets you where you are.
            </p>
            <button
              onClick={handleAICoachingClick}
              className="bp-newsletter-btn"
            >
              Try AI Coaching for Free
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogsPage;
