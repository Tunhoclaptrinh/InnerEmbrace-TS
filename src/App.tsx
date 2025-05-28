import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import * as AuthService from "./services/auth.service";
import IUser from "./types/user.type";
import routes, { RouteConfig } from "./routes/routes";

import Header from "./components/Header";
import HeaderLoggedIn from "./components/Header/HeaderLoggedIn";
import Footer from "./components/Footer";
import EventBus from "./common/EventBus";
import { ChatProvider } from "./contexts/ChatContext";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState<string>("");
  const location = useLocation();

  console.log("🔍 DEBUG - Current user:", currentUser);
  console.log("🔍 DEBUG - Current path:", location.pathname);
  console.log("🔍 DEBUG - Is loading:", isLoading);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = AuthService.getCurrentUser();
        console.log("🔍 DEBUG - User from localStorage:", user);
        setCurrentUser(user || undefined);
      } catch (error) {
        console.error("🔍 DEBUG - Auth error:", error);
        setNetworkError("Không thể kết nối đến server. Vui lòng thử lại sau!");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
    EventBus.on("logout", logOut);
    return () => {
      EventBus.remove("logout", logOut);
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  const shouldShowHeader = () => {
    const authPages = ["/login", "/register"];
    const chatPages = ["/chat/map", "/chat/imaginary", "/chat/portal"];
    return (
      !authPages.includes(location.pathname) &&
      !chatPages.includes(location.pathname)
    );
  };

  const getContainerClassName = (pathname: string): string => {
    const publicPaths = [
      "/",
      "/home",
      "/about",
      "/podcasts",
      "/blogs",
      "/my-home",
    ];

    if (
      publicPaths.includes(pathname) ||
      pathname.startsWith("/podcast/") ||
      pathname.startsWith("/blog/") ||
      pathname.startsWith("/chat/")
    ) {
      return "";
    }

    return !shouldShowHeader() ? "" : "container mt-3";
  };

  // Component bảo vệ route private
  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    console.log("🔍 DEBUG - PrivateRoute check - currentUser:", currentUser);

    if (isLoading) {
      return <div>Loading...</div>; // Hoặc component loading của bạn
    }

    if (!currentUser) {
      console.log("🔍 DEBUG - PrivateRoute - Redirecting to /login");
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  };

  // Component bảo vệ route public (chỉ cho user chưa đăng nhập)
  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    console.log("🔍 DEBUG - PublicRoute check - currentUser:", currentUser);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    // Nếu đã đăng nhập và đang ở trang home, redirect về my-home
    if (
      currentUser &&
      (location.pathname === "/" || location.pathname === "/home")
    ) {
      console.log("🔍 DEBUG - PublicRoute - Redirecting to /my-home");
      return <Navigate to="/my-home" replace />;
    }

    return <>{children}</>;
  };

  const renderRouteElement = (route: RouteConfig) => {
    const Component = route.element;
    console.log(
      `🔍 DEBUG - Rendering route: ${route.path}, layout: ${route.layout}, requiresAuth: ${route.requiresAuth}`
    );

    // Xử lý homepage logic
    if (route.isHomePage) {
      return (
        <PublicRoute>
          <Component />
        </PublicRoute>
      );
    }

    // Xử lý routes yêu cầu authentication
    if (route.requiresAuth) {
      return (
        <PrivateRoute>
          <Component />
        </PrivateRoute>
      );
    }

    // Routes public khác
    return <Component />;
  };

  // Hiển thị loading khi đang check auth
  if (isLoading) {
    return <div>Loading...</div>; // Thay bằng component loading đẹp hơn
  }

  return (
    <ChatProvider>
      <div>
        {shouldShowHeader() && (currentUser ? <HeaderLoggedIn /> : <Header />)}

        <div className="content-wrapper">
          {networkError && (
            <div className="network-error-banner">
              <span>{networkError}</span>
              <button onClick={() => setNetworkError("")}>✕</button>
            </div>
          )}

          <div className={getContainerClassName(location.pathname)}>
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={renderRouteElement(route)}
                />
              ))}
              {/* Fallback routes */}
              <Route
                path="*"
                element={
                  currentUser ? (
                    <Navigate to="/my-home" replace />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            </Routes>
          </div>
        </div>

        {shouldShowHeader() && <Footer />}
      </div>
    </ChatProvider>
  );
};

export default App;
