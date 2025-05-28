import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/auth.service";
import logo from "../../assets/img/logo_auth.png";
import "../../assets/css/Register.css";

const Register: React.FC = () => {
  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Vui lòng điền họ!"),
    lastName: Yup.string().required("Vui lòng điền tên!"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Vui lòng điền email!"),
    password: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Vui lòng điền mật khẩu!"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
      .required("Vui lòng xác nhận mật khẩu!"),
  });

  const handleRegister = (formValue: any) => {
    setIsLoading(true);
    const { email, password, firstName, lastName } = formValue;
    const fullname = `${firstName} ${lastName}`;
    const avatar_url = "https://placehold.co/60x60?text=avatar"; // Default avatar

    register(email, password, fullname, avatar_url)
      .then(
        (response) => {
          setMessage("Đăng ký thành công!");
          setSuccessful(true);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.error_description) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  const handleFacebookSignup = () => {
    console.log("Facebook signup clicked");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="signup-page">
      <div className="yellow-circle"></div>
      <div className="orange-leaf"></div>
      <div className="purple-shape"></div>
      <div className="green-shape"></div>

      <div className="signup-container">
        <div className="signup-header">
          <img
            src={logo}
            alt="Inner Embrace Logo"
            className="logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
          <h1 className="main-title">Tạo tài khoản để sử dụng Chương trình</h1>
          <p className="trial-text">
            Bạn sẽ bắt đầu với{" "}
            <span className="highlight">14 ngày dùng thử miễn phí</span> gói
            Team.
          </p>
          <p className="terms-text">
            Bằng cách đăng ký tài khoản Inner Embrace, bạn đồng ý với{" "}
            <a href="/terms" className="link-text">
              Điều khoản Dịch vụ
            </a>{" "}
            và{" "}
            <a href="/privacy" className="link-text">
              Chính sách Bảo mật
            </a>
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form className="signup-form">
            {message && (
              <div
                className={successful ? "alert alert-success" : "error-message"}
              >
                {message}
              </div>
            )}

            <div className="name-row">
              <div className="form-group half-width">
                <label htmlFor="firstName">Họ và tên đệm</label>
                <Field
                  name="firstName"
                  type="text"
                  className="input-field"
                  disabled={isLoading}
                  placeholder="Nhập họ tên"
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group half-width">
                <label htmlFor="lastName">Tên</label>
                <Field
                  name="lastName"
                  type="text"
                  className="input-field"
                  disabled={isLoading}
                  placeholder="Nhập tên"
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="error-message"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field
                name="email"
                type="email"
                className="input-field"
                disabled={isLoading}
                placeholder="Nhập email"
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
                disabled={isLoading}
                placeholder="Nhập mật khẩu"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
              <Field
                name="confirmPassword"
                type="password"
                className="input-field"
                disabled={isLoading}
                placeholder="Nhập lại mật khẩu"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error-message"
              />
            </div>

            <button
              type="submit"
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>

            <div className="divider">hoặc</div>

            <button
              type="button"
              className="social-signup-button google-button"
              onClick={handleGoogleSignup}
              disabled={isLoading}
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
              className="social-signup-button facebook-button"
              onClick={handleFacebookSignup}
              disabled={isLoading}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkLcBrDHgOj0B_qrNTygXlcjOPlRfGOBqZrw&s"
                alt="Facebook"
                className="social-icon"
              />
              Tiếp tục với Facebook
            </button>

            <div className="login-option">
              Bạn đã có tài khoản?{" "}
              <a href="/login" className="login-link">
                Đăng nhập
              </a>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
