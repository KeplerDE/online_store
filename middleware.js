import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define the paths to protect
export const config = {
  matcher: [
    "/dashboard/user/:path*",
    "/dashboard/admin/:path*",
    "/api/user/:path*",
    "/api/admin/:path*",
  ],
};

export default withAuth(
  async function middleware(req) {
    const url = req.nextUrl.pathname;
    const userRole = req?.nextauth?.token?.user?.role;

    // Redirect non-admin users trying to access admin paths
    if (url?.includes("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Continue with the request if the user is authorized
    return NextResponse.next();
  },
  {
    callbacks: {
      // Check if the user is authenticated
      authorized: ({ token }) => !!token,
    },
  }
);
