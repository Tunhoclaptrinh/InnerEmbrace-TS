import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./assets/css/Header.css";
import logo from "./assets/img/Logo.png";

interface HeaderProps {
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = (): void => {
    navigate("/");
  };

  const isActiveRoute = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header>
      <div className="logo">
        <img
          src={logo}
          alt="Inner Embrace Logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        />
      </div>
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
      <div className="nav-buttons">
        <Link to="/login" className="btn btn-primary">
          Khám phá Inner Companion
        </Link>
      </div>
    </header>
  );
};

export default Header;
