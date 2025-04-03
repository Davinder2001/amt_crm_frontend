export const publicRoutes = ['/*']

export const authRoutes = ['/login', '/forget-password', '/register-your-company'];

//  Dynamic routes for admin and employee
export const adminEmployeeRoutes = (slug?: string) => [
  ...(slug ? [`/${slug}/*`] : []), //  Handle all nested admin/employee routes
];

//  Superadmin routes
export const superAdminRoutes = [
  '/superadmin/*', //  Handle all nested superadmin routes
];
