import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    id: "000001",
    firstName: "ДАНИЛ",
    lastName: "ПРОКОШЕВ",
    role: "ГЛАВНЫЙ ИНЖЕНЕР",
    experience: 2600,
  });

    const addExperience = (amount) => {
      setUser((prev) => ({
        ...prev,
        experience: prev.experience + amount,
      }));
    };


  return (
    <UserContext.Provider value={{ user, setUser, addExperience }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
