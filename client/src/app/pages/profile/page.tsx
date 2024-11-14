/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Protectedroutes from "@/app/protectedroutes";

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
                <img
                  src="/unilogo.png"
                  alt="University Logo"
                  className="ml-auto w-28 h-10 sm:w-32 sm:h-12"
                />
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
      </div>
    </Protectedroutes>
  );
}
