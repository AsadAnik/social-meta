import { NextRequest, NextResponse } from "next/server";

/**
 * The Global Middleware Function for Application
 * @param req
 */
export function middleware(req: NextRequest) {
    const accessToken = req.headers.get("authorization")?.split(" ")[1];

    const publicPaths = ["/login", "/register"];
    const protectedPaths = ["/dashboard", "/profile", "/settings"];

    const { pathname } = req.nextUrl;

    // ⛔ If user is logged in, prevent access to login/register
    if (accessToken && publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // 🔒 If user is NOT logged in, redirect from protected routes
    if (!accessToken && protectedPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

// 🌍 Apply middleware to specific paths
export const config = {
    matcher: ["/login", "/register", "/dashboard", "/profile", "/settings"],
};
