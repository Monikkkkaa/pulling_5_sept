import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // Ensure we only send email and password
    const loginData = {
      email: body.email?.trim(),
      password: body.password,
    };

    console.log("Sending to external API:", loginData);

    const response = await fetch(
      "https://amenses-task-backend-production.up.railway.app/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      }
    );

    console.log("External API response status:", response.status);

    const result = await response.json();
    console.log("External API response data:", result);

    if (!response.ok) {
      console.error("API Error Details:", result);
      return NextResponse.json(
        { message: result.message || result.error || "Login failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
