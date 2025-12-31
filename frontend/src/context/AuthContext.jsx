import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user");
    const storedPassword = localStorage.getItem("password");
    
    if (storedUser && storedPassword) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("password");
      }
    }
    setLoading(false);
  }, []);

  const signup = (firstName, lastName, email, password) => {
    const userData = { 
      firstName, 
      lastName, 
      email,
      id: Date.now()
    };
    
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("password", password);
    setUser(userData);
    
    return true;
  };

  const login = (email, password) => {
    const storedUser = localStorage.getItem("user");
    const storedPassword = localStorage.getItem("password");
    
    if (!storedUser || !storedPassword) {
      return false;
    }
    
    try {
      const parsedUser = JSON.parse(storedUser);
      
      // Trim and compare
      const emailMatch = parsedUser.email.trim() === email.trim();
      const passwordMatch = storedPassword === password;
      
      if (emailMatch && passwordMatch) {
        setUser(parsedUser);
        return true;
      }
      
      return false;
      
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("password");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
