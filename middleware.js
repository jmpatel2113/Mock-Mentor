import { clerkMiddleware } from "@clerk/nextjs/server";
import { createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)',
]);

const protectedMiddleware = clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

function isLocalTestHost(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function middleware(req, event) {
  if (process.env.E2E_AUTH_BYPASS === "true" && isLocalTestHost(req.nextUrl.hostname)) {
    return NextResponse.next();
  }

  return protectedMiddleware(req, event);
}

export default middleware;

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
