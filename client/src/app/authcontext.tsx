"use client"
import React, { createContext, useContext, useState } from 'react'
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

export const AuthProvider=({children})=>{
    const [isLoggedIn,setisLoggedIn]=useState(false);
    const login=()=>{
        setisLoggedIn(true);
    };
    const logout=()=>{
        setisLoggedIn(false);
    };

    return(
        <AuthContext.Provider value={{isLoggedIn,login,logout}}>{
            children
        }</AuthContext.Provider>
        
    );
}
