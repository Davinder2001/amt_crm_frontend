import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authRoutes, adminRoutes, publicRoutes } from '@/routes';

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
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  // If not logged in → Redirect to /login (except for /login itself)
  if (!laravelSession) {
    if (!authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  if (laravelSession) {
    // ✅ Handle superadmin redirection separately
    if (userType === 'super-admin') {
      if (
        adminRoutes(companySlug || '').some((route) => pathname.startsWith(route)) ||
        authRoutes.includes(pathname) ||
        !pathname.startsWith('/superadmin') || pathname === '/' || pathname === '/superadmin'
      ) {
        return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // ✅ Handle admin/employee redirection
    if (['admin', 'employee'].includes(userType || '')) {
      // ✅ Allow access to "/" after login only for admins
      if (userType === 'admin' && pathname === '/') {
        return NextResponse.next();
      }

      // Employees should not access root path "/"
      if (userType === 'employee' && pathname === '/') {
        return NextResponse.redirect(new URL(`/${companySlug}/dashboard`, request.url));
      }

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

    // Allow other users to continue to their pages
    if (['user'].includes(userType || '')) {
      // ✅ Allow access to public routes (even if not logged in)
      if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/'],
};











// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { authRoutes, publicRoutes, adminRoutes, superAdminRoutes, employeeRoutes } from '@/routes';

// export function middleware(request: NextRequest) {
//   const laravelSession = request.cookies.get('access_token');
//   let companySlug = request.cookies.get('company_slug')?.value;
//   const userType = request.cookies.get('user_type')?.value;
//   const { pathname } = request.nextUrl;

//   // Treat 'undefined' string or empty string as undefined
//   if (!companySlug || companySlug === 'undefined' || companySlug.trim() === '') {
//     companySlug = undefined;
//   }

//   // --- If NOT logged in ---
//   if (!laravelSession) {
//     if (!authRoutes.includes(pathname)) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//     return NextResponse.next();
//   }

//   // --- Super Admin Access ---
//   if (userType === 'super-admin') {
//     const isSuperAdminRoute = pathname.startsWith('/superadmin');
//     const isAllowed = superAdminRoutes.some(route => matchWildcardRoute(route, pathname));

//     if (!isSuperAdminRoute || !isAllowed || authRoutes.includes(pathname) || adminRoutes(companySlug || '').some((route) => pathname.startsWith(route))) {
//       return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
//     }

//     return NextResponse.next();
//   }

//   // --- Admin Access ---
//   if (userType === 'admin') {
//     // ✅ Allow access to "/" after login only for admins
//     if (pathname === '/') {
//       return NextResponse.next();
//     }

//     // 👉 Redirect to "/" if:
//     // - `companySlug` is null/undefined/empty
//     // - OR pathname doesn't start with `/${companySlug}`
//     if (!companySlug || !pathname.startsWith(`/${companySlug}`)) {
//       return NextResponse.redirect(new URL('/', request.url));
//     }

//     // 👉 Redirect to `/${companySlug}/dashboard` if the path is exactly `/${companySlug}`
//     if (pathname === `/${companySlug}` || employeeRoutes(companySlug || '').some((route) => pathname.startsWith(route)) || pathname.startsWith(`/${companySlug}/employee`)) {
//       return NextResponse.redirect(new URL(`/${companySlug}/dashboard`, request.url));
//     }

//     return NextResponse.next();
//   }

//   // --- Employee Access ---
//   if (userType === 'employee') {
//     const allowed = pathname.startsWith(`/${companySlug}/employee`);

//     if (!companySlug || !allowed || authRoutes.includes(pathname) || adminRoutes(companySlug || '').some((route) => pathname.startsWith(route))) {
//       return NextResponse.redirect(new URL(`/${companySlug}/employee/dashboard`, request.url));
//     }

//     return NextResponse.next();
//   }

//   // --- Regular User Access ---
//   if (userType === 'user') {
//     if (publicRoutes.includes(pathname)) {
//       return NextResponse.next();
//     }
//     return NextResponse.next();
//   }

//   // Fallback
//   return NextResponse.next();
// }

// // Utility to match wildcards like /slug/* or /superadmin/*
// function matchWildcardRoute(routePattern: string, pathname: string): boolean {
//   const baseRoute = routePattern.replace('/*', '');
//   return pathname.startsWith(baseRoute);
// }

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/'],
// };
