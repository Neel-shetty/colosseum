"use client"
import React from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useAuth } from "../authcontext";

export default function PageLayout({
  children,
  
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn} = useAuth(); 
  const userId=localStorage.getItem("userId");
  const router=useRouter();
  const handleSignIn = () => {
    
    router.push("/login")
  };
  const handleSignUp = () => {
    
    router.push("/signup")
  };
  return (
    <>
      <div className="bg-bg-color flex justify-center items-center ">
        <nav
          className="bg-zinc-800 p-3 w-11/12
         mt-2  rounded-lg "
        >
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-lg font-bold">
              <img src="" alt="Logo" />
            </div>
            <div className="text-white space-x-4">
              

              <Link href="/pages/leaderboard">Leaderboard</Link>
             
              {isLoggedIn && <Link href={`/pages/profile?userId=${userId}`} passHref>Profile</Link>}
              {!isLoggedIn && (<><button onClick={handleSignIn} className="bg-zinc-800 text-white  py-2 rounded">Sign In</button>
              <button onClick={handleSignUp} className="bg-zinc-800 text-white  py-2 rounded">Sign Up</button></>)}
             
            </div>
          </div>
        </nav>
      </div>

      <div>{children}</div>
    </>
  );
}
