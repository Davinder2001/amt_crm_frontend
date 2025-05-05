// 'use client';

// import { useUser } from '@/provider/UserContext';
// import layoutMap from './layoutMap';
// import AuthLayout from '@/layouts/AuthLayout';
// import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
// import Loader from '@/components/common/Loader';

// type LayoutWrapperProps = {
//   children: React.ReactNode;
// };

// const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
//   const { isFetching } = useFetchSelectedCompanyQuery();
//   const { user } = useUser();
//   const role = user?.user_type;

//   // Fallback layout in case role is not defined or there is an error
//   const SelectedLayout = role ? layoutMap[role] : AuthLayout;

//   if (role !== 'user' && isFetching) {
//     return <Loader />;
//   }
//   return <SelectedLayout>{children}</SelectedLayout>;
// };

// export default LayoutWrapper;


















'use client';

import { useUser } from '@/provider/UserContext';
import layoutMap from './layoutMap';
import AuthLayout from '@/layouts/AuthLayout';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import Loader from '@/components/common/Loader';
import { useCompany } from '@/utils/Company';

type LayoutWrapperProps = {
  children: React.ReactNode;
};

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const { accessToken } = useCompany();
  const { user } = useUser();
  const role = user?.user_type;

  // Only fetch company info if accessToken exists
  const { isFetching } = useFetchSelectedCompanyQuery(undefined, {
    skip: !accessToken,
  });

  // Fallback layout in case role is not defined or there's an error
  const SelectedLayout = role ? layoutMap[role] : AuthLayout;

  if (isFetching) {
    return <Loader />;
  }

  return <SelectedLayout>{children}</SelectedLayout>;
};

export default LayoutWrapper;
