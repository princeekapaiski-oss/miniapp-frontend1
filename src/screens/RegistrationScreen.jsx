import Header from "../components/Header/Header";
import "./RegistrationScreen.css";
import { useState, useEffect } from "react";

import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
} from "../utils/validation";

function RegistrationScreen({ go }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateForm = (data) => {
    const newErrors = {};

    const firstNameError = validateFirstName(data.firstName);
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateLastName(data.lastName);
    if (lastNameError) newErrors.lastName = lastNameError;

    const emailError = validateEmail(data.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) newErrors.password = passwordError;

    return newErrors;
  };

  useEffect(() => {
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
  }, [form]);

  const isValid = Object.keys(errors).length === 0;
  const isFilled =
    form.firstName && form.lastName && form.email && form.password;

  const canSubmit = isValid && isFilled;

  // Обработчик отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Здесь делаем запрос к backend для регистрации
    try {
      const response = await fetch('https://miniapp-backend-oio7.onrender.com/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initData: window.Telegram.WebApp.initData,
          user: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password,
          },
        }),
      });

      const data = await response.json();

      if (data.accessToken) {
        // Сохраните токен в localStorage
        localStorage.setItem("token", data.accessToken);
        go("main");  // Переход на главный экран
      } else {
        console.error("Ошибка регистрации");
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);
    }
  };

  return (
    <div className="registration-screen">
      <Header />

      <div className="registration-content">
        <div className="section-path">НЛО / РЕГИСТРАЦИЯ</div>

        <div className="registration-title">
          ЗАЧИСЛЕНИЕ
          <br />
          В ЭКИПАЖ
        </div>

        <div className="registration-form">
          {/* Форма */}
          <div
            className={`input-with-icon ${
              errors.lastName && touched.lastName ? "error" : ""
            }`}
          >
            <img src="/icons/profile.svg" alt="" />
            <input
              placeholder="ФАМИЛИЯ"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
            />
          </div>
          {errors.lastName && touched.lastName && (
            <div className="input-error">{errors.lastName}</div>
          )}

          <div
            className={`input-with-icon ${
              errors.firstName && touched.firstName ? "error" : ""
            }`}
          >
            <img src="/icons/profile.svg" alt="" />
            <input
              placeholder="ИМЯ"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
            />
          </div>
          {errors.firstName && touched.firstName && (
            <div className="input-error">{errors.firstName}</div>
          )}

          <div
            className={`input-with-icon ${
              errors.email && touched.email ? "error" : ""
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
          {errors.email && touched.email && (
            <div className="input-error">{errors.email}</div>
          )}

          <div
            className={`input-with-icon ${
              errors.password && touched.password ? "error" : ""
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
          {errors.password && touched.password && (
            <div className="input-error">{errors.password}</div>
          )}
        </div>

        {/* Кнопка отправки формы */}
        <button
          className="btn-primary"
          disabled={!canSubmit}
          onClick={handleSubmit}  // Обработчик отправки
        >
          СОЗДАТЬ АККАУНТ
        </button>

        <div className="registration-footer">
          УЖЕ ЕСТЬ АККАУНТ?
          <span onClick={() => go("login")}>ВОЙТИ!</span>
        </div>
      </div>
    </div>
  );
}

export default RegistrationScreen;
