'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useFetchProfileQuery } from '@/slices/auth/authApi';

type UserContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useFetchProfileQuery();
  const [user, setUser] = useState<UserProfile | null>(data?.user || null);
  
  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data, user]);

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
