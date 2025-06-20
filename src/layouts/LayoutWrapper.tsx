'use client';

import { useUser } from '@/provider/UserContext';
import layoutMap from './layoutMap';
import AuthLayout from '@/layouts/AuthLayout';
import Loader from '@/components/common/Loader';

type LayoutWrapperProps = {
  children: React.ReactNode;
};

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const { user, authChecked , loadingComplete} = useUser();
  const role = user?.user_type;

  if (!authChecked || !loadingComplete) { 
    return <Loader isLoading={!loadingComplete} />; 
  }

  const SelectedLayout = role ? layoutMap[role] : AuthLayout;
  return <SelectedLayout>{children}</SelectedLayout>;
};

export default LayoutWrapper;