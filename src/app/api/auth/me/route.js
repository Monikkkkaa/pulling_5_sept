import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    const response = await fetch(
      "https://amenses-task-backend-production.up.railway.app/api/auth/me",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Profile API response status:", response.status);

    const result = await response.json();
    console.log("Profile API response data:", result);

    if (!response.ok) {
      console.error("Profile API Error:", result);
      return NextResponse.json(
        {
          message: result.message || result.error || "Failed to fetch profile",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
