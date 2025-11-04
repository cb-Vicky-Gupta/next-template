import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routePermissions } from "./middleware/roles";
import { getUserRole } from "./middleware/auth";

export function middleware(request: NextRequest) {
  const role = getUserRole(request);
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { pathname } = request.nextUrl;

  // Check permissions for path
  for (const r of routePermissions) {
    if (pathname.startsWith(r.path.replace("/:path*", ""))) {
      if (!r.rolesAllowed.includes(role)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: routePermissions.map((r) => r.path),
};
