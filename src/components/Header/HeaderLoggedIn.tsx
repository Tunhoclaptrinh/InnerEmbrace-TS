import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./assets/css/HeaderLoggedIn.css";
import logo from "./assets/img/Logo.png";
import cartIcon from "./assets/icon/cart.png";
import avatarIcon from "./assets/icon/default-avatar.jpg";
import * as AuthService from "../../services/auth.service";
import EventBus from "../../common/EventBus";

const HeaderLoggedIn: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const isActiveRoute = (path: string): boolean => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    // AuthService.logout();

    setIsDropdownOpen(false);
    navigate("/");
    EventBus.dispatch("logout", null);
  };

  return (
    <header className="logged-in">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Inner Embrace Logo" />
        </Link>
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
              Khám phá khóa học
            </Link>
          </li>
          <li>
            <Link
              to="/my-courses"
              className={isActiveRoute("/my-courses") ? "nav--active" : ""}
            >
              Khóa học của tôi
            </Link>
          </li>
          <li>
            <Link
              to="/podcasts"
              className={isActiveRoute("/podcast") ? "nav--active" : ""}
            >
              Nâng cấp gói AI Chat
            </Link>
          </li>
        </ul>
      </nav>

      <div className="nav-buttons">
        <Link to="/chat/map" className="btn btn-primary">
          Chat với AI
        </Link>
        <div className="user-buttons">
          <Link to="/cart" className="icon-wrapper">
            <img src={cartIcon} alt="Cart" className="header-icon" />
          </Link>
          <div
            className="icon-wrapper user-dropdown"
            onClick={toggleDropdown}
            ref={dropdownRef}
          >
            <img
              src={avatarIcon}
              alt="User Avatar"
              className="header-icon avatar"
              onClick={handleLogout}
            />
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <i className="fas fa-user"></i>
                  Trang cá nhân
                </Link>
                <Link to="/settings" className="dropdown-item">
                  <i className="fas fa-cog"></i>
                  Cài đặt
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  <i className="fas fa-sign-out-alt"></i>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderLoggedIn;
