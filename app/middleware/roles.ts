export const roles = {
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
};

export const routePermissions = [
  { path: "/admin/:path*", rolesAllowed: [roles.ADMIN] },
  { path: "/edit/:path*", rolesAllowed: [roles.ADMIN, roles.EDITOR] },
  {
    path: "/dashboard/:path*",
    rolesAllowed: [roles.ADMIN, roles.EDITOR, roles.VIEWER],
  },
];

export const publicPaths = ["/login", "/unauthorized", "/api/public"];
// matcher file where we can define roles and matcher file to give access based on roles
