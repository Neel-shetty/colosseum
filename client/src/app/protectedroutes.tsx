"use client"
import { useRouter } from "next/navigation";
import {useEffect,useState} from "react";
import { useAuth } from "./authcontext";


export default function Protectedroutes({children}){
    
    const router=useRouter();
    const {isLoggedIn}=useAuth();
    const[loading,setLoading]=useState(true)


    useEffect(()=>{
        
        if(!isLoggedIn){
            router.push("/login")

        }
        
        

    },[isLoggedIn,router]);
    
    if(!isLoggedIn){
        return null;
    }
    
    return children;
}