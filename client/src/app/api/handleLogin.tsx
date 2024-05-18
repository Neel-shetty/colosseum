import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  email: string;
  password: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | { error: any }>) {
  try {
    const { email, password } = req.body;
    console.log(email,password)

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const result = await response.json();

    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
}
