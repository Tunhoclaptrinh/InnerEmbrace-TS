import React from "react";
import "../../assets/css/BlogDetail.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ctaLeaf from "../../assets/img/cta-leaf.png";
import blog1 from "../../assets/img/blog1.png";
import blog2 from "../../assets/img/blog2.png";
import blog3 from "../../assets/img/blog3.png";

interface BlogContent {
  type: string;
  content: string;
}

interface BlogData {
  title: string;
  date: string;
  content: BlogContent[];
  tableOfContents: string[];
  relatedPosts: {
    title: string;
    excerpt: string;
  }[];
}

interface LatestBlog {
  id: number;
  image: string;
  date: string;
  title: string;
  excerpt: string;
}

interface Podcast {
  id: number;
  image: string;
  date: string;
  title: string;
  excerpt: string;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Sample blog data
  const blogData: BlogData = {
    title: "Introducing modules: reusable workflows for your entire team",
    date: "March 21, 2025",
    content: [
      {
        type: "text",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      },
    ],
    tableOfContents: [
      "Lorem ipsum dolor",
      "Lorem ipsum dolor sit",
      "Lorem ipsum dolor sit amet",
    ],
    relatedPosts: [
      {
        title: "Lorem ipsum dolor sit amet, consectetur adipi.",
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      },
      {
        title: "Lorem ipsum dolor sit amet, consectetur adipi.",
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      },
      {
        title: "Lorem ipsum dolor sit amet, consectetur adipi.",
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      },
    ],
  };

  const latestBlogs: LatestBlog[] = [
    {
      id: 1,
      image: blog1,
      date: "March 21, 2025",
      title:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or",
      excerpt:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or clear guidance on a challenge...",
    },
    {
      id: 2,
      image: blog1,
      date: "March 21, 2025",
      title:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or",
      excerpt:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or clear guidance on a challenge...",
    },
    {
      id: 3,
      image: blog1,
      date: "March 21, 2025",
      title:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or",
      excerpt:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or clear guidance on a challenge...",
    },
    {
      id: 4,
      image: blog1,
      date: "March 21, 2025",
      title:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or",
      excerpt:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or clear guidance on a challenge...",
    },
  ];

  const podcasts: Podcast[] = [
    {
      id: 1,
      image: blog2,
      date: "March 21, 2025",
      title:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or",
      excerpt:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or clear guidance on a challenge —",
    },
    {
      id: 1,
      image: blog2,
      date: "March 21, 2025",
      title:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or",
      excerpt:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or clear guidance on a challenge —",
    },
    {
      id: 2,
      image: blog2,
      date: "March 21, 2025",
      title:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or",
      excerpt:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or clear guidance on a challenge —",
    },
    {
      id: 3,
      image: blog2,
      date: "March 21, 2025",
      title:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or",
      excerpt:
        "Whether you're looking for 1-on-1 support, a reflective AI space, or clear guidance on a challenge —",
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
    <div className="blog-detail-page">
      <div>
        {/* Blog Header */}
        <section>
          <div className="bd-header-title">
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
            <h1 className="bd-blog-title">{blogData.title}</h1>
          </div>

          {/* Blog Layout */}
          <div className="bd-layout">
            {/* Table of Contents */}
            <aside className="bd-contents">
              <h3>Contents</h3>
              <ol>
                {blogData.tableOfContents.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </aside>

            {/* Main Content */}
            <main className="bd-main-content">
              <div className="bd-post-date">{blogData.date}</div>

              <div className="bd-image-container">
                <img
                  src={blog1}
                  alt="Blog featured"
                  className="bd-feature-image"
                />
              </div>

              <div className="bd-content">
                {blogData.content.map((section, index) => (
                  <div key={index}>
                    <h2>Lorem ipsum dolor</h2>
                    <p>{section.content}</p>
                  </div>
                ))}
              </div>
            </main>

            {/* Related Reading */}
            <aside className="bd-related-reading">
              <h3>Related reading</h3>
              {blogData.relatedPosts.map((post, index) => (
                <div key={index} className="bd-related-post">
                  <h4>{post.title}</h4>
                  <p>{post.excerpt}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>

        {/* Latest Blogs Section */}
        <section className="bd-blogs-section bd-section-margin-top">
          <div className="bd-blogs-intro-container">
            <h2 className="bd-section-heading">
              <img
                src={ctaLeaf}
                alt="Logo Icon"
                className="bd-icon-height-30"
              />
              Latest on Our Blogs
            </h2>
            <p className="bd-blogs-intro">
              Whether you're looking for 1-on-1 support, a reflective AI space,
              or clear guidance on a challenge – Inner Embrace offers a path
              that meets you where you are.
            </p>
          </div>

          <div className="bd-blog-cards">
            {latestBlogs.map((blog) => (
              <Link
                to={`/blog/detail/${blog.id}`}
                key={blog.id}
                className="bd-blog-card"
              >
                <div
                  className="bd-blog-image"
                  style={{ backgroundImage: `url(${blog.image})` }}
                />
                <div className="bd-blog-content">
                  <div className="bd-blog-date">{blog.date}</div>
                  <span>{blog.title}</span>
                  <p>{blog.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Podcasts Section */}
        <div className="bd-podcasts-container">
          <div className="bd-podcasts-header">
            <div>
              <h2 className="bd-section-heading bd-podcasts-title">
                <img
                  src={ctaLeaf}
                  alt="Logo Icon"
                  className="bd-podcasts-icon"
                />
                Another Podcasts
              </h2>
            </div>
            <Link to="/podcasts" className="bd-browse-all-link">
              <span className="bd-browse-all-text">
                Browse All Trending Podcasts
              </span>
              <span className="bd-browse-all-arrow">→</span>
            </Link>
          </div>

          <div className="bd-blog-cards">
            {podcasts.map((podcast) => (
              <Link
                to={`/podcast/detail/${podcast.id}`}
                key={podcast.id}
                className="bd-blog-card"
              >
                <img
                  src={podcast.image}
                  alt="Podcast thumbnail"
                  className="bd-blog-image"
                  style={{ width: "100%", height: "279px", objectFit: "cover" }}
                />
                <div className="bd-podcast-content">
                  <p className="bd-podcast-date">{podcast.date}</p>
                  <h3 className="bd-podcast-title">{podcast.title}</h3>
                  <p className="bd-podcast-excerpt">{podcast.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

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
