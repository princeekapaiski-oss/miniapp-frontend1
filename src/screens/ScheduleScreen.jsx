import { useState } from "react";
import Header from "../components/Header/Header";
import ScheduleCard from "../components/ScheduleCard/ScheduleCard";
import "./ScheduleScreen.css";

function ScheduleScreen({ go }) {
  const [lessons, setLessons] = useState([
    {
      id: 1,
      date: "12 НОЯБРЯ",
      time: "18:00",
      title: "СБОРКА ДРОНА",
      description: "Практическое занятие по сборке и настройке дрона",
      free_places: 8,
      user_status: "available",
    },
    {
      id: 2,
      date: "14 ДЕКАБРЯ",
      time: "17:30",
      title: "ПРОГРАММИРОВАНИЕ РОБОТА",
      description: "Основы логики и управления",
      free_places: 0,
      user_status: "full",
    },
  ]);

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
        <div className="section-path">
          / ГЛАВНАЯ / РАСПИСАНИЕ
        </div>

        <div className="screen-title">
          ГРАФИК ИСПЫТАНИЙ
        </div>


        {lessons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">
              ТУТ ПУСТО :(
            </div>
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

        <button
          className="back-button"
          onClick={() => go("main")}
        >
          <img src="/icons/back.svg" alt="Назад" />
        </button>
      </div>
    </div>
  );
}

export default ScheduleScreen;
