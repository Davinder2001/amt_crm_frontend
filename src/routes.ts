export const publicRoutes = ['/', '/about', '/contact', '/privacy-policy'];

export const authRoutes = ['/', '/login', '/forget-password', '/register-your-company'];

//  Dynamic routes for admin and employee
export const adminRoutes = (slug?: string) => [
  ...(slug ? [`/${slug}/*`] : []), //  Handle all nested admin/employee routes
];

export const employeeRoutes = (slug?: string) => [
  ...(slug ? [`/${slug}/employee/*`] : []), //  Handle all nested admin/employee routes
];

//  Superadmin routes
export const superAdminRoutes = [
  '/superadmin/*', //  Handle all nested superadmin routes
];
