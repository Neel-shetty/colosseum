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
  const { logout } = useAuth(); 
  const router=useRouter();
  const handleClick = () => {
    logout(); 
    router.push("/login")
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
              <Link href="#">Home</Link>

              <Link href="/pages/leaderboard">Leaderboard</Link>
             
              <Link href="/pages/profile">Profile</Link>
              <button onClick={handleClick} className="bg-zinc-800 text-white  py-2 rounded">Logout</button>
            </div>
          </div>
        </nav>
      </div>

      <div>{children}</div>
    </>
  );
}
