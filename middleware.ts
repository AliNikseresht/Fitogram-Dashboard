import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isDashboardRoot = pathname === "/dashboard";
  const isProtectedDashboard = pathname.startsWith("/dashboard");
  const isHomePage = pathname === "/";

  if (!session && (isProtectedDashboard || isHomePage)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session && isAuthPage) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    const targetPath =
      profile?.role === "coach" ? "/dashboard/coaches" : "/dashboard/users";

    return NextResponse.redirect(new URL(targetPath, req.url));
  }

  if (session && isDashboardRoot) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    const targetPath =
      profile?.role === "coach" ? "/dashboard/coaches" : "/dashboard/users";

    return NextResponse.redirect(new URL(targetPath, req.url));
  }

  if (session && isHomePage) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    const targetPath =
      profile?.role === "coach" ? "/dashboard/coaches" : "/dashboard/users";

    return NextResponse.redirect(new URL(targetPath, req.url));
  }

  return res;
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/dashboard", "/login", "/register"],
};
