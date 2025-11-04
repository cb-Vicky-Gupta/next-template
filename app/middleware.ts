import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { publicPaths, routePermissions } from "./middleware/roles";
import { getUserRole } from "./middleware/auth";

const PUBLIC_PATHS = publicPaths;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const role = getUserRole(request);

  // Not logged in
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Find matching route permission
  const matchedRoute = routePermissions.find((route) =>
    pathname.startsWith(route.path.replace("/:path*", ""))
  );

  // If route has no permission rule, allow by default
  if (!matchedRoute) return NextResponse.next();

  // Role not allowed
  if (!matchedRoute.rolesAllowed.includes(role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: routePermissions.map((r) => r.path),
};
