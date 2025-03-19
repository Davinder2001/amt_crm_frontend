'use client';

import { useUser } from '@/provider/UserContext';
import layoutMap from './layoutMap';
import AuthLayout from '@/layouts/AuthLayout';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const role = user?.user_type;
  const SelectedLayout = role ? layoutMap[role] || AuthLayout : AuthLayout;

  return <SelectedLayout>{children}</SelectedLayout>;
};

export default LayoutWrapper;
