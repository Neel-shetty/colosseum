"use client";
import React, { useState, useEffect } from "react";
import { Copy } from "lucide-react";
import Image from 'next/image';
import { useRouter } from "next/navigation";

interface FirstVisitInstructionsProps {
  onApiKeySubmit: (key: string) => void;
}

const FirstVisitInstructions: React.FC<FirstVisitInstructionsProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText("monkeytype.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      });

      const result = await response.json();

      if (result.status === "success") {
        completeOnboarding();
      } else {
        console.error("Error saving API key");
      }
    } catch (err) {
      console.error("Error during save:", err);
    }
  };

  const completeOnboarding = async () => {
    try {
      const response = await fetch("http://localhost:3000/set-onboarding", {
        method: "POST",
        credentials: "include",
      });
  
      if (response.ok) {
        router.push("/pages/leaderboard");
      } else {
        const result=await response.json();
        console.error("Failed to complete onboarding",result.message);
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-black overflow-y-auto py-10">
      <div className="bg-neutral-900 text-white rounded-xl shadow-2xl p-10 max-w-7xl w-full relative border border-neutral-700 space-y-6 my-10">
       
        <h2 className="text-4xl font-bold text-blue-400 text-center">MonkeyType API Setup</h2>
        
        <div className="flex items-center justify-center mb-4">
          <span className="mr-3 text-xl">🔗</span>
          <div className="flex items-center bg-neutral-800 rounded px-3 py-2">
            <span className="mr-2">monkeytype.com</span>
            <button 
              onClick={handleCopy} 
              className="text-blue-400 hover:text-blue-300 transition"
            >
              <Copy size={16} />
            </button>
          </div>
          {copied && <span className="ml-2 text-green-400">Copied!</span>}
        </div>
        
        <ol className="space-y-6 text-lg text-neutral-300">
          <li className="flex items-center space-x-4">
            <span className="text-2xl font-bold text-blue-400 mr-2">1.</span>
            <span>Create account & log in</span>
          </li>
          <li className="flex flex-col space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-blue-400 mr-2">2.</span>
              <span>Go to Profile → Account Settings</span>
            </div>
            <div className="w-full h-64 relative rounded-lg overflow-hidden">
              <Image 
                src="/api_instructions/cynergy_1.png" 
                alt="Account Settings" 
                fill
                className="object-cover"
              />
            </div>
          </li>
          <li className="flex flex-col space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-blue-400 mr-2">3.</span>
              <span>Select API Keys</span>
            </div>
            <div className="w-full h-64 relative rounded-lg overflow-hidden">
              <Image 
                src="/api_instructions/cynergy_2.png" 
                alt="API Keys" 
                fill
                className="object-cover"
              />
            </div>
          </li>
          <li className="flex flex-col space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-blue-400 mr-2">4.</span>
              <span>Generate a new key</span>
            </div>
            <div className="w-full h-64 relative rounded-lg overflow-hidden">
              <Image 
                src="/api_instructions/cynergy_4.png" 
                alt="Generate Key" 
                fill
                className="object-cover"
              />
            </div>
          </li>
          <li className="flex flex-col space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-blue-400 mr-2">5.</span>
              <span>Copy the generated key</span>
            </div>
            <div className="w-full h-64 relative rounded-lg overflow-hidden">
              <Image 
                src="/api_instructions/cynergy_5.png" 
                alt="Copy Key" 
                fill
                className="object-cover"
              />
            </div>
          </li>
          <li className="flex flex-col space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-blue-400 mr-2">6.</span>
              <span>Activate the key</span>
            </div>
            <div className="w-full h-64 relative rounded-lg overflow-hidden">
              <Image 
                src="/api_instructions/cynergy_6.png" 
                alt="Copy Key" 
                fill
                className="object-cover"
              />
            </div>
          </li>
        </ol>
        
        <div className="mb-6">
          <label className="block mb-2 text-neutral-400 text-lg">Paste Your API Key</label>
          <input 
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your MonkeyType API key here"
            className="w-full bg-neutral-800 border border-neutral-700 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={!apiKey.trim()}
          className="w-full bg-blue-600 text-white py-4 text-lg rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit API Key
        </button>
      </div>
    </div>
  );
};

export default FirstVisitInstructions;





