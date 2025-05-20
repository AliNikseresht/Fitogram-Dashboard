import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/register", "/profile", "/verify-email"];

  if (publicRoutes.includes(pathname)) return res;

  if (!session || Date.now() >= (session.expires_at || 0) * 1000) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("height, weight, goal")
    .eq("id", session.user.id)
    .single();

  const isProfileIncomplete =
    !profile || !profile.height || !profile.weight || !profile.goal;

  if (isProfileIncomplete && pathname !== "/profile") {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  const userRole = session.user.user_metadata?.role;

  if (pathname.startsWith("/dashboard/users") && userRole !== "user") {
    return NextResponse.redirect(new URL("/dashboard/coaches", req.url));
  }

  if (pathname.startsWith("/dashboard/coaches") && userRole !== "coach") {
    return NextResponse.redirect(new URL("/dashboard/users", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/dashboard",
    "/login",
    "/register",
    "/profile",
    "/verify-email",
  ],
};
