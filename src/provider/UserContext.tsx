'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useFetchProfileQuery } from '@/slices/auth/authApi';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

type UserContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error} = useFetchProfileQuery();
  const [user, setUser] = useState<UserProfile | null>(data?.user || null);
  const router = useRouter();

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data, user, setUser]);

  // useEffect(() => {
  //   if (data?.message === "Unauthenticated.") {
  //     // Clear the user context
  //     setUser(null);

  //     // Remove cookies
  //     Cookies.remove('access_token');
  //     Cookies.remove('user_type');
  //     Cookies.remove('company_slug');

  //     // Redirect to login page
  //     router.push('/login');
  //   }
  // }, [user, data, error, router])

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
