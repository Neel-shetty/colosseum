/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Protectedroutes from "@/app/protectedroutes";
import { useRouter } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/app/authcontext";

const profile_data = {
  userId: "123",
  name: "Margaret Liza John",
  email: "margaretlj04@gmail.com",
  year: "CSE - 2nd Year",
  rank: "3",
  score: 9500,
  location: "Bengaluru, India",
  skills: [
    "AI/ML",
    "CyberSecurity",
    "Web Development",
    "Python",
    "Ethical Hacking",
  ],
  bio: "Hey! I'm Margaret, an aspiring software engineer with a keen interest in machine learning and AI.",
};

export default function ProfilePage() {
  const {logout}=useAuth();
  const router = useRouter();

  const[modal,setModal]=useState(false);

  const toggleModal=()=>{
    setModal(!modal);
  }
  const handleOptionClick = (option) => {
    if(option=="editProfile")
    {
      router.push("/pages/editprofile");

    }else{
      
      router.push("/login");
      logout();
      
    }
   setModal(false);
    
  };
  const closeModal=(e)=>{
    if (e.target.id=="modalBackdrop")
    setModal(false);
  }
  return (
    <Protectedroutes>
      <div className="flex flex-col items-center bg-bg-color min-h-screen py-10 text-white">
        {/* Profile Card */}
        <Card className="mx-auto max-w-2xl w-full bg-neutral-900 p-2 rounded-md shadow-xl shadow-slate-950 border border-white">
          <div className="flex flex-col sm:flex-row sm:gap-4 items-center sm:items-start ml-3">
            <img
              src="/catpfp.jpg"
              alt="Profile"
              className="w-40 h-36 mt-10 sm:w-48 sm:h-40 rounded-full border-2 border-gray-700 sm:mb-0 mb-4"
            />

            <div className="flex flex-col w-full">
              <CardHeader className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex flex-col flex-grow">
                  <h2 className="text-lg text-white font-semibold">
                    {profile_data.name}
                  </h2>
                  <p className="text-sm text-gray-400">{profile_data.email}</p>
                </div>
                <button
                  className="self-start -mt-2" onClick={toggleModal}
                >
                  <FontAwesomeIcon icon={faGear} className="text-gray-400 w-5 h-5"/>
                </button>
              </CardHeader>

              <CardContent className="mt-2 flex flex-wrap gap-4 text-center">
                <div className="bg-zinc-950 rounded-md px-4 py-1 border border-white text-white text-sm">
                  {profile_data.year}
                </div>
                <div className="bg-zinc-950 rounded-md px-4 py-1 border border-white text-sm text-white">
                  Rank - {profile_data.rank}
                </div>
                <div className="bg-zinc-950 rounded-md px-4 py-1 border border-white text-sm text-white">
                  Score - {profile_data.score}
                </div>
                <div className="bg-zinc-950 rounded-md px-4 py-1 border border-white text-sm text-white">
                  {profile_data.location}
                </div>
              </CardContent>

              <CardContent className="mt-2">
                <div className="flex flex-wrap mr-12 gap-2 justify-center">
                  {profile_data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-500 px-3 py-1 rounded-md text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>

        {/* Bio Card */}
        <Card className="mx-auto max-w-2xl w-full bg-neutral-900 mt-6 p-6 rounded-lg shadow-xl shadow-slate-950 border border-white text-center">
          <CardHeader>
            <p className="text-sm text-white">{profile_data.bio}</p>
          </CardHeader>
          <div className="flex justify-center gap-4 mt-4 text-gray-400">
            <i className="fab fa-github hover:text-white text-2xl" />
            <i className="fab fa-linkedin hover:text-white text-2xl" />
            <i className="fab fa-twitter hover:text-white text-2xl" />
            <i className="fab fa-instagram hover:text-white text-2xl" />
            <i className="fab fa-facebook hover:text-white text-2xl" />
          </div>
        </Card>
        {/*<div className="w-full max-w-2xl mt-5 flex justify-end">
          <button
            className="bg-zinc-950 text-white px-6 py-2 rounded-md shadow-lg border border-white hover:bg-zinc-700"
            onClick={handleClick}
          >
            Edit Profile
          </button>
        </div>
        */}
        {modal && (
        <div
          id="modalBackdrop"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm "
          onClick={closeModal}
        >
          <div
            className="bg-neutral-900 text-white p-6 rounded-lg shadow-xl w-80"
            onClick={(e) => e.stopPropagation()} 
          >
            <ul className=" text-center">
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
    </Protectedroutes>
  );
}
