"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./authcontext";
import BeatLoader from "react-spinners/BeatLoader";

export default function Protectedroutes({ 
  children, 
  allowPublicAccess = false 
}) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not logged in
    if (isLoggedIn === false) {
      const authstate = localStorage.getItem("isAuthenticated");
      
      // If not explicitly set to false, redirect and show alert
      if (authstate !== "false") {
        // If public access is not allowed
        if (!allowPublicAccess) {
          router.push("/pages/leaderboard");
          setTimeout(() => {
            alert("You need to log in to view this page");
          }, 100);
        } else {
          // If public access is allowed, just stop loading
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } else if (isLoggedIn === true) {
      setLoading(false);
    }
  }, [isLoggedIn, router, allowPublicAccess]);

  // Show loading state
  if (isLoggedIn === null || loading) {
    return (
      <div className="bg-bg-color flex items-center justify-center h-screen text-3xl">
        <BeatLoader color="#ffffff" />
      </div>
    );
  }

  // Render children
  return children;
}