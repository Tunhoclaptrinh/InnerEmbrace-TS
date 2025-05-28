import React, { useState } from "react";
import "../../assets/css/BlogsPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ctaLeaf from "../../assets/img/cta-leaf.png";
import heroImage from "../../assets/img/image1.jpg";
import blog1 from "../../assets/img/blog1.png";
import blog2 from "../../assets/img/blog2.png";
import blog3 from "../../assets/img/blog3.png";

interface BlogPost {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  image: string;
}

const BlogsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All Blogs");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const tabs = ["All Blogs", "01", "02", "03", "04", "05", "06", "07", "08"];

  const blogData: BlogPost[] = Array(12)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      date: "March 21, 2025",
      title:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or",
      excerpt:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or clear guidance on a challenge —",
      image: [blog1, blog2, blog3][index % 3],
    }));

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      setCurrentPage(page);
    }
  };

  const handleAICoachingClick = () => {
    if (isAuthenticated) {
      navigate("/chat/map");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="blogs-page">
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
          <section className="bp-hero">
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
            />
          </section>

          {/* Featured Blog Cards */}
          <div className="bp-featured-blog-cards">
            {[
              { img: blog1, id: 1 },
              { img: blog2, id: 2 },
              { img: blog3, id: 3 },
            ].map(({ img, id }) => (
              <Link
                to={`/blog/detail/${id}`}
                key={id}
                className="bp-featured-blog-card"
              >
                <div
                  className="bp-featured-blog-image"
                  style={{ backgroundImage: `url(${img})` }}
                />
                <div className="bp-featured-blog-content">
                  <div className="bp-featured-blog-date">March 21, 2025</div>
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

        {/* Blog Grid */}
        <div className="bp-blog-container">
          {/* ...existing code... */}

          <div className="bp-blog-grid">
            {blogData.map((blog, index) => (
              <Link
                to={`/blog/detail/${blog.id}`}
                key={index}
                className="bp-blog-card"
              >
                <img
                  src={blog.image}
                  alt="Blog thumbnail"
                  className="bp-blog-image"
                />
                <div className="bp-blog-card-content">
                  <p className="bp-blog-date">{blog.date}</p>
                  <h3 className="bp-blog-title">{blog.title}</h3>
                  <p className="bp-blog-excerpt">{blog.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
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
