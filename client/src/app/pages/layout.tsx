"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../authcontext";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuth();
  //const userId = localStorage.getItem("userId");
  const router = useRouter();
  const pathname = usePathname();
  const [userId,setUserId]=useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignIn = () => {
    router.push("/login");
  };
  const handleSignUp = () => {
    router.push("/signup");
  };

  useEffect(()=>{
    const storeUserId=localStorage.getItem("userId");
    setUserId(storeUserId);

  },[])

  const linkClass = (path: string) =>
    pathname === path
      ? "text-white-400 border-b-2 border-white-400 pb-1" // Active tab styles
      : "text-white";

  return (
    <>
      <div className="bg-bg-color flex justify-center items-center">
        <nav className="bg-zinc-800 p-3 w-11/12 mt-2 rounded-lg">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo */}
            <div className="text-white text-lg font-bold">
              <img src="" alt="Logo" className="h-8" />
            </div>

            {/* Hamburger Menu */}
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex text-white space-x-4 items-center">
              <Link
                href="/pages/leaderboard"
                className={linkClass("/pages/leaderboard")}
              >
                Leaderboard
              </Link>

              {isLoggedIn && (
                <Link
                  href={`/pages/profile?userId=${userId}`}
                  passHref
                  className={linkClass("/pages/profile")}
                >
                  Profile
                </Link>
              )}
              {!isLoggedIn && (
                <>
                  <button
                    onClick={handleSignIn}
                    className="bg-zinc-800 text-white py-2 rounded"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleSignUp}
                    className="bg-zinc-800 text-white py-2 rounded"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mt-2 md:hidden space-y-2 text-white text-center">
              <Link
                href="/pages/leaderboard"
                className={linkClass("/pages/leaderboard")}
                onClick={() => setIsMenuOpen(false)}
              >
                Leaderboard
              </Link>

              {isLoggedIn && (
                <Link
                  href={`/pages/profile?userId=${userId}`}
                  passHref
                  className={linkClass("/pages/profile")}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              )}
              {!isLoggedIn && (
                <>
                  <button
                    onClick={() => {
                      handleSignIn();
                      setIsMenuOpen(false);
                    }}
                    className="bg-zinc-800 text-white py-2 rounded w-full"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      handleSignUp();
                      setIsMenuOpen(false);
                    }}
                    className="bg-zinc-800 text-white py-2 rounded w-full"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </nav>
      </div>

      <div>{children}</div>
    </>
  );
}
