import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login');
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isWorkerRoute = req.nextUrl.pathname.startsWith('/worker');
    const isContractorRoute = req.nextUrl.pathname.startsWith('/contractor');

    if (isAuthPage) {
      if (isAuth) {
        if (token.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
        if (token.role === 'CONTRACTOR') {
          return NextResponse.redirect(new URL('/contractor/dashboard', req.url));
        }
        return NextResponse.redirect(new URL('/worker/dashboard', req.url));
      }
      return null;
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (isAdminRoute && token.role !== 'ADMIN') {
      if (token.role === 'CONTRACTOR') return NextResponse.redirect(new URL('/contractor/dashboard', req.url));
      return NextResponse.redirect(new URL('/worker/dashboard', req.url));
    }

    if (isContractorRoute && token.role !== 'CONTRACTOR') {
      if (token.role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      return NextResponse.redirect(new URL('/worker/dashboard', req.url));
    }

    if (isWorkerRoute && token.role !== 'WORKER') {
      if (token.role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      if (token.role === 'CONTRACTOR') return NextResponse.redirect(new URL('/contractor/dashboard', req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: () => true, // Let the custom middleware function handle all auth logic
    },
  }
);

export const config = {
  matcher: ['/worker/:path*', '/admin/:path*', '/contractor/:path*', '/login'],
};
