'use client';

import { useUser } from '@/provider/UserContext';
import layoutMap from './layoutMap';
import AuthLayout from '@/layouts/AuthLayout';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import Loader from '@/components/common/Loader';

type LayoutWrapperProps = {
  children: React.ReactNode;
};

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const { isFetching} = useFetchSelectedCompanyQuery();
  const { user } = useUser();
  const role = user?.user_type;

  // Fallback layout in case role is not defined or there is an error
  const SelectedLayout = role ? layoutMap[role] || AuthLayout : AuthLayout;

  if (isFetching) {
    return <Loader/>;  // You can replace this with a spinner or placeholder
  }
  return <SelectedLayout>{children}</SelectedLayout>;
};

export default LayoutWrapper;
