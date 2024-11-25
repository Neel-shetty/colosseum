"use client";
import Protectedroutes from "@/app/protectedroutes";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/router";

export default function Page() {

  const [skillsOpen, setSkillsOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skillsList = ["CyberSecurity", "AI/ML", "Web Dev", "App Dev"];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };
  
  return (
    <Protectedroutes>
      <div className="flex flex-col items-center bg-bg-color min-h-screen py-10 ">
        <Card className="mx-auto max-w-4xl w-full bg-zinc-950 p-6 rounded-md shadow-xl text-white shadow-slate-950 border border-zinc-950 p-10 ">
          <h1 className="text-2xl font-bold text-center mb-12 text-white">
            Edit Your Profile
          </h1>
          <form>
            <div className="flex flex-col gap-12">
              <div className="flex flex-row justify-start items-center mt-10">
                <label className=" text-white w-1/4 text-lg">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-3/4 bg-transparent border-b-2 border-gray-700 text-white outline-none"
                />
              </div>
              <div className="flex flex-row justify-start items-center">
                <label className=" text-white w-1/4 text-lg">Email</label>
                <input
                  type="email"
                  placeholder="m@example.com"
                  className="w-3/4 bg-transparent border-b-2 border-gray-700 text-white outline-none"
                />
              </div>
              <div className="flex flex-row justify-start items-center">
                <label className=" text-white w-1/4 text-lg">Contact</label>
                <input
                  type="text"
                  placeholder="123456789"
                  className="w-3/4 bg-transparent border-b-2 border-gray-700 text-white outline-none"
                />
              </div>
              <div className="flex flex-row justify-between items-center">
                <label className=" text-white text-lg">Skills</label>
                <div className="relative w-3/4">
                  <button
                    type="button"
                    onClick={() => setSkillsOpen(!skillsOpen)}
                    className="w-full bg-transparent border-b-2 border-gray-700 text-left text-gray-400 outline-none flex justify-start items-center"
                  >
                    {selectedSkills.length > 0
                      ? selectedSkills.join(", ")
                      : "Select Skills"}
                    <span className="ml-2">▼</span>
                  </button>
                  {skillsOpen && (
                    <ul className="absolute left-0 top-full w-full bg-zinc-800 text-white mt-2 rounded-md shadow-md z-10 text-xs">
                      {skillsList.map((skill) => (
                        <li
                          key={skill}
                          className={`px-4 py-2 cursor-pointer hover:bg-zinc-700 ${
                            selectedSkills.includes(skill) ? "bg-zinc-700" : ""
                          }`}
                          onClick={() => toggleSkill(skill)}
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-start items-center">
                <label className=" text-white w-1/4 text-lg">API Key</label>
                <input
                  type="text"
                  placeholder="Enter Monkeytype API Key"
                  className="w-3/4 bg-transparent border-b-2 border-gray-700 text-white outline-none"
                />
              </div>
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  className="bg-zinc-700 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-zinc-700 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </Protectedroutes>
  );
}
