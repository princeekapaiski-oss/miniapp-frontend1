import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import ScheduleCard from "../components/ScheduleCard/ScheduleCard";
import "./ScheduleScreen.css";

function ScheduleScreen({ go }) {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState("");

  // Получение данных с бэкенда для расписания
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/schedule`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Использование токена из localStorage
          },
        });

        const data = await response.json();

        if (response.ok) {
          setLessons(data);  // Устанавливаем полученные данные в состояние
        } else {
          setError(data.error || "Не удалось загрузить расписание");
        }
      } catch (err) {
        setError("Ошибка при подключении к серверу.");
      }
    };

    fetchSchedule(); // Вызываем функцию получения данных
  }, []);

  const handleToggleEnroll = (id) => {
    setLessons((prev) =>
      prev.map((lesson) => {
        if (lesson.id !== id) return lesson;

        if (lesson.user_status === "available" && lesson.free_places > 0) {
          return {
            ...lesson,
            user_status: "enrolled",
            free_places: lesson.free_places - 1,
          };
        }

        if (lesson.user_status === "enrolled") {
          return {
            ...lesson,
            user_status: "available",
            free_places: lesson.free_places + 1,
          };
        }

        return lesson;
      })
    );
  };

  return (
    <div className="schedule-screen">
      <Header title="ГЛАВНАЯ / РАСПИСАНИЕ /" />

      <div className="schedule-content">
        <div className="section-path">/ ГЛАВНАЯ / РАСПИСАНИЕ</div>

        <div className="screen-title">ГРАФИК ИСПЫТАНИЙ</div>

        {error && <div className="error">{error}</div>}  {/* Отображение ошибок */}

        {lessons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">ТУТ ПУСТО :(</div>
            <div className="empty-text">
              В БЛИЖАЙШЕЕ ВРЕМЯ ЗДЕСЬ ПОЯВЯТСЯ НОВЫЕ ИСПЫТАНИЯ
            </div>
          </div>
        ) : (
          lessons.map((lesson) => (
            <ScheduleCard
              key={lesson.id}
              lesson={lesson}
              onToggleEnroll={handleToggleEnroll}
            />
          ))
        )}

        <button className="back-button" onClick={() => go("main")}>
          <img src="/icons/back.svg" alt="Назад" />
        </button>
      </div>
    </div>
  );
}

export default ScheduleScreen;
