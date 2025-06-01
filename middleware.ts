import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { pathname } = req.nextUrl;

  const publicRoutes = ["/login", "/register", "/profile", "/verify-email"];
  if (publicRoutes.includes(pathname)) return res;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || Date.now() >= (session.expires_at || 0) * 1000) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userId = session.user.id;
  const userRole = session.user.user_metadata?.role;
  let isProfileIncomplete = false;
  let profileExists = false;

  if (userRole === "user") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("height, weight, goal")
      .eq("id", userId)
      .single();

    if (!profile) {
      profileExists = false;
    } else {
      profileExists = true;
      isProfileIncomplete = !profile.height || !profile.weight || !profile.goal;
    }
  }

  if (userRole === "coach") {
    const { data: coachProfile } = await supabase
      .from("coaches")
      .select("full_name, bio, specialization")
      .eq("id", userId)
      .single();

    if (!coachProfile) {
      profileExists = false;
    } else {
      profileExists = true;
      isProfileIncomplete =
        !coachProfile.full_name ||
        !coachProfile.bio ||
        !coachProfile.specialization;
    }
  }

  if (!profileExists) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isProfileIncomplete && pathname !== "/profile") {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  if (pathname.startsWith("/users/dashboard") && userRole !== "user") {
    return NextResponse.redirect(new URL("/coaches/dashboard", req.url));
  }

  if (pathname.startsWith("/coaches/dashboard") && userRole !== "coach") {
    return NextResponse.redirect(new URL("/users/dashboard", req.url));
  }

  if (pathname === "/") {
    if (userRole === "user") {
      return NextResponse.redirect(new URL("/users/dashboard", req.url));
    } else if (userRole === "coach") {
      return NextResponse.redirect(new URL("/coaches/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/users/dashboard/:path*",
    "/coaches/dashboard/:path*",
    "/login",
    "/register",
    "/profile",
    "/verify-email",
  ],
};
