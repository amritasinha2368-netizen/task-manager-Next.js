import { NextResponse } from "next/server";

export async function POST(request) {
  const response = NextResponse.json({
    message: "Logged out !!",
    success: true,
  });

  response.cookies.set("authToken", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
