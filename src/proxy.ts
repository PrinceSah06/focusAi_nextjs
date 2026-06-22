import { NextResponse, type NextRequest } from "next/server";

const authRoutes = ["/"];
const protectedRoutes = [
  "/home",
  "/tasks",
  "/dashboard",
  "/schedule",
  "/stats",
  "/genrate",
];

const isRouteMatch = (pathname: string, routes: string[]) => {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccessToken = Boolean(request.cookies.get("accessToken")?.value);

  if (isRouteMatch(pathname, protectedRoutes) && !hasAccessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isRouteMatch(pathname, authRoutes) && hasAccessToken) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/tasks/:path*",
    "/dashboard/:path*",
    "/schedule/:path*",
    "/stats/:path*",
    "/genrate/:path*",
  ],
};
