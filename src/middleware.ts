import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authRoutes, publicRoutes } from '@/routes';

export function middleware(request: NextRequest) {
  const laravelSession = request.cookies.get('access_token');
  let companySlug = request.cookies.get('company_slug')?.value;
  const userType = request.cookies.get('user_type')?.value ?? 'user';
  const { pathname } = request.nextUrl;

  // ✅ Treat string "undefined" as a missing value
  if (companySlug === 'undefined' || companySlug === '') {
    companySlug = undefined;
  }

  // If not logged in → Redirect to /login (except for /login itself)
  if (!laravelSession) {
    if (!authRoutes.includes(pathname) && !publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  if (laravelSession) {
    const isSuperAdminPath = pathname.startsWith('/superadmin');
    const isAdminPath = pathname.startsWith(`/${companySlug}`) && !pathname.includes(`/${companySlug}/employee`);
    const isEmployeePath = pathname.startsWith(`/${companySlug}/employee`);

    if (userType === 'super-admin') {
      // ✅ Redirect super-admin if they hit "/", "/login", or any non-/superadmin route
      if (!isSuperAdminPath || pathname === '/login' || pathname === '/') {
        return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    if (userType === 'admin') {

      const selectionCount = request.cookies.get('company_selection_count')?.value;

      // 🔒 If count is set and trying to access "/", block access
      if (pathname === '/' && selectionCount && parseInt(selectionCount) > 0) {
        return NextResponse.redirect(new URL(`/${companySlug}/dashboard`, request.url));
      }

      // ✅ Allow "/" for admin
      if (pathname === '/') {
        return NextResponse.next();
      }

      // ✅ Allow /add-company route even without slug
      if (pathname === '/add-company') {
        return NextResponse.next();
      }
      // Redirect if not accessing their own company area
      if (!companySlug || !pathname.startsWith(`/${companySlug}`)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      // Block access to /employee or /superadmin paths
      if (!isAdminPath || isSuperAdminPath || pathname === `/${companySlug}` || publicRoutes.includes(pathname) || pathname === '/login') {
        return NextResponse.redirect(new URL(`/${companySlug}/dashboard`, request.url));
      }
      return NextResponse.next();
    }

    if (userType === 'employee') {
      if (pathname === '/') {
        return NextResponse.redirect(new URL(`/${companySlug}/employee/dashboard`, request.url));
      }
      if (
        !companySlug ||
        !isEmployeePath ||
        isSuperAdminPath ||
        pathname === `/${companySlug}` ||
        publicRoutes.includes(pathname) ||
        pathname === '/login'
      ) {
        return NextResponse.redirect(new URL(`/${companySlug}/employee/dashboard`, request.url));
      }
      return NextResponse.next();
    }

    if (userType === 'user') {
      // Block user from protected routes
      if (!publicRoutes.includes(pathname) || pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.next();
    }
  }


  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/'],
};
