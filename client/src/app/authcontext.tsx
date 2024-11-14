"use client"
import React, { createContext, useContext, useEffect, useState ,ReactNode} from 'react'
interface AuthContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
  }
  
const AuthContext=createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const auth=useContext(AuthContext);
    
    

    if (!auth){
        throw new Error("error");
    }
    return auth;
  
}
interface AuthProviderProps {
    children: ReactNode;
  }
  

export const AuthProvider:React.FC<AuthProviderProps>=({children})=>{
    const [isLoggedIn,setisLoggedIn]=useState<boolean|null>(null);
    
    useEffect(()=>{const authstate=localStorage.getItem("isAuthenticated");
    setisLoggedIn(authstate==="true");
    },[]);
        
    
    const login=()=>{
        localStorage.setItem("isAuthenticated","true");
        setisLoggedIn(true);
    };
    const logout=()=>{
        localStorage.removeItem("isAuthenticated");
        setisLoggedIn(false);
        
    };

    

    return(
        <AuthContext.Provider value={{isLoggedIn,login,logout}}>{
            children
        }</AuthContext.Provider>
        
    );
}
