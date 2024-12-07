"use client"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useState, FormEvent } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useAuth } from "../authcontext"


export default function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const[year,setYear]=useState("");
  const[branch,setBranch]=useState("");  
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const userData = new FormData();
    userData.append("name",firstName);
    userData.append("email",email);
    userData.append("password",password);
    userData.append("phoneNumber",phoneNumber);
    userData.append("year",year);
    userData.append("branch",branch);

    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        credentials:"include",
        body: userData,
      });

      if (!response.ok) {
        const errorData = await response.json();
      console.error('Signup error:', errorData);
        throw new Error("signup failed");
      }

      const result = await response.json();
      console.log(result)
      
      router.push("/login");

    } catch (error) {
      console.error('Detailed error:', error);
      setMessage(error?.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-20 bg-bg-color">
      <Card className="mx-auto max-w-xl w-full px-16 py-12 bg-zinc-800 shadow-xl shadow-zinc-950 border-none">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name" className="text-white">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="Max"
                    value={firstName}
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone-number" className="text-white">Phone Number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="1234567890"
                  value={phoneNumber}
                  required
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="year" className="text-white">Year</Label>
                <Input
                  id="year"
                  type="text"
                  placeholder="(1/2/3/4)"
                  value={year}
                  required
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch" className="text-white">Branchr</Label>
                <Input
                  id="branch"
                  type="text"
                  placeholder="CSE"
                  value={branch}
                  required
                  onChange={(e) => setBranch(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full mt-10 bg-zinc-900">
                Create an account
              </Button>
              
            </div>

            <div className="mt-4 text-center text-sm text-white">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </form>
          {message && (
            <div className="mt-4 text-center text-sm text-white">{message}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
