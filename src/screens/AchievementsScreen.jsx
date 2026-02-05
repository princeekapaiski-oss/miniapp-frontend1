import Header from "../components/Header/Header";
import AchievementCard from "../components/AchievementCard/AchievementCard";
import "./AchievementsScreen.css";

import { useUser } from "../context/UserContext";
import {
  LEVELS,
  getCurrentLevel,
  getProgressPercent,
} from "../utils/levels";


function AchievementsScreen({ go }) {
  const { user } = useUser();

    const currentLevel = getCurrentLevel(LEVELS, user.experience);
    const progressPercent = getProgressPercent(LEVELS, user.experience);


    const achievements = [
      {
        id: 1,
        title: "НУ ПРИВЕТ, ПУТНИК!",
        description: "СОЗДАТЬ АККАУНТ",
        reward: "+10 ОЧКОВ",
        unlocked: true,
      },
      {
        id: 2,
        title: "БЕСКОНЕЧНОСТЬ НЕ ПРЕДЕЛ!",
        description: "ПОСЕТИТЬ 10 ВСТРЕЧ ПОДРЯД",
        reward: "+50 ОЧКОВ",
        unlocked: false,
      },
    ];


  return (
    <div className="achievements-screen">
      <Header title="ГЛАВНАЯ / ДОСТИЖЕНИЯ /" />

      <div className="achievements-content">
        <div className="section-path">
          / ГЛАВНАЯ / ДОСТИЖЕНИЯ
        </div>

        {/* UFO */}
        <div className="ufo-wrapper">
          <img src="/images/ufo.png" alt="UFO" />
        </div>

        {/* EXP BAR */}
        <div className="exp-bar">
          <div
            className="exp-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="exp-info">
          <span>ОЧКОВ: {user.experience}</span>
          <span>УРОВЕНЬ: {currentLevel.level}</span>
        </div>

        <div className="screen-title-achievements">
          БАЗА АРТЕФАКТОВ
        </div>

        <div className="achievements-list">
          {achievements.map((item) => (
            <AchievementCard key={item.id} achievement={item} />
          ))}
        </div>

        {/* BACK BUTTON */}
        <button className="btn back fixed" onClick={() => go("main")}>
          <img src="/icons/back.svg" alt="Назад" />
        </button>
      </div>
    </div>
  );
}

export default AchievementsScreen;
