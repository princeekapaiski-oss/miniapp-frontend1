import Header from "../components/Header/Header";
import "./LoginScreen.css";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

import {
  validateEmail,
  validatePassword,
} from "../utils/validation";

function LoginScreen({ go }) {
  const { login } = useUser();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const newErrors = {};

    if (touched.email) {
      const emailError = validateEmail(form.email);
      if (emailError) newErrors.email = emailError;
    }

    if (touched.password) {
      const passwordError = validatePassword(form.password);
      if (passwordError) newErrors.password = passwordError;
    }

    setErrors(newErrors);
  }, [form, touched]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async () => {
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    const newErrors = {};
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(newErrors).length > 0) return;

    try {
      // Отправка запроса на сервер для авторизации
      const response = await fetch("https://miniapp-backend-oio7.onrender.com/auth/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initData: window.Telegram.WebApp.initData,
          user: { email: form.email, password: form.password },
        }),
      });

      const data = await response.json();

      if (data.accessToken) {
        // Сохраняем токен в localStorage и переходим на главный экран
        localStorage.setItem("token", data.accessToken);
        go("main");  // Переход на главный экран
      } else {
        console.error("Ошибка входа");
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
    }
  };

  return (
    <div className="login-screen">
      <Header />

      <div className="login-content">
        <div className="section-path">НЛО / ВХОД </div>

        <div className="login-title">
          ИДЕНТИФИКАЦИЯ
          <br />
          ГУМАНОИДА
        </div>

        <div className="login-form">
          {/* EMAIL */}
          <div
            className={`input-with-icon ${
              errors.email ? "error" : ""
            }`}
          >
            <img src="/icons/mail.svg" alt="Email" />
            <input
              type="email"
              placeholder="E-MAIL"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
            />
          </div>
          {errors.email && (
            <div className="input-error">{errors.email}</div>
          )}

          {/* PASSWORD */}
          <div
            className={`input-with-icon ${
              errors.password ? "error" : ""
            }`}
          >
            <img src="/icons/lock.svg" alt="Password" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="ПАРОЛЬ"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
            />

            <button
              type="button"
              className={`eye-btn ${showPassword ? "active" : ""}`}
              onClick={() => setShowPassword(!showPassword)}
            >
              <img src="/icons/eye.svg" alt="Показать пароль" />
            </button>
          </div>
          {errors.password && (
            <div className="input-error">{errors.password}</div>
          )}

          <button
            className="btn-primary"
            onClick={handleSubmit}
          >
            ВОЙТИ В АККАУНТ
          </button>

          <div className="login-footer">
            ЕЩЁ НЕТ АККАУНТА?
            <span onClick={() => go("registration")}>
              РЕГИСТРИРУЙСЯ!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
