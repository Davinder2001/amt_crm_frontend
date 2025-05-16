export const publicRoutes = ['/', '/about', '/contact', '/privacy-policy', '/terms-services', '/refund', '/shipping-policy', '/investment-research', '/manual', '/archives', '/other-calculators', '/team', '/careers', '/faq', '/newsroom', '/security', '/disclosures', '/payment-confirm'];

export const authRoutes = ['/', '/login', '/forget-password', '/register-your-company', '/payment-confirm'];

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
