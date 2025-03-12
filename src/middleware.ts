import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const laravelSession = request.cookies.get("access_token");

  // if (!laravelSession) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/hr/:path*','/store/:path*'],
};













// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { authRoutes, adminEmployeeRoutes, superAdminRoutes } from '@/routes';

// export function middleware(request: NextRequest) {
//   const laravelSession = request.cookies.get('access_token');
//   const userType = request.cookies.get('user_type')?.value;
//   const companySlug = request.cookies.get('company_slug')?.value;
//   const { pathname } = request.nextUrl;

//   // If not logged in → Only allow access to auth routes
//   if (!laravelSession) {
//     if (!authRoutes.includes(pathname)) {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
//     return NextResponse.next();
//   }

//   if (laravelSession) {
//     // Handle admin/employee/user redirection
//     if (['admin', 'employee', 'user'].includes(userType || '')) {
//       if (
//         superAdminRoutes.some((route) => pathname.startsWith(route)) ||
//         authRoutes.includes(pathname)
//       ) {
//         if (companySlug) {
//           return NextResponse.redirect(new URL(`/${companySlug}/dashboard`, request.url));
//         }
//       }
//       return NextResponse.next();
//     }

//     // Handle superadmin redirection
//     if (userType === 'superadmin') {
//       if (
//         adminEmployeeRoutes(companySlug || '').some((route) => pathname.startsWith(route)) ||
//         authRoutes.includes(pathname)
//       ) {
//         return NextResponse.redirect(new URL('/superadmin/dashboard', request.url));
//       }
//       return NextResponse.next();
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/'],
// };
