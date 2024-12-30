"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../authcontext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const { login } = useAuth();
  const api=process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const data = { email, password };

    try {
      const response = await fetch(`${api}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const result = await response.json();
      console.log(result);

      setMessage(result.message || "Login successful");
      login(result.userId);
      const onboardingResponse = await fetch(
        `${api}/check-onboarding`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!onboardingResponse.ok) {
        throw new Error("Failed to check onboarding status");
      }

      const onboardingData = await onboardingResponse.json();

      
      if (onboardingData.showOnBoarding) {
        router.push("/instructions");
      } else {
        router.push("/pages/leaderboard");
      }
    } catch (error) {
      console.log(error);
      setMessage((error as any)?.message || "An unexpected error occurred");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-10 bg-bg-color">
      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-xl mx-auto px-6 sm:px-10 py-8 sm:py-12 bg-zinc-800 shadow-xl shadow-zinc-950 border-none">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl text-center text-white">
            Login
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center mt-4">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline text-gray-400"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full mt-6 sm:mt-10 bg-zinc-900"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
          {message && (
            <div className="mt-4 text-center text-sm text-white">{message}</div>
          )}

          <div className="mt-4 text-center text-sm text-white">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
