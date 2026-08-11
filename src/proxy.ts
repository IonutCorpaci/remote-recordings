import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/features/auth/utils/jwt';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Determine if the current route is public
    const isPublicRoute = 
        pathname === '/login' || 
        pathname === '/register' || 
        pathname.startsWith('/api/auth/') || 
        pathname.startsWith('/share/');

    const token = request.cookies.get('session_token')?.value;
    const isValidToken = token ? await verifyToken(token) : null;

    // Redirect to /login if a protected route is accessed without a valid token
    if (!isPublicRoute && !isValidToken) {
        // If it's an API route, return 401 instead of redirecting
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to dashboard if logged-in user tries to access login or register pages
    if (isValidToken && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - images and media (.svg, .png, .jpg, .jpeg, .gif, .webp)
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
