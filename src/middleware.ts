import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  if (request.nextUrl.pathname.match("/login")) {
    if (token) return NextResponse.redirect(new URL("/", request.url));
  }

  if (request.nextUrl.pathname.match("/register")) {
    if (token) return NextResponse.redirect(new URL("/", request.url));
  }

  if (request.nextUrl.pathname.match("/profile")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/editor")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}
