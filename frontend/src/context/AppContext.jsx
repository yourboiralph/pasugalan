import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({});
  const [userRbProf, setUserRbProf] = useState(
    localStorage.getItem("userRbProf") || ""
  );

  const getUser = async () => {
    try {
      const response = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Read response as text
      const text = await response.text();
      const data = JSON.parse(text);
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  // Save userRbProf to localStorage when it updates
  useEffect(() => {
    if (userRbProf) {
      localStorage.setItem("userRbProf", userRbProf);
    }
  }, [userRbProf]);
  return (
    <AppContext.Provider
      value={{ user, setUser, token, setToken, userRbProf, setUserRbProf }}
    >
      {children}
    </AppContext.Provider>
  );
}
