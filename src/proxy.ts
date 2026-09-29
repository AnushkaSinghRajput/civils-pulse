import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/pyq", "/mocks", "/admin"];
const adminPrefixes = ["/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const session = await auth();
  if (!session?.user) {
    const login = new URL("/login", request.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  const needsAdmin = adminPrefixes.some((p) => pathname.startsWith(p));
  if (needsAdmin && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/pyq/:path*", "/mocks/:path*", "/admin/:path*"],
};
