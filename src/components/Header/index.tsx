import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./assets/css/Header.css";
import logo from "./assets/img/Logo.png";

interface HeaderProps {
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoClick = (): void => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (): void => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header>
        <div className="logo">
          <img
            src={logo}
            alt="Inner Embrace Logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
        </div>

        {/* Desktop Navigation */}
        <nav>
          <ul>
            <li>
              <Link to="/" className={isActiveRoute("/") ? "nav--active" : ""}>
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={isActiveRoute("/about") ? "nav--active" : ""}
              >
                Inner Embrace
              </Link>
            </li>
            <li>
              <Link
                to="/podcasts"
                className={isActiveRoute("/podcast") ? "nav--active" : ""}
              >
                Podcasts
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className={isActiveRoute("/blogs") ? "nav--active" : ""}
              >
                Blogs
              </Link>
            </li>
          </ul>
        </nav>

        {/* Desktop Buttons */}
        <div className="nav-buttons">
          <Link to="/login" className="btn btn-primary">
            Khám phá Inner Companion
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div
          className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`mobile-nav-overlay ${isMobileMenuOpen ? "active" : ""}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav ${isMobileMenuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <Link
              to="/"
              className={isActiveRoute("/") ? "nav--active" : ""}
              onClick={handleNavClick}
            >
              Trang chủ
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={isActiveRoute("/about") ? "nav--active" : ""}
              onClick={handleNavClick}
            >
              Inner Embrace
            </Link>
          </li>
          <li>
            <Link
              to="/podcasts"
              className={isActiveRoute("/podcast") ? "nav--active" : ""}
              onClick={handleNavClick}
            >
              Podcasts
            </Link>
          </li>
          <li>
            <Link
              to="/blogs"
              className={isActiveRoute("/blogs") ? "nav--active" : ""}
              onClick={handleNavClick}
            >
              Blogs
            </Link>
          </li>
        </ul>

        <div className="nav-buttons">
          <Link
            to="/login"
            className="btn btn-primary"
            onClick={handleNavClick}
          >
            Khám phá Inner Companion
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
