import Home from "../pages/Home/Home";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import Profile from "../components/Profile";
import BoardUser from "../components/BoardUser";
import BoardModerator from "../components/BoardModerator";
import BoardAdmin from "../components/BoardAdmin";
import AboutPage from "../pages/About";
import PodcastsPage from "../pages/PodCasts";
import PodcastList from "../pages/PodCasts/PodcastList";
import PodcastDetail from "../pages/PodCasts/PodcastDetail";
import BlogsPage from "../pages/Blogs";
import BlogDetail from "../pages/Blogs/BlogDetail";
import LoggedInHomePage from "../pages/Home/LoggedInHomePage";

import { InnerMapPage } from "../pages/Chat/InnerMapPage";

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  requiresAuth?: boolean;
  layout?: string;
  roles?: string[];
  isHomePage?: boolean;
}

const routes: RouteConfig[] = [
  // Public routes (chỉ cho user chưa đăng nhập)
  {
    path: "/",
    element: Home,
    layout: "public",
    isHomePage: true,
  },
  {
    path: "/home",
    element: Home,
    layout: "public",
  },
  {
    path: "/login",
    element: Login,
    layout: "auth",
  },
  {
    path: "/register",
    element: Register,
    layout: "auth",
  },
  {
    path: "/about",
    element: AboutPage,
    layout: "public",
  },
  {
    path: "/podcasts",
    element: PodcastsPage,
    layout: "public",
  },
  {
    path: "/podcast/list/:category",
    element: PodcastList,
    layout: "public",
  },
  {
    path: "/podcast/detail/:id",
    element: PodcastDetail,
    layout: "public",
  },
  {
    path: "/blogs",
    element: BlogsPage,
    layout: "public",
  },
  {
    path: "/blog/detail/:id",
    element: BlogDetail,
    layout: "public",
  },

  // Private routes (chỉ cho user đã đăng nhập)
  {
    path: "/my-home",
    element: LoggedInHomePage,
    requiresAuth: true,
    layout: "private",
  },
  {
    path: "/profile",
    element: Profile,
    requiresAuth: true,
    layout: "private",
  },
  {
    path: "/user",
    element: BoardUser,
    requiresAuth: true,
    roles: ["ROLE_USER"],
    layout: "private",
  },
  {
    path: "/mod",
    element: BoardModerator,
    requiresAuth: true,
    roles: ["ROLE_MODERATOR"],
    layout: "private",
  },
  {
    path: "/admin",
    element: BoardAdmin,
    requiresAuth: true,
    roles: ["ROLE_ADMIN"],
    layout: "private",
  },

  // Chat routes (yêu cầu đăng nhập)
  {
    path: "/chat/map",
    element: InnerMapPage,
    requiresAuth: true,
    layout: "chat",
  },
  // Uncomment khi ready
  // {
  //   path: "/chat/imaginary",
  //   element: ImaginaryPage,
  //   requiresAuth: true,
  //   layout: "chat",
  // },
  // {
  //   path: "/chat/portal",
  //   element: PortalPage,
  //   requiresAuth: true,
  //   layout: "chat",
  // },
];

export default routes;
