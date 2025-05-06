'use client';

import { useUser } from '@/provider/UserContext';
import layoutMap from './layoutMap';
import AuthLayout from '@/layouts/AuthLayout';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';
import { useCompany } from '@/utils/Company';
import { useEffect, useState } from 'react';
import Loader from '@/components/common/Loader';

type LayoutWrapperProps = {
  children: React.ReactNode;
};

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const { accessToken } = useCompany();
  const { user } = useUser();
  const role = user?.user_type;
  const [mounted, setMounted] = useState(false);

  const { isFetching } = useFetchSelectedCompanyQuery(undefined, {
    skip: !accessToken,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const SelectedLayout = role ? layoutMap[role] : AuthLayout;

  if (!mounted || isFetching) {
    return <Loader />
  }

  return <SelectedLayout>{children}</SelectedLayout>;
};

export default LayoutWrapper;