"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./authcontext";
import BeatLoader from "react-spinners/BeatLoader";

export default function Protectedroutes({ children }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn === false && !loading) {
      router.push("/login");
    } else if (isLoggedIn === true) {
      setLoading(false);
    }
  }, [isLoggedIn, loading,router]);

  if (isLoggedIn === null || loading) {
    return (
      <div className="bg-bg-color flex items-center justify-center h-screen text-3xl">
        <BeatLoader color="#ffffff" />
      </div>
    );
  }

  return children;
}
