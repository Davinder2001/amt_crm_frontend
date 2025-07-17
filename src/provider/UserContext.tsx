'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useFetchProfileQuery } from '@/slices';
import { clearStorage, useCompany } from '@/utils/Company';
import Loader from '@/components/common/Loader';
import { useRouter } from 'next/navigation';

type UserContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  authChecked: boolean;
  loadingComplete: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useCompany();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const router = useRouter();

  const { data, error } = useFetchProfileQuery(undefined, {
    skip: !accessToken,
  });

  useEffect(() => {
    if (accessToken) {
      if (data?.user) {
        setUser(data.user);
        setAuthChecked(true);
        setLoadingComplete(true);
      } else if (error) {
        // Only handle status if error is FetchBaseQueryError
        if ('status' in error && error.status === 401) {
          clearStorage();
          setUser(null);
          router.push('/login')
        }
        setAuthChecked(true);
        setLoadingComplete(true);
      }
    } else {
      setAuthChecked(true);
      setLoadingComplete(true);
    }
  }, [accessToken, data, error, router]);

  if (!authChecked || (!loadingComplete && accessToken)) {
    return <Loader />;
  }

  return (
    <UserContext.Provider value={{ user, setUser, authChecked, loadingComplete }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};