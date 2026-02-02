// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   function proxy(request) {
//     const { pathname } = request.nextUrl;
//     const token = request.nextauth.token;
//     const isAdmin = token?.role === "ADMIN";

//     // 1. Admin logged in - redirect away from non-admin routes
//     if (isAdmin) {
//       // Block admins from all non-admin routes (including login, signup, home, etc.)
//       if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
//         return NextResponse.redirect(new URL("/admin/dashboard", request.url));
//       }
//     }

//     // 2. Regular user logged in - redirect away from login/signup
//     if (token && !isAdmin) {
//       if (pathname === "/login" || pathname === "/signup") {
//         return NextResponse.redirect(new URL("/", request.url));
//       }
//     }

//     // 3. Non-admin user trying to access admin routes
//     if (!isAdmin && pathname.startsWith("/admin")) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }

//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         const { pathname } = req.nextUrl;

//         // API auth routes - always allow (NextAuth needs these)
//         if (pathname.startsWith("/api/auth")) {
//           return true;
//         }

//         // Login and signup - always allow access (redirect handled in middleware)
//         if (pathname === "/login" || pathname === "/signup") {
//           return true;
//         }

//         // Public routes - allow for non-logged in users
//         const publicRoutes = ["/", "/products", "/categories"];
//         const isPublicRoute = publicRoutes.some(route => 
//           pathname === route || pathname.startsWith(route + "/")
//         );
        
//         if (isPublicRoute) {
//           return true;
//         }

//         // All other routes (including admin) require authentication
//         return !!token;
//       },
//     },
//   }
// );

// export const config = {
//   matcher: [
//     "/",
//     // "/admin/:path*",
//     // "/login",
//     // "/signup",
//     // "/products/:path*",
//     // "/categories/:path*",
//     // "/cart/:path*",
//     // "/checkout/:path*",
//     // "/account/:path*",
//   ],
// };


//This file should be place in root directory where next.config.js is present