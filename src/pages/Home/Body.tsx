import React, { useState, useEffect } from "react";
import "../../assets/css/Home.css";
import logoStoryImage from "../../assets/img/logo-story.png";
import ctaLeafImage from "../../assets/img/cta-leaf.png";
import pointerIcon from "../../assets/icon/pointer.png";
import pod1Image from "../../assets/img/pod1.png";
import pod2Image from "../../assets/img/pod2.png";
import pod3Image from "../../assets/img/pod3.png";
import pod4Image from "../../assets/img/pod4.png";
import blog1Image from "../../assets/img/blog1.png";
import blog2Image from "../../assets/img/blog2.png";
import blog3Image from "../../assets/img/blog3.png";
import HeroImage from "../../assets/img/image-hero.png";
import laptopImage from "../../assets/img/laptop-phone.png";
import bookImage from "../../assets/img/book-illustration.png";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  checkSubscriptionStatus,
} from "../../services/newsletter.service";
import { getCurrentUser } from "../../services/auth.service";
import {
  getAllPodcasts,
  getAllCategories,
  getPodcastsByCategory,
  Podcast,
  PodcastCategory,
} from "../../services/podcast.service";
import {
  getBlogs,
  getCategories,
  Blog,
  Category,
} from "../../services/blog.service";

const BodyHomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Newsletter subscription states
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Data states
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [podcastCategories, setPodcastCategories] = useState<PodcastCategory[]>(
    []
  );
  const [blogCategories, setBlogCategories] = useState<Category[]>([]);
  const [pausefulnessCategory, setPausefulnessCategory] =
    useState<PodcastCategory | null>(null);
  const [innerWhispersCategory, setInnerWhispersCategory] =
    useState<Category | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const user = getCurrentUser();
      setCurrentUser(user);
      if (user?.email) {
        setEmail(user.email);
        checkUserSubscription(user.email);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadHomePageData();
  }, []);

  const loadHomePageData = async () => {
    setIsLoadingData(true);
    try {
      // Load categories first
      const [podcastCategoriesResult, blogCategoriesResult] = await Promise.all(
        [getAllCategories(), getCategories("BLOG")]
      );

      setPodcastCategories(podcastCategoriesResult.data);
      setBlogCategories(blogCategoriesResult);

      // Find Pausefulness category for podcasts
      const pausefulnessCat = podcastCategoriesResult.data.find(
        (cat) =>
          cat.name.toLowerCase().includes("pausefulness") ||
          cat.slug?.toLowerCase().includes("pausefulness")
      );
      setPausefulnessCategory(pausefulnessCat || null);

      // Find Inner Whispers category for blogs
      const innerWhispersCat = blogCategoriesResult.find(
        (cat) =>
          cat.name.toLowerCase().includes("inner whispers") ||
          cat.slug?.toLowerCase().includes("inner-whispers")
      );
      setInnerWhispersCategory(innerWhispersCat || null);

      // Load podcasts
      let podcastsToShow: Podcast[] = [];
      if (pausefulnessCat) {
        const podcastsByCategory = await getPodcastsByCategory(
          pausefulnessCat.id
        );
        podcastsToShow = podcastsByCategory.data.slice(0, 3); // Limit to 3 podcasts
      } else {
        // Fallback: get all podcasts and take first 3
        const allPodcasts = await getAllPodcasts();
        podcastsToShow = allPodcasts.data.slice(0, 3);
      }
      setPodcasts(podcastsToShow);

      // Load blogs
      let blogsToShow: Blog[] = [];
      if (innerWhispersCat) {
        const blogsByCategory = await getBlogs({
          categoryId: innerWhispersCat.id,
          limit: 3,
        });
        blogsToShow = blogsByCategory.data;
      } else {
        // Fallback: get random blogs
        const allBlogs = await getBlogs({ limit: 3 });
        blogsToShow = allBlogs.data;
      }
      setBlogs(blogsToShow);
    } catch (error) {
      console.error("Error loading home page data:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const checkUserSubscription = async (userEmail: string) => {
    try {
      // Tạo userId từ email hoặc lấy từ user data
      const userId = currentUser?.userId || generateUserIdFromEmail(userEmail);
      const subscriptions = await checkSubscriptionStatus(userId);
      setIsSubscribed(subscriptions && subscriptions.length > 0);
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const generateUserIdFromEmail = (email: string): string => {
    // Tạo userId đơn giản từ email hoặc sử dụng một logic khác
    // Trong thực tế, bạn nên có userId từ authentication
    return btoa(email)
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 16);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setSubscriptionMessage("Vui lòng nhập địa chỉ email");
      return;
    }

    setIsSubscribing(true);
    setSubscriptionMessage("");

    try {
      let userId: string;

      if (isAuthenticated && currentUser) {
        userId =
          currentUser.userId || generateUserIdFromEmail(currentUser.email);
      } else {
        userId = generateUserIdFromEmail(email);
      }

      if (isSubscribed) {
        // Hủy đăng ký
        await unsubscribeNewsletter(userId);
        setIsSubscribed(false);
        setSubscriptionMessage("Đã hủy đăng ký thành công!");
      } else {
        // Đăng ký
        await subscribeNewsletter(userId, email);
        setIsSubscribed(true);
        setSubscriptionMessage(
          "Đăng ký thành công! Cảm ơn bạn đã đăng ký nhận thông báo."
        );
      }
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      if (error.response?.status === 409) {
        setSubscriptionMessage("Email này đã được đăng ký trước đó.");
        setIsSubscribed(true);
      } else {
        setSubscriptionMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleAICoachingClick = () => {
    if (isAuthenticated) {
      navigate("/chat/map");
    } else {
      navigate("/login");
    }
  };

  const handleExploreClick = () => {
    if (isAuthenticated) {
      navigate("/about");
    } else {
      navigate("/login");
    }
  };

  const handlePlayPodcast = (e: React.MouseEvent, podcastId: string) => {
    e.preventDefault();
    navigate(`/podcast/detail/${podcastId}`);
    // if (isAuthenticated) {
    //   navigate(`/podcast/detail/${podcastId}`);
    // } else {
    //   navigate("/login");
    // }
  };

  const handleBlogClick = (e: React.MouseEvent, blogId: string) => {
    e.preventDefault();
    navigate(`/blog/detail/${blogId}`);

    // if (isAuthenticated) {
    //   navigate(`/blog/detail/${blogId}`);

    // } else {
    //   navigate("/login");
    // }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const getDefaultPodcastImage = (index: number) => {
    const images = [pod1Image, pod2Image, pod3Image, pod4Image];
    return images[index % images.length];
  };

  const getDefaultBlogImage = (index: number) => {
    const images = [blog1Image, blog2Image, blog3Image];
    return images[index % images.length];
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero">
        <img className="hero-content-container" src={HeroImage}></img>
      </section>

      {/* Inner Companion Section */}
      <section className="inner-companion">
        <div className="inner-companion__left">
          <h2 className="seciton-heading">Inner Companion</h2>
          <div className="companion-content">
            <p>
              Một người bạn nội tâm. Một tấm gương. Một lời mời quay về với điều
              thật sự sống trong bạn
            </p>
          </div>
          <Link to="/login" className="btn btn-primary">
            Khám phá Inner Companion
          </Link>
        </div>
        <div className="inner-companion__right">
          <img
            src={laptopImage}
            alt="Laptop and Phone"
            className="companion-image"
          />
        </div>
      </section>

      <section>
        {/* Story Section */}
        <div className="story">
          <h2>
            <span className="logo-story-text section-heading">
              Câu chuyện của
            </span>
            <img className="logo-story" src={logoStoryImage} alt="Logo Icon" />
          </h2>
          <div className="story__paragraph">
            <p>
              Inner Embrace sinh ra cho những người không còn muốn sống theo lộ
              trình có sẵn. Họ không cần ai chỉ đường. <br /> Họ chỉ đang chờ
              một không gian đủ yên để có thể lắng nghe sự sống động trong chính
              con người mình — và rồi hành động từ đó. <br /> Chúng mình không
              dạy bạn thế nào là sống là chính mình. Chúng mình ở đây để giữ cho
              bạn một khoảng trống — nơi cái đẹp độc bản trong bạn có thể bung
              nở tự nhiên.
            </p>
          </div>
          <Link to="/about" className="btn btn-outline">
            Đọc thêm →
          </Link>
        </div>
      </section>

      {/* Inner Essentials Section */}
      <section className="inner-essentials">
        <div className="inner-essentials__left">
          <h2 className="seciton-heading">Inner Essentials</h2>
          <div className="essentials-content">
            <p>
              Những công cụ và tài nguyên tinh gọn — để bạn quay về gần hơn với
              phiên bản thật của mình.
            </p>
            <p>
              Từ thẻ phản chiếu, workbook, đến các bài thực hành sâu — tất cả
              được tạo ra để đồng hành với bạn, theo cách phù hợp nhất với nhịp
              sống và con đường riêng của bạn.
            </p>

            <Link to="/login" className="btn btn-primary">
              Khám phá Inner Essentials
            </Link>
          </div>
        </div>
        <div className="inner-essentials__right">
          <img src={bookImage} alt="Book" className="essentials-image" />
        </div>
      </section>

      {/* Pausefulness Section - Dynamic Podcasts */}
      <section className="podcasts">
        <h2 className="section-heading">Pausefulness</h2>

        <div className="podcasts-intro-container">
          <p className="podcasts-intro p-content">
            Podcast của Inner Embrace — nơi bạn được dừng lại, để thấy rõ hơn
            điều đang thì thầm bên trong mình.
          </p>
        </div>

        {isLoadingData ? (
          <div
            className="loading-container"
            style={{ textAlign: "center", padding: "2rem" }}
          >
            <p>Đang tải podcasts...</p>
          </div>
        ) : (
          <div className="podcast-cards">
            {podcasts.length > 0 ? (
              podcasts.map((podcast, index) => (
                <div key={podcast.id} className="podcast-card">
                  <div
                    className="podcast-image"
                    onClick={(e) => handlePlayPodcast(e, podcast.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={podcast.coverImage || getDefaultPodcastImage(index)}
                      alt={podcast.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div className="play-button"></div>
                  </div>
                  <div className="podcast-content">
                    <h3>{podcast.title}</h3>
                    <div className="audio-waveform">
                      <div
                        className="play-button-small"
                        onClick={(e) => handlePlayPodcast(e, podcast.id)}
                        style={{ cursor: "pointer" }}
                      >
                        ▶
                      </div>
                      <div className="waveform-bars">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="waveform-bar"></div>
                        ))}
                      </div>
                    </div>
                    <p>
                      {podcast.description ||
                        "Khám phá nội dung thú vị trong podcast này."}
                    </p>
                    <div className="podcast-author">
                      <small>Bởi: {podcast.authorName}</small>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to original static content if no podcasts found
              <>
                <div className="podcast-card">
                  <div className="podcast-image">
                    <div className="play-button"></div>
                  </div>
                  <div className="podcast-content">
                    <h3>#01: Lắng nghe tiếng nói bên trong</h3>
                    <div className="audio-waveform">
                      <div className="play-button-small">▶</div>
                      <div className="waveform-bars">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="waveform-bar"></div>
                        ))}
                      </div>
                    </div>
                    <p>
                      Khởi đầu hành trình kết nối với chính mình: làm sao để
                      nhận ra và tin vào tiếng nói nội tâm?
                    </p>
                  </div>
                </div>

                <div className="podcast-card">
                  <div className="podcast-image">
                    <div className="play-button"></div>
                  </div>
                  <div className="podcast-content">
                    <h3>#02: Khi bạn cảm thấy lạc lối</h3>
                    <div className="audio-waveform">
                      <div className="play-button-small">▶</div>
                      <div className="waveform-bars">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="waveform-bar"></div>
                        ))}
                      </div>
                    </div>
                    <p>
                      Những lúc mất phương hướng, làm sao để không tự trách và
                      tìm lại sự bình an bên trong?
                    </p>
                  </div>
                </div>

                <div className="podcast-card">
                  <div className="podcast-image">
                    <div className="play-button"></div>
                  </div>
                  <div className="podcast-content">
                    <h3>#03: Nghỉ ngơi không phải là lười biếng</h3>
                    <div className="audio-waveform">
                      <div className="play-button-small">▶</div>
                      <div className="waveform-bars">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="waveform-bar"></div>
                        ))}
                      </div>
                    </div>
                    <p>
                      Vì sao việc dừng lại, nghỉ ngơi lại quan trọng trên hành
                      trình phát triển bản thân?
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <Link to="/podcasts" className="view-all-btn btn btn-outline">
          Xem Tất Cả
        </Link>
      </section>

      {/* Inner Whispers Section - Dynamic Blogs */}
      <section className="blogs">
        <div className="blogs-intro-container">
          <h2 className="section-heading">Inner Whispers</h2>
          <p className="blogs-intro p-content">
            Những góc nhìn không vội vàng — từ một người đang học cách sống lại
            với chính mình.
          </p>
        </div>

        {isLoadingData ? (
          <div
            className="loading-container"
            style={{ textAlign: "center", padding: "2rem" }}
          >
            <p>Đang tải blogs...</p>
          </div>
        ) : (
          <div className="blog-cards">
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <Link
                  key={blog.id}
                  to={`/blog/detail/${blog.id}`}
                  className="blog-card"
                  onClick={(e) => handleBlogClick(e, blog.id)}
                >
                  <div
                    className="blog-image"
                    style={{
                      backgroundImage: `url(${
                        blog.coverImage || getDefaultBlogImage(index)
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="blog-logo">Inner embrace</div>
                    <div className="blog-quote">
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#8b4513",
                          marginBottom: "5px",
                        }}
                      >
                        {formatDate(blog.createdAt)}
                      </div>
                      <div>{blog.title}</div>
                    </div>
                  </div>
                  <div className="blog-content">
                    <h3>{blog.title}</h3>
                    <p>
                      {blog.content
                        ? blog.content
                            .replace(/<[^>]*>/g, "")
                            .substring(0, 120) +
                          (blog.content.length > 120 ? "..." : "")
                        : "Khám phá nội dung thú vị trong bài viết này."}
                    </p>
                    <div className="blog-date">
                      {formatDate(blog.createdAt)}
                    </div>
                    <div className="blog-author">
                      <small>Bởi: {blog.authorName}</small>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Fallback to original static content if no blogs found
              <>
                <Link to="/blog/detail/1" className="blog-card">
                  <div
                    className="blog-image"
                    style={{ backgroundImage: `url(${blog1Image})` }}
                  >
                    <div className="blog-logo">Inner embrace</div>
                    <div className="blog-quote">
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#8b4513",
                          marginBottom: "5px",
                        }}
                      >
                        Monday, 21 April
                      </div>
                      <div>
                        Ta sẽ không biết chuyện gì đang xảy ra – cho đến khi ta
                        biết.
                      </div>
                    </div>
                  </div>
                  <div className="blog-content">
                    <h3>
                      Ta sẽ không biết chuyện gì đang xảy ra – cho đến khi ta
                      biết
                    </h3>
                    <p>
                      Có thể bạn không cần phải tìm. Có thể nó đang ở đó — chờ
                      bạn thôi không ép mình nữa.
                    </p>
                    <div className="blog-date">12/05/2025</div>
                  </div>
                </Link>

                <Link to="/blog/detail/2" className="blog-card">
                  <div
                    className="blog-image"
                    style={{ backgroundImage: `url(${blog2Image})` }}
                  >
                    <div className="blog-logo">Inner embrace</div>
                    <div className="blog-quote">
                      Không phải lúc nào ta cũng có câu trả lời.
                      <br />
                      Và không phải lúc nào cũng cần đối với cô một hướng đi.
                      <br />
                      Bạn có dám cho mình được không biết một thời gian?
                    </div>
                    <div className="blog-heart"></div>
                  </div>
                  <div className="blog-content">
                    <h3>Không phải lúc nào ta cũng có câu trả lời</h3>
                    <p>
                      Mọi hành vi đều có lý do. Nhưng không phải lý do nào cũng
                      cần đúng với bạn bây giờ.
                    </p>
                    <div className="blog-date">21/03/2025</div>
                  </div>
                </Link>

                <Link to="/blog/detail/3" className="blog-card">
                  <div
                    className="blog-image"
                    style={{ backgroundImage: `url(${blog3Image})` }}
                  >
                    <div className="blog-logo">Inner embrace</div>
                    <div
                      className="blog-quote"
                      style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        color: "#8b4513",
                        fontSize: "1.1rem",
                        fontWeight: "500",
                      }}
                    >
                      Bạn muốn dừng lại, nhưng lại có rất nhiều tiếng nói kéo
                      bạn đi....
                      <br />
                      <br />
                      <span style={{ fontSize: "0.9rem", color: "#666" }}>
                        Có khi nào bạn tò mò muốn biết những tiếng nói đó thật
                        sự là gì không?
                      </span>
                    </div>
                  </div>
                  <div className="blog-content">
                    <h3>
                      Bạn đã bao giờ thử không cảm điền thoải trong 10 phút
                      chưa?
                    </h3>
                    <p>
                      Những khoảng giữa — nơi bạn đã thấy con đường nhưng vẫn
                      còn do dự. Làm gì khi bạn chưa sẵn sàng?
                    </p>
                    <div className="blog-date">21/01/2025</div>
                  </div>
                </Link>
              </>
            )}
          </div>
        )}

        <Link to="/blogs" className="view-all-btn btn btn-outline">
          Xem Tất Cả
        </Link>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-container">
        <div className="newsletter">
          <h2>Subscribe With Email</h2>
          <p className="p-content">
            Subscribe Inner Embrace — nhận những thông báo mới nhất
          </p>
        </div>
        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <input
            type="email"
            placeholder="Nhập Email Liên Hệ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isAuthenticated} // Disable nếu đã đăng nhập
          />
          <button
            type="submit"
            className="newsletter-btn"
            disabled={isSubscribing}
          >
            {isSubscribing
              ? "Đang xử lý..."
              : isSubscribed
              ? "Hủy đăng ký"
              : "Subscribe"}
          </button>
        </form>
        {subscriptionMessage && (
          <div
            className={`subscription-message ${
              isSubscribed ? "success" : "error"
            }`}
          >
            {subscriptionMessage}
          </div>
        )}
      </section>
    </div>
  );
};

export default BodyHomePage;
