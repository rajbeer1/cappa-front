import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public and protected paths
  const publicPaths = ['/', '/sign-up'];
  const protectedPaths = ['/data', '/home', '/map', '/photo'];

  // Check if the current path is public or protected
  const isPublicPath = publicPaths.includes(path);
  const isProtectedPath = protectedPaths.includes(path);

  // Extract Bearer token from Authorization header
  const token = request.cookies.get('user')?.value || '';

  // Redirect logic
  if (isPublicPath && token) {
    // If the user is trying to access a public path and has a token, redirect to home
    return NextResponse.redirect(new URL('/home', request.nextUrl));
  }

  if (isProtectedPath && !token) {
    // If the user is trying to access a protected path without a token, redirect to login
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // Continue with the normal flow for any other case
  return NextResponse.next();
}

// Matcher configuration for the middleware
export const config = {
  matcher: [
    '/sign-up', // Public path
    '/', // Public path

    '/data', // Protected path
    '/home',
    '/map',
    '/photo',
  ],
};
