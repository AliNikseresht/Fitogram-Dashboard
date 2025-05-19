import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/register", "/profile"];

  if (publicRoutes.includes(pathname)) {
    return res;
  }

  if (!session || Date.now() >= (session.expires_at || 0) * 1000) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", session.user.id)
    .single();

  if (!profile && pathname !== "/profile") {
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
  ],
};
