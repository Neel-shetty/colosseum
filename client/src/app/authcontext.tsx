"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
interface AuthContextType {
  isLoggedIn: boolean | null;
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("error");
  }
  return auth;
};
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const router=useRouter();
  const [isLoggedIn, setisLoggedIn] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authstate = localStorage.getItem("isAuthenticated");
    setisLoggedIn(authstate === "true");
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
    setLoading(false);
  }, []);

  const login = (userId: string) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userId", userId);
    setisLoggedIn(true);
    setUserId(userId);
  };

  
  const logout = () => {
    setLoading(true);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId"); 
    router.push("/pages/leaderboard"); 
    setTimeout(() => {
        setisLoggedIn(false);
        setLoading(false); 
    }, 100); 
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
