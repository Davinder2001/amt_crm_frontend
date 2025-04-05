'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useFetchProfileQuery } from '@/slices/auth/authApi';

interface Company {
  id: number;
  admin_id: number;
  company_id: string;
  company_name: string;
  company_slug: string;
  created_at: string;
  payment_status: string;
  updated_at: string;
  verification_status: string;
  [key: string]: string | number;
}

interface User {
  id: number;
  name: string;
  number: string;
  company_id: number;
  company_name: string;
  company_slug: string;
  meta: { [key: string]: string | number | boolean | object };
  user_type: "admin" | "employee" | "user" | "superadmin";
  password: string;
  companies: Company[];
}

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useFetchProfileQuery();
  const [user, setUser] = useState<User | null>(data?.user || null);

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
