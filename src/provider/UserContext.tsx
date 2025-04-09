'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useFetchProfileQuery } from '@/slices/auth/authApi';

type UserContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, refetch  } = useFetchProfileQuery();
  const [user, setUser] = useState<UserProfile | null>(data?.user || null);

  console.log('message:...', data?.message);
  

  // Trigger data fetch when the component mounts
  useEffect(() => {
    if (!data && !isLoading) { // If no data is present, trigger fetch manually
      refetch();
    } else if (data?.user) {
      setUser(data.user);
    }
  }, [data, isLoading, refetch]);

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data]);

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
