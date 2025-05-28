import { useEffect, useState } from "react";
import * as AuthService from "../services/auth.service";
import IUser from "../types/user.type";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = AuthService.getCurrentUser();
        console.log("🔍 DEBUG - useAuth hook - User from localStorage:", user);

        if (user && user.accessToken) {
          setIsAuthenticated(true);
          setCurrentUser(user);
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("🔍 DEBUG - useAuth error:", error);
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, currentUser, isLoading };
};
