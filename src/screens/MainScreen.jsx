import "./MainScreen.css";
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header/Header";

function MainScreen({ go }) {
  const titleRef = useRef(null);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  // Функция для адаптации размера заголовка в зависимости от ширины
  useEffect(() => {
    const fitTitle = () => {
      const el = titleRef.current;
      if (!el) return;

      const parent = el.parentElement;
      const style = getComputedStyle(parent);

      const availableWidth =
        parent.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);

      el.style.fontSize = "62px";

      const textWidth = el.scrollWidth;
      if (textWidth > 0) {
        const ratio = availableWidth / textWidth;
        const newSize = Math.floor(62 * ratio);
        el.style.fontSize = `${newSize}px`;
      }
    };

    fitTitle();
    window.addEventListener("resize", fitTitle);
    return () => window.removeEventListener("resize", fitTitle);
  }, []);

  // Получение данных с бэкенда для активностей
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/activities`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,  // Авторизация с токеном
          },
        });

        const data = await response.json();
        
        if (response.ok) {
          setActivities(data);
        } else {
          setError(data.error || "Failed to fetch activities");
        }
      } catch (err) {
        setError("Failed to connect to the server.");
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="main-screen">
      <Header title="НЛО / ГЛАВНАЯ /" />

      <div className="main-content">
        <div className="section-path">
          НЛО / ГЛАВНАЯ /
        </div>

        <div className="ufo-wrapper">
          <img src="/images/ufo.png" alt="UFO" />
        </div>

        <div className="main-title-wrapper">
          <div className="main-title" ref={titleRef}>
            МОЙ ХАБ
          </div>
        </div>

        <div className="main-actions">
          {error && <div className="error">{error}</div>}
          
          <button
            className="action-btn action-btn--wide"
            onClick={() => go("schedule")}
          >
            <img src="/icons/schedule.svg" alt="Schedule" />
            <span>РАСПИСАНИЕ<br />ВСТРЕЧ</span>
          </button>

          <div className="actions-row">
            <button
              className="action-btn action-btn--vertical"
              onClick={() => go("profile")}
            >
              <img src="/icons/profile.svg" alt="Profile" />
              <span>ПРОФИЛЬ</span>
            </button>

            <button
              className="action-btn action-btn--vertical"
              onClick={() => go("achievements")}
            >
              <img src="/icons/achievements.svg" alt="Achievements" />
              <span>ДОСТИЖЕНИЯ</span>
            </button>
          </div>
        </div>

        <div className="activity-list">
          <h3>Available Activities</h3>
          <ul>
            {activities.map((activity) => (
              <li key={activity.id}>
                <h4>{activity.title}</h4>
                <p>{activity.description}</p>
                <button onClick={() => console.log(`Registering for ${activity.title}`)}>
                  Register
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MainScreen;
