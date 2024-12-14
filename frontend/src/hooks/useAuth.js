import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);

      try {
        const decodedToken = jwtDecode(savedToken);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuthenticated(false);
        setUserId(null);
      }
    } else {
      setIsAuthenticated(false);
      setToken(null);
      setUserId(null);
    }
  }, []);

  return { isAuthenticated, token, userId };
};

export default useAuth;
