"use client";
import Protectedroutes from "@/app/protectedroutes";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Page() {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    about: "",
    skills: [],
    profilePic: null as File|null,
    monkeyTypeApiKey: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/user", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data && data.user) setProfileData({
          ...data.user,
          skills: data.user.skills || [],
          profilePic: null,
        });
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData({ ...profileData, profilePic: file });
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    router.push("/pages/profile");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    
    formData.append('name', profileData.name);
    formData.append('email', profileData.email);
    formData.append('phoneNumber', profileData.phoneNumber);
    formData.append('about', profileData.about);
    
    
    const skills = Array.isArray(profileData.skills)
    ? profileData.skills
    : profileData.skills.split(",").map((skill) => skill.trim());
formData.append("skills", JSON.stringify(skills));
    
    
    if (profileData.profilePic) {
      formData.append('profilePic', profileData.profilePic);
    }
    console.log("Sending the following data:");
    formData.forEach((value, key) => console.log(key, value));
    
    try {
      console.log("FormData being sent:", Object.fromEntries(formData.entries()));
      const response = await fetch("http://localhost:3000/user", {
        method: "PATCH",
        credentials: "include",
        
        body: formData,
      });
      const updatedData = await response.json();
      if (updatedData.status === "success") {
        
        setIsEditing(false);
        router.push("/pages/profile");
      } else {
        console.error("Error saving profile data:", updatedData);
        setErrorMessage(`Error saving profile data: ${updatedData.message}`);
      }
    } catch (error) {
      console.error("Error during save :", error);
    }
  };

  return (
    <Protectedroutes>
      <div className="flex flex-col items-center bg-bg-color min-h-screen py-10 ">
        <Card className="mx-auto max-w-4xl w-full bg-zinc-950 p-6 rounded-md shadow-xl text-white shadow-slate-950 border border-zinc-950 p-10 ">
          <h1 className="text-2xl font-bold text-center mb-12 text-white">
            Edit Your Profile
          </h1>
          <form onSubmit={handleSave}>
            <div className="flex flex-col gap-12">
              <div className="flex flex-row justify-start items-center mt-10">
                <label className=" text-white w-1/4 text-lg">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  placeholder={profileData.name}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-3/4 bg-transparent border-b-2 border-gray-700 text-white outline-none"
                />
              </div>
              <div className="flex flex-row justify-start items-center">
                <label className=" text-white w-1/4 text-lg">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  placeholder={profileData.email}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="w-3/4 bg-transparent border-b-2 border-gray-700 text-white outline-none"
                />
              </div>
              <div className="flex flex-row justify-start items-center">
                <label className=" text-white w-1/4 text-lg">Contact</label>
                <input
                  type="text"
                  value={profileData.phoneNumber}
                  placeholder={profileData.phoneNumber}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-3/4 bg-transparent border-b-2 border-gray-700 text-white outline-none"
                />
              </div>
              <div className="flex flex-row justify-between items-center">
                <label className=" text-white text-lg">Skills</label>

                <input
                  type="text"
                  value={Array.isArray(profileData.skills) 
                    ? profileData.skills.join(', ') 
                    : profileData.skills}
                  placeholder={profileData.skills}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({ ...profileData, skills: e.target.value })
                  }
                  className="w-3/4 bg-transparent border-b-2 border-gray-700 text-white outline-none"
                />
              </div>
              <div className="flex flex-row justify-start items-center">
                <label className="text-white w-1/4 text-lg">About</label>
                <textarea
                  value={profileData.about}
                  placeholder={profileData.about}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      about: e.target.value,
                    })
                  }
                  className="w-3/4 bg-transparent border rounded-sm border-gray-700 text-white outline-none resize-none"
                  rows={4}
                />
              </div>
              <div className="flex flex-col items-center mb-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={!isEditing}
                  className="hidden"
                  id="profilePicInput"
                />
                {previewImage && (
                  <img 
                    src={previewImage} 
                    alt="Profile Preview" 
                    className="w-40 h-40 rounded-full object-cover mb-4"
                  />
                )}
                {isEditing && (
                  <label 
                    htmlFor="profilePicInput" 
                    className="bg-zinc-700 text-white px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer"
                  >
                    Change Profile Picture
                  </label>
                )}
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
                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="bg-zinc-700 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Edit
                  </button>
                )}
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
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
                  </>
                )}
              </div>
            </div>
          </form>
        </Card>
      </div>
    </Protectedroutes>
  );
}
