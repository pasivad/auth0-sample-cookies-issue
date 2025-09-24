import { getAuth0Client } from './lib/auth0';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    const auth0 = await getAuth0Client();
    const authRes = await auth0.middleware(request); // Returns a NextResponse object

    // Ensure our own middleware does not handle the `/auth` routes, auto-mounted and handled by the SDK
    // Let route handlers handle all /auth/* routes
    if (request.nextUrl.pathname.startsWith('/auth')) {
      return authRes;
    }

    // Any route that gets to this point will be considered a protected route, and require the user to be logged-in to be able to access it
    const { origin } = new URL(request.url);
    const session = await auth0.getSession(request); // Use plain auth0.getSession()

    // If the user does not have a session, redirect to login
    if (!session) {
      return NextResponse.redirect(`${origin}/auth/login`);
    }

    // If a valid session exists, continue with the response from Auth0 middleware
    return authRes;
  } catch (error) {
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/auth/login`);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
