import { useState } from "react";
import "./App.css";

import MainScreen from "./screens/MainScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AchievementsScreen from "./screens/AchievementsScreen";
import LoginScreen from "./screens/LoginScreen";
import RegistrationScreen from "./screens/RegistrationScreen";

function App() {
  const [screen, setScreen] = useState("login");

  const renderScreen = () => {
    switch (screen) {
      case "login":
        return <LoginScreen go={setScreen} />;
      case "registration":
        return <RegistrationScreen go={setScreen} />;
      case "main":
        return <MainScreen go={setScreen} />;
      case "schedule":
        return <ScheduleScreen go={setScreen} />;
      case "profile":
        return <ProfileScreen go={setScreen} />;
      case "achievements":
        return <AchievementsScreen go={setScreen} />;
      default:
        return <MainScreen go={setScreen} />;
    }
  };

  return (
    <div className="app-viewport">
      <div className="app-root">
        {renderScreen()}
      </div>
    </div>
  );
}

export default App;
