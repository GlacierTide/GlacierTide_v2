import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  // Set userId in both state and localStorage on login
  const login = (newUserId) => {
    setUserId(newUserId);
    localStorage.setItem("userId", newUserId);
  };

  // Clear userId from state and localStorage on logout
  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
  };

  useEffect(() => {
    // Update userId on context initialization or page refresh
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
