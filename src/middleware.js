import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("authToken")?.value;

  if (pathname === "/" || pathname === "/api/login" || pathname === "/api/users") {
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/signup") {
    return NextResponse.next();
  }

  if (!authToken) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        {
          message: "Access Denied !!",
          success: false,
        },
        {
          status: 401,
        }
      );
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/add-task",
    "/show-tasks",
    "/profile/:path*",
    "/api/:path*",
  ],
};
