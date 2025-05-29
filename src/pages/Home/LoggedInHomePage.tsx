import React from "react";
import "../../assets/css/LoggedInHomePage.css";
import { Link, useNavigate } from "react-router-dom";
import ctaLeaf from "../../assets/img/cta-leaf.png";
import InnerMap from "../../assets/img/innermap.png";
import Imaginary from "../../assets/img/ImaginaryCoaching.png";
import Portal from "../../assets/img/PossibilityPortal.png";
import HeroImage from "../../assets/img/image-hero.png";

const LoggedInHomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleExploreNow = () => {
    navigate("/about");
  };

  const handleUpgradePlan = () => {
    // Add upgrade plan logic
    console.log("Upgrade plan clicked");
  };

  return (
    <div className="logged-in-homepage">
      {/* Hero Banner */}
      <section className="logged-in-homepage__hero-section">
        <div className="logged-in-homepage__hero-banner">
          <div className="logged-in-homepage__hero-content">
            <div className="logged-in-homepage__hero-text">
              <h1 className="logged-in-homepage__hero-title">
                <img src={ctaLeaf} alt="Logo Icon" />
                Unlock Your Potential with Inner Embrace
              </h1>
              <p>Ready? Get in touch with your inner world now...</p>
              <button
                className="logged-in-homepage__hero-button homepage-btn homepage-btn-primary"
                onClick={handleExploreNow}
              >
                Explore Now
              </button>
            </div>
            <div className="logged-in-homepage__hero-note">
              <div className="logged-in-homepage__note-card">
                <div className="logged-in-homepage__note-text">
                  Your Note: <br />
                  "Keep Going with Inner Embrace..."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="logged-in-homepage__courses-section">
        <div className="logged-in-homepage__section-header">
          <h2 className="logged-in-homepage__section-heading section-heading">
            <img src={ctaLeaf} alt="Logo Icon" />
            Featured Courses
          </h2>
          <a href="#" className="logged-in-homepage__explore-link">
            <span>Explore All Courses</span>→
          </a>
        </div>
        <div className="logged-in-homepage__courses-grid">
          <div className="logged-in-homepage__course-card">
            <div className="logged-in-homepage__course-image logged-in-homepage__course-image-1">
              <div className="logged-in-homepage__course-rating">
                <span className="logged-in-homepage__rating-text">4.9</span>
              </div>
            </div>
            <div className="logged-in-homepage__course-content">
              <p className="logged-in-homepage__course-students">
                100 students enrolled
              </p>
              <h3 className="logged-in-homepage__course-title">
                Cultivate Optimism: Create a Lasting Impact
              </h3>
              <div className="logged-in-homepage__course-footer">
                <span className="logged-in-homepage__course-instructor">
                  Alessandro Conti
                </span>
                <span className="logged-in-homepage__course-price">$49</span>
              </div>
            </div>
          </div>

          <div className="logged-in-homepage__course-card">
            <div className="logged-in-homepage__course-image logged-in-homepage__course-image-2">
              <div className="logged-in-homepage__course-rating">
                <span className="logged-in-homepage__rating-text">4.9</span>
              </div>
            </div>
            <div className="logged-in-homepage__course-content">
              <p className="logged-in-homepage__course-students">
                188 students enrolled
              </p>
              <h3 className="logged-in-homepage__course-title">
                Find Your Path: Align Your Goals with Purpose
              </h3>
              <div className="logged-in-homepage__course-footer">
                <span className="logged-in-homepage__course-instructor">
                  ZukiPasa
                </span>
                <span className="logged-in-homepage__course-price">$49</span>
              </div>
            </div>
          </div>

          <div className="logged-in-homepage__course-card">
            <div className="logged-in-homepage__course-image logged-in-homepage__course-image-3">
              <div className="logged-in-homepage__course-rating">
                <span className="logged-in-homepage__rating-text">5.0</span>
              </div>
            </div>
            <div className="logged-in-homepage__course-content">
              <p className="logged-in-homepage__course-students">
                173 students enrolled
              </p>
              <h3 className="logged-in-homepage__course-title">
                Self-Love: Build a Strong Foundation
              </h3>
              <div className="logged-in-homepage__course-footer">
                <span className="logged-in-homepage__course-instructor">
                  Alessandro Conti
                </span>
                <span className="logged-in-homepage__course-price">$49</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Section */}
      <section className="logged-in-homepage__ai-section">
        <div className="logged-in-homepage__ai-header">
          <h2 className="logged-in-homepage__section-heading section-heading">
            <img src={ctaLeaf} alt="Logo Icon" />
            Chat with AI
          </h2>
          <p className="logged-in-homepage__ai-description">
            Connect with Inner Embrace AI — your companion for personal growth
            and support.
          </p>
        </div>
        <div className="logged-in-homepage__ai-features">
          <div className="logged-in-homepage__ai-feature">
            <div className="logged-in-homepage__ai-icon logged-in-homepage__ai-circle-1">
              <img src={InnerMap} alt="" />
            </div>
            <h3 className="logged-in-homepage__ai-feature-title">Inner Map</h3>
            <p className="logged-in-homepage__ai-feature-description">
              2-minute guided reflection
            </p>
            <Link
              className="logged-in-homepage__ai-feature-button homepage-btn homepage-btn-primary"
              to="/chat/map"
            >
              Try Now
            </Link>
          </div>

          <div className="logged-in-homepage__ai-feature">
            <div className="logged-in-homepage__ai-icon logged-in-homepage__ai-circle-2">
              <img src={Imaginary} alt="" />
            </div>
            <h3 className="logged-in-homepage__ai-feature-title">
              Imaginary Coaching
            </h3>
            <p className="logged-in-homepage__ai-feature-description">
              5-minute coaching session
            </p>
            <Link
              className="logged-in-homepage__ai-feature-button homepage-btn homepage-btn-primary"
              to="/chat/imaginary"
            >
              Try Now
            </Link>
          </div>

          <div className="logged-in-homepage__ai-feature">
            <div className="logged-in-homepage__ai-icon logged-in-homepage__ai-circle-3">
              <img src={Portal} alt="" />
            </div>
            <h3 className="logged-in-homepage__ai-feature-title">
              Possibility Portal
            </h3>
            <p className="logged-in-homepage__ai-feature-description">
              3-minute inspiration session
            </p>
            <Link
              className="logged-in-homepage__ai-feature-button homepage-btn homepage-btn-primary"
              to="/chat/portal"
            >
              Try Now
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="logged-in-homepage__pricing-section">
        <div className="logged-in-homepage__pricing-header">
          <h2 className="logged-in-homepage__section-heading section-heading">
            <img src={ctaLeaf} alt="Logo Icon" />
            Upgrade Your AI Chat Plan
          </h2>
          <p className="logged-in-homepage__pricing-description">
            Unlock unlimited conversations with Inner Embrace AI. Save 18% with
            an annual plan.
          </p>
        </div>
        <div className="logged-in-homepage__pricing-grid">
          {/* Free Plan */}
          <div className="logged-in-homepage__pricing-card">
            <div className="logged-in-homepage__pricing-header-content">
              <h3 className="logged-in-homepage__plan-name">Free</h3>
              <div className="logged-in-homepage__plan-price">
                <span className="logged-in-homepage__price-amount">$0</span>
                <span className="logged-in-homepage__price-period">/month</span>
              </div>
            </div>
            <button className="logged-in-homepage__plan-button logged-in-homepage__plan-button-current">
              Current Plan
            </button>
            <ul className="logged-in-homepage__plan-features">
              <li className="logged-in-homepage__plan-feature">
                <span>5 conversations per day</span>
              </li>
              <li className="logged-in-homepage__plan-feature">
                <span>Basic AI coaching</span>
              </li>
            </ul>
          </div>

          {/* Monthly Plan */}
          <div className="logged-in-homepage__pricing-card logged-in-homepage__pricing-card-premium">
            <div className="logged-in-homepage__premium-badge">
              Most Popular
            </div>
            <div className="logged-in-homepage__pricing-header-content">
              <h3 className="logged-in-homepage__plan-name">Monthly</h3>
              <div className="logged-in-homepage__plan-price">
                <span className="logged-in-homepage__price-amount">$10</span>
                <span className="logged-in-homepage__price-period">/month</span>
              </div>
              <div className="logged-in-homepage__price-original">$15</div>
            </div>
            <button
              className="logged-in-homepage__plan-button logged-in-homepage__plan-button-upgrade homepage-btn homepage-btn-primary"
              onClick={handleUpgradePlan}
            >
              Upgrade Plan
            </button>
            <ul className="logged-in-homepage__plan-features">
              <li className="logged-in-homepage__plan-feature">
                <span>Unlimited conversations</span>
              </li>
              <li className="logged-in-homepage__plan-feature">
                <span>Advanced AI coaching</span>
              </li>
            </ul>
          </div>

          {/* Yearly Plan */}
          <div className="logged-in-homepage__pricing-card">
            <div className="logged-in-homepage__pricing-header-content">
              <h3 className="logged-in-homepage__plan-name">Yearly</h3>
              <div className="logged-in-homepage__plan-price">
                <span className="logged-in-homepage__price-amount">$8</span>
                <span className="logged-in-homepage__price-period">/month</span>
              </div>
            </div>
            <button
              className="logged-in-homepage__plan-button logged-in-homepage__plan-button-upgrade homepage-btn homepage-btn-primary"
              onClick={handleUpgradePlan}
            >
              Upgrade Plan
            </button>
            <ul className="logged-in-homepage__plan-features">
              <li className="logged-in-homepage__plan-feature">
                <span>Unlimited conversations</span>
              </li>
              <li className="logged-in-homepage__plan-feature">
                <span>Advanced AI coaching</span>
              </li>
              <li className="logged-in-homepage__plan-feature">
                <span>Exclusive content</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="logged-in-homepage__newsletter-container">
        <div className="logged-in-homepage__newsletter">
          <h2 className="logged-in-homepage__section-heading section-heading">
            <img src={ctaLeaf} alt="Logo Icon" />
            Slogan Inner Embrace
          </h2>
          <p className="logged-in-homepage__newsletter-description">
            Whether you're looking for 1-on-1 support, a reflective AI space, or
            clear guidance on a challenge – Inner Embrace offers a path that
            meets you where you are.
          </p>
          <button className="logged-in-homepage__newsletter-button homepage-btn homepage-btn-primary">
            Subscribe with Email
          </button>
        </div>
      </section>
    </div>
  );
};

export default LoggedInHomePage;
