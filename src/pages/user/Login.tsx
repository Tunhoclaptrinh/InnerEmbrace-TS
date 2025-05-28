import React, { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../../services/auth.service";
import logo from "../../assets/img/logo_auth.png"; // Update this path to match your project structure
import "../../assets/css/Login.css";

const Login: React.FC = () => {
  let navigate: NavigateFunction = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email!"),
    password: Yup.string().required("Vui lòng nhập mật khẩu!"),
  });

  const handleLogin = (formValue: { email: string; password: string }) => {
    const { email, password } = formValue;
    setMessage("");
    setLoading(true);

    login(email, password).then(
      () => {
        navigate("/");
        // navigate("/profile");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error_description) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="yellow-circle"></div>
      <div className="orange-leaf"></div>
      <div className="purple-shape"></div>
      <div className="green-shape"></div>

      <div className="login-container">
        <div className="login-header">
          <img
            src={logo}
            alt="Inner Embrace Logo"
            className="logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
          <h1 className="main-title">Chào mừng trở lại</h1>
          <p className="trial-text">
            Đăng nhập để tiếp tục trải nghiệm{" "}
            <span className="highlight">Inner Embrace</span>
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form className="login-form">
            {message && <div className="error-message">{message}</div>}

            <div className="form-group">
              <label htmlFor="email">Email của bạn</label>
              <Field
                name="email"
                type="email"
                className="input-field"
                placeholder="Nhập địa chỉ email..."
                disabled={loading}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <Field
                name="password"
                type="password"
                className="input-field"
                placeholder="Nhập mật khẩu..."
                disabled={loading}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>

            <div className="divider">hoặc</div>

            <button
              type="button"
              className="social-login-button"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <img
                src="https://icon2.cleanpng.com/20240216/fty/transparent-google-logo-flat-google-logo-with-blue-green-red-1710875585155.webp"
                alt="Google"
                className="social-icon"
              />
              Tiếp tục với Google
            </button>

            <button
              type="button"
              className="social-login-button"
              onClick={handleFacebookLogin}
              disabled={loading}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkLcBrDHgOj0B_qrNTygXlcjOPlRfGOBqZrw&s"
                alt="Facebook"
                className="social-icon"
              />
              Tiếp tục với Facebook
            </button>

            <div className="signup-option">
              Chưa có tài khoản?{" "}
              <a href="/register" className="signup-link">
                Đăng ký
              </a>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
