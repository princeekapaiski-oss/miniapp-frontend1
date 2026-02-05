import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import "./ProfileScreen.css";
import { useUser } from "../context/UserContext";
import { LEVELS, getCurrentLevel } from "../utils/levels";

function ProfileScreen({ go }) {
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useUser(); // Используем контекст пользователя, если нужно
  const currentLevel = getCurrentLevel(LEVELS, user.experience);

  const [savedProfile, setSavedProfile] = useState({
    firstName: "ДАНИЛ",
    lastName: "ПРОКОШЕВ",
    id: "000001",
    role: "ГЛАВНЫЙ ИНЖЕНЕР",
    email: "DANILPRO0220@GMAIL.COM",
    password: "",
    direction: "ИГД",
    course: "1",
    birthDate: "2005-06-12",
  });

  const [draftProfile, setDraftProfile] = useState({ ...savedProfile });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // API URL для запроса к backend
  const BACKEND_URL = "https://miniapp-backend-oio7.onrender.com";

  // Получаем профиль пользователя при монтировании компонента
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${BACKEND_URL}/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data) {
          setSavedProfile(data); // Присваиваем полученные данные в savedProfile
          setDraftProfile(data); // Присваиваем данные в draftProfile для редактирования
        }
      } catch (error) {
        console.error("Ошибка запроса:", error);
      } finally {
        setIsLoading(false); // Завершаем загрузку
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!canSave) return;

    // Отправляем обновленный профиль на сервер
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BACKEND_URL}/me`, {
        method: "PUT", // Используем PUT для обновления
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draftProfile),
      });

      const data = await response.json();
      if (data.success) {
        setSavedProfile(draftProfile);
        console.log("Профиль обновлен:", draftProfile);
      } else {
        console.error("Ошибка сохранения профиля");
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
    }
  };

  const validateProfile = (profile) => {
    const newErrors = {};

    if (!profile.firstName || profile.firstName.length < 2) {
      newErrors.firstName = "Имя слишком короткое";
    }

    if (!profile.lastName || profile.lastName.length < 2) {
      newErrors.lastName = "Фамилия слишком короткая";
    }

    if (!profile.email.includes("@")) {
      newErrors.email = "Некорректный email";
    }

    if (profile.password && profile.password.length < 6) {
      newErrors.password = "Минимум 6 символов";
    }

    if (!profile.birthDate) {
      newErrors.birthDate = "Дата не указана";
    }

    return newErrors;
  };

  useEffect(() => {
    const validationErrors = validateProfile(draftProfile);
    setErrors(validationErrors);
  }, [draftProfile]);

  const isChanged = JSON.stringify(draftProfile) !== JSON.stringify(savedProfile);
  const isValid = Object.keys(errors).length === 0;
  const canSave = isChanged && isValid;

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="profile-screen">
      <Header title="ГЛАВНАЯ / ПРОФИЛЬ /" />

      <div className="profile-content">
        <div className="section-path">/ ГЛАВНАЯ / ПРОФИЛЬ</div>

        <div className="screen-title-profile">КАРТОЧКА ИНЖЕНЕРА</div>

        {/* MAIN CARD */}
        <div className="profile-main-card">
          <div className="avatar-placeholder" />

          <div className="profile-main-info">
            <div className="profile-name">
              <div>{savedProfile.firstName}</div>
              <div>{savedProfile.lastName}</div>
            </div>

            <div className="profile-id">ID: {savedProfile.id}</div>

            <div className="profile-bottom">
              <div className="profile-role">{savedProfile.role}</div>
              <div className="profile-level">
                УРОВЕНЬ: {currentLevel.level}
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="profile-form">
          <label>
            ИМЯ И ФАМИЛИЯ
            <input
              value={`${draftProfile.firstName} ${draftProfile.lastName}`}
              onChange={(e) => {
                const [firstName = "", lastName = ""] =
                  e.target.value.split(" ");
                setDraftProfile({
                  ...draftProfile,
                  firstName,
                  lastName,
                });
              }}
            />
          </label>

          <label>
            E-MAIL
            <input
              value={draftProfile.email}
              onChange={(e) =>
                setDraftProfile({
                  ...draftProfile,
                  email: e.target.value,
                })
              }
            />
          </label>

          <label>
            ПАРОЛЬ
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={draftProfile.password}
                onChange={(e) =>
                  setDraftProfile({
                    ...draftProfile,
                    password: e.target.value,
                  })
                }
              />

              <button
                type="button"
                className={`eye-btn ${showPassword ? "active" : ""}`}
                onClick={() => setShowPassword(!showPassword)}
              >
                <img src="/icons/eye.svg" alt="Показать пароль" />
              </button>
            </div>
          </label>

          <label>
            НАПРАВЛЕНИЕ ОБУЧЕНИЯ
            <input
              value={draftProfile.direction}
              onChange={(e) =>
                setDraftProfile({
                  ...draftProfile,
                  direction: e.target.value,
                })
              }
            />
          </label>

          <label>
            КУРС
            <input
              value={draftProfile.course}
              onChange={(e) =>
                setDraftProfile({
                  ...draftProfile,
                  course: e.target.value,
                })
              }
            />
          </label>

          <label>
            ДАТА РОЖДЕНИЯ
            <input
              type="date"
              value={draftProfile.birthDate}
              onChange={(e) =>
                setDraftProfile({
                  ...draftProfile,
                  birthDate: e.target.value,
                })
              }
            />
          </label>
        </div>

        {/* ACTIONS */}
        <div className="profile-actions">
          <button
            className="btn save"
            onClick={handleSave}
            disabled={!canSave}
          >
            СОХРАНИТЬ
          </button>

          <button className="btn back" onClick={() => go("main")}>
            <img src="/icons/back.svg" alt="Назад" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
