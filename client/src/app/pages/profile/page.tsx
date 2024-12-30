/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Protectedroutes from "@/app/protectedroutes";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/app/authcontext";

interface ProfileData {
  profilePic?: string;
  name?: string;
  email?: string;
  branch?: string;
  year?: number;
  rank?: number;
  skills?: string[];
  about?: string;
}

const ProfileContent = () => {
  const { isLoggedIn, userId, logout } = useAuth();
  const [profiledata, setprofiledata] = useState<ProfileData>({});
  const [modal, setModal] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const userid = searchParams.get("userId");
  const api = process.env.NEXT_PUBLIC_API_BASE_URL;

  const toggleModal = () => setModal(!modal);

  const handleOptionClick = (option: string) => {
    if (option === "editProfile") {
      router.push("/pages/editprofile");
    } else if (option === "logout") {
      logout();
    }
    setModal(false);
  };

  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id === "modalBackdrop") setModal(false);
  };

  useEffect(() => {
    if (userid) {
      fetch(`${api}/user/${userid}`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setprofiledata({ ...data.user, rank: data.rank });
        })
        .catch((err) => console.log(err.message));
    }
  }, [userid]);

  const isOwnProfile = isLoggedIn && userId === userid;

  return (
    <div className="flex flex-col items-center bg-bg-color min-h-screen py-10 text-white">
      {/* Profile Card */}
      <Card className="mx-auto max-w-2xl w-full bg-neutral-900 p-2 rounded-md shadow-xl shadow-slate-950 border border-white">
        <div className="flex flex-col sm:flex-row sm:gap-4 items-center sm:items-start ml-3">
          <img
            src={
              profiledata?.profilePic
                ? `http://localhost:3000${profiledata.profilePic}`
                : "/image.png"
            }
            alt="Profile"
            className="w-36 h-36 mt-7 sm:w-36 sm:h-36 sm:mt-5 rounded-full border-2 border-gray-700 sm:mb-0 mb-4 object-cover"
          />
          <div className="flex flex-col w-full relative">
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex flex-col flex-grow">
                <h2 className="text-lg text-white font-semibold">
                  {profiledata?.name}
                </h2>
                <p className="text-sm text-gray-400">{profiledata?.email}</p>
              </div>
              {isOwnProfile && (
                <div className="z-10 sm:absolute top-1 right-2">
                  <button onClick={toggleModal} className="gear-icon">
                    <FontAwesomeIcon
                      icon={faGear}
                      className="text-gray-400 w-5 h-5"
                    />
                  </button>
                </div>
              )}
            </CardHeader>

            <CardContent className="mt-2 flex flex-wrap gap-4 text-center">
              <div className="bg-zinc-950 rounded-md px-4 py-1 border border-white text-white text-sm">
                {`${profiledata?.branch || "[BRANCH]"}-${
                  profiledata?.year
                } Year`}
              </div>
              <div className="bg-zinc-950 rounded-md px-4 py-1 border border-white text-sm text-white">
                Rank - {profiledata?.rank}
              </div>
            </CardContent>

            <CardContent className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start items-center sm:gap-4">
              {profiledata?.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-500 px-3 py-1 rounded-md text-xs"
                >
                  {skill}
                </span>
              ))}
            </CardContent>
          </div>
        </div>
      </Card>

      {/* Bio Card */}
      <Card className="mx-auto max-w-2xl w-full bg-neutral-900 mt-6 p-6 rounded-lg shadow-xl shadow-slate-950 border border-white text-center">
        <CardHeader>
          <p className="text-sm text-white">{profiledata?.about}</p>
        </CardHeader>
      </Card>

      {/* Modal for Edit and Logout Options */}
      {modal && (
        <div
          id="modalBackdrop"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-neutral-900 text-white p-6 rounded-lg shadow-xl w-80 sm:w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="text-center">
              <li>
                <button
                  className="w-full text-sm bg-zinc-950 py-2 px-4 rounded hover:bg-zinc-700 border border-gray-500"
                  onClick={() => handleOptionClick("editProfile")}
                >
                  Edit Profile
                </button>
              </li>
              <li>
                <button
                  className="w-full text-sm bg-zinc-950 py-2 px-4 rounded hover:bg-zinc-700 border border-gray-500"
                  onClick={() => handleOptionClick("logout")}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
