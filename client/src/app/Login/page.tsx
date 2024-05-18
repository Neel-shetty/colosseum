"use client"

import Link from "next/link"
import { useState,FormEvent } from "react"
import axios from "axios"



import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


  



export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const data = { email, password };

    try {
      const response = await fetch("/api/handleLogin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const result = await response.json();
      console.log(result)
      setMessage(result.message || "Login successful");
    } catch (error) {
      console.log(error)
      setMessage(error?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center p-20">
    <Card className="mx-auto max-w-sm px-9 bg-slate-100">
      <CardHeader >
        <CardTitle className="text-2xl text-center ">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent >
        <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center mt-5">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full mt-10" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
          </Button>
         
          </div>
          </form>
          {message && (
            <div className="mt-4 text-center text-sm text-red-500">
              {message}
            </div>
          )}
        
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
      
    </Card>
    </div>
  );
}
