'use client';

import { useUser } from '@/provider/UserContext';
import layoutMap from './layoutMap';
import AuthLayout from '@/layouts/AuthLayout';
import Loader from '@/components/common/Loader';

type LayoutWrapperProps = {
  children: React.ReactNode;
};

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const { user, authChecked } = useUser();
  const role = user?.user_type;

  if (!authChecked) {
    return <Loader />;
  }

  const SelectedLayout = role ? layoutMap[role] : AuthLayout;
  return <SelectedLayout>{children}</SelectedLayout>;
};

export default LayoutWrapper;