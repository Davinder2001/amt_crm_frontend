// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { authRoutes, adminRoutes, employeeRoutes, publicRoutes } from '@/routes';

// export function middleware(request: NextRequest) {
//   const laravelSession = request.cookies.get('access_token');
//   let companySlug = request.cookies.get('company_slug')?.value;
//   const userType = request.cookies.get('user_type')?.value;
//   const { pathname } = request.nextUrl;

//   // ✅ Treat string "undefined" as a missing value
//   if (companySlug === 'undefined' || companySlug === '') {
//     companySlug = undefined;
//   }
//   // ✅ Allow access to public routes (even if not logged in)
//   if (publicRoutes.includes(pathname)) {
//     return NextResponse.next();
//   }
//   // If not logged in → Redirect to /login (except for /login itself)
//   if (!laravelSession) {
//     if (!authRoutes.includes(pathname)) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//     return NextResponse.next();
//   }

//   if (laravelSession) {
//     // ✅ Handle superadmin redirection separately
//     if (userType === 'super-admin') {
//       if (
//         adminRoutes(companySlug || '').some((route) => pathname.startsWith(route)) ||
//         authRoutes.includes(pathname) ||
//         !pathname.startsWith('/superadmin') || pathname === '/' || pathname === '/superadmin'
//       ) {
//         return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
//       }
//       return NextResponse.next();
//     }

//     // ✅ Handle admin/employee redirection
//     if (['admin', 'employee'].includes(userType || '')) {
//       // ✅ Allow access to "/" after login only for admins
//       if (userType === 'admin' && pathname === '/') {
//         return NextResponse.next();
//       }

//       // Employees should not access root path "/"
//       if (userType === 'employee' && pathname === '/') {
//         return NextResponse.redirect(new URL(`/${companySlug}/dashboard`, request.url));
//       }

//       // 👉 Redirect to "/" if:
//       // - `companySlug` is null/undefined/empty
//       // - OR pathname doesn't start with `/${companySlug}`
//       if (!companySlug || !pathname.startsWith(`/${companySlug}`)) {
//         return NextResponse.redirect(new URL('/', request.url));
//       }

//       // 👉 Redirect to `/${companySlug}/dashboard` if the path is exactly `/${companySlug}`
//       if (pathname === `/${companySlug}`) {
//         return NextResponse.redirect(new URL(`/${companySlug}/dashboard`, request.url));
//       }

//       return NextResponse.next();
//     }

//     // Allow other users to continue to their pages
//     if (['user'].includes(userType || '')) {
//       // ✅ Allow access to public routes (even if not logged in)
//       if (publicRoutes.includes(pathname)) {
//         return NextResponse.next();
//       }
//       return NextResponse.next();
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/'],
// };












import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authRoutes, publicRoutes } from '@/routes';

export function middleware(request: NextRequest) {
  const laravelSession = request.cookies.get('access_token');
  let companySlug = request.cookies.get('company_slug')?.value;
  const userType = request.cookies.get('user_type')?.value;
  const { pathname } = request.nextUrl;

  // ✅ Treat string "undefined" as a missing value
  if (companySlug === 'undefined' || companySlug === '') {
    companySlug = undefined;
  }
  // ✅ Allow access to public routes (even if not logged in)

  // If not logged in → Redirect to /login (except for /login itself)
  if (!laravelSession) {
    if (!authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  if (laravelSession) {
    const isSuperAdminPath = pathname.startsWith('/superadmin');
    const isAdminPath = pathname.startsWith(`/${companySlug}`) && !pathname.includes('/employee');
    const isEmployeePath = pathname.startsWith(`/${companySlug}/employee`);

    if (userType === 'super-admin') {

      // Super admin can ONLY access /superadmin/*
      if (!isSuperAdminPath || pathname === "/login" || pathname === "/") {
        return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    if (userType === 'admin') {

      // 👉 Redirect to "/" if:
      // - `companySlug` is null/undefined/empty
      // - OR pathname doesn't start with `/${companySlug}`
      if (!companySlug || !pathname.startsWith(`/${companySlug}`)) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      // ✅ Allow access to "/" after login only for admins
      if (laravelSession && pathname === '/') {
        return NextResponse.next();
      }
      // Admin can ONLY access their own company routes and not /employee or /superadmin
      if (!companySlug || !isAdminPath || pathname.includes('/employee') || isSuperAdminPath || pathname === `/${companySlug}` || publicRoutes.includes(pathname) || pathname === "/login") {
        return NextResponse.redirect(new URL(`/${companySlug}/dashboard`, request.url));
      }
      return NextResponse.next();
    }

    if (userType === 'employee') {
      // Employee can ONLY access their company's /employee routes
      if (!pathname.startsWith(`/${companySlug}`) || !companySlug || !isEmployeePath || isSuperAdminPath || pathname === `/${companySlug}` || pathname === "/" || pathname === "/login") {
        return NextResponse.redirect(new URL(`/${companySlug}/employee/dashboard`, request.url));
      }
      return NextResponse.next();
    }

    if (userType === 'user') {
      // You can customize this logic based on what normal users should access
      // Right now, blocking them from all protected routes
      if (!publicRoutes.includes(pathname) || pathname === "/login") {
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
