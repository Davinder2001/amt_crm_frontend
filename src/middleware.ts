import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authRoutes, adminEmployeeRoutes } from '@/routes';

export function middleware(request: NextRequest) {
  const laravelSession = request.cookies.get('access_token');
  let companySlug = request.cookies.get('company_slug')?.value;
  const userType = request.cookies.get('user_type')?.value;
  const { pathname } = request.nextUrl;

  // ✅ Treat string "undefined" as a missing value
  if (companySlug === 'undefined' || companySlug === '') {
    companySlug = undefined;
  }

  // If not logged in → Redirect to /login (except for /login itself)
  if (!laravelSession) {
    if (pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  if (laravelSession) {
    // ✅ Allow access to "/" after login
    if (pathname === '/') {
      return NextResponse.next();
    }

    // ✅ Handle superadmin redirection separately
    if (userType === 'superadmin') {
      if (
        adminEmployeeRoutes(companySlug || '').some((route) => pathname.startsWith(route)) ||
        authRoutes.includes(pathname) || 
        !pathname.startsWith('/superadmin')
      ) {
        return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // ✅ Handle admin/employee/user redirection
    if (['admin', 'employee', 'user'].includes(userType || '')) {
      // 👉 Redirect to "/" if:
      // - `companySlug` is null/undefined/empty
      // - OR pathname doesn't start with `/${companySlug}`
      if (!companySlug || !pathname.startsWith(`/${companySlug}`)) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // 👉 Redirect to `/${companySlug}/dashboard` if the path is exactly `/${companySlug}`
      if (pathname === `/${companySlug}`) {
        return NextResponse.redirect(new URL(`/${companySlug}/dashboard`, request.url));
      }

      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/'],
};