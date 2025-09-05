import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Signup request body:", body);

    const response = await fetch(
      "https://amenses-task-backend-production.up.railway.app/api/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    console.log("External API response status:", response.status);

    const result = await response.json();
    console.log("External API response data:", result);

    if (!response.ok) {
      throw new Error(
        result.message || `HTTPS ${response.status} Email already in use`
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { message: error.message || "Signup failed" },
      { status: 400 }
    );
  }
}
