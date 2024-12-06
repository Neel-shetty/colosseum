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
  isLoggedIn: boolean;
  login: () => void;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authstate = localStorage.getItem("isAuthenticated");
    setisLoggedIn(authstate === "true");
    setLoading(false);
  }, []);

  const login = () => {
    localStorage.setItem("isAuthenticated", "true");
    setisLoggedIn(true);
  };
  const logout = () => {
    setLoading(true);
    localStorage.removeItem("isAuthenticated"); 
    router.push("/pages/leaderboard"); 
    setTimeout(() => {
        setisLoggedIn(false);
        setLoading(false); 
    }, 100); 
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
