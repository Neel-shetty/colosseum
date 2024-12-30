"use client";
import Protectedroutes from "@/app/protectedroutes";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/authcontext";
import dynamic from "next/dynamic";

type ProfileData = {
  name: string;
  email: string;
  phoneNumber: string;
  about: string;
  skills: string[]; 
  profilePic: File | null;
  monkeyTypeApiKey: string;
};



export default function Page() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phoneNumber: "",
    about: "",
    skills: [],
    profilePic: null as File | null,
    monkeyTypeApiKey: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userId,setUserId]=useState<string |null>(null);
  const router = useRouter();
  
  const api=process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(()=>{
    if(typeof window !="undefined"){const storeUserId=localStorage.getItem("userId");
      setUserId(storeUserId);}
    
  },[]);
  

  useEffect(() => {
    
    const fetchProfile = async () => {

      
      try {
        const response = await fetch(`${api}/user`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data && data.user)
          setProfileData({
            ...data.user,
            skills: Array.isArray(data.user.skills) ? data.user.skills : [],
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
    router.push(`/pages/profile?userId=${userId}`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    formData.append("phoneNumber", profileData.phoneNumber);
    formData.append("about", profileData.about);
    formData.append("monkeyTypeApiKey", profileData.monkeyTypeApiKey);

    profileData.skills.forEach((value) => {
      formData.append("skills", value);
    });

    if (profileData.profilePic) {
      formData.append("profilePic", profileData.profilePic);
    }
    console.log("Sending the following data:");
    formData.forEach((value, key) => console.log(key, value));

    try {
      const response = await fetch(`${api}/user`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
      const updatedData = await response.json();
      if (updatedData.status === "success") {
        setIsEditing(false);
        router.push(`/pages/profile?userId=${userId}`);
      } else {
        console.error("Error saving profile data:", updatedData);
        setErrorMessage(`Error saving profile data: ${updatedData.message}`);
      }
    } catch (error) {
      console.error("Error during save:", error);
    }
  };

  return (
    <Protectedroutes>
      <div className="flex flex-col items-center bg-bg-color min-h-screen py-10 px-4">
        <Card className="mx-auto w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl bg-zinc-950 p-6 rounded-md shadow-xl text-white shadow-slate-950 border border-zinc-950 p-8 sm:p-6">
          <h1 className="text-2xl font-bold text-center mb-12 sm:mb-8 md:mb-16 text-white">
            Edit Your Profile
          </h1>
          <form onSubmit={handleSave}>
            <div className="flex flex-col gap-8 sm:gap-6 md:gap-10">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <label className="text-white w-full sm:w-1/4 text-lg">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  placeholder={profileData.name}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full sm:w-3/4 bg-transparent border-b-2 border-gray-700 text-white outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <label className="text-white w-full sm:w-1/4 text-lg">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  placeholder={profileData.email}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="w-full sm:w-3/4 bg-transparent border-b-2 border-gray-700 text-white outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <label className="text-white w-full sm:w-1/4 text-lg">Contact</label>
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
                  className="w-full sm:w-3/4 bg-transparent border-b-2 border-gray-700 text-white outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <label className="text-white w-full sm:w-1/4 text-lg">Skills</label>
                <input
                  type="text"
                  value={isEditing ? profileData.skills.join(",") : ""}
                  placeholder=" [Enter comma separated values(Ex: skill1,skill2)]"
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      skills: e.target.value.split(",").map((skill) => skill.trim()),
                    })
                  }
                  className="w-full sm:w-3/4 bg-transparent border-b-2 border-gray-700 text-white outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <label className="text-white w-full sm:w-1/4 text-lg">About</label>
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
                  className="w-full sm:w-3/4 bg-transparent border rounded-sm border-gray-700 text-white outline-none resize-none"
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
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover mb-4"
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

              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <label className="text-white w-full sm:w-1/4 text-lg">API Key</label>
                <input
                  type="text"
                  placeholder="Enter Monkeytype API Key"
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      monkeyTypeApiKey: e.target.value,
                    })
                  }
                  className="w-full sm:w-3/4 bg-transparent border-b-2 border-gray-700 text-white outline-none"
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
