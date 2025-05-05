// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';
// import { useFetchProfileQuery } from '@/slices/auth/authApi';
// import { clearStorage, useCompany } from '@/utils/Company';

// type UserContextType = {
//   user: UserProfile | null;
//   setUser: (user: UserProfile | null) => void;
// };

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const { accessToken } = useCompany();

//   // Only fetch profile if accessToken exists
//   const { data, isLoading, refetch } = useFetchProfileQuery(undefined, {
//     skip: !accessToken,
//   });

//   const [user, setUser] = useState<UserProfile | null>(null);

//   useEffect(() => {
//     if (accessToken && !data && !isLoading) {
//       refetch();
//     } else if (data?.user) {
//       setUser(data.user);
//     }
//   }, [accessToken, data, isLoading, refetch]);

//   useEffect(() => {
//     if (data?.user) {
//       setUser(data.user);
//     }
//   }, [data]);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };












'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useFetchProfileQuery } from '@/slices/auth/authApi';
import { clearStorage, useCompany } from '@/utils/Company';
import { useRouter } from 'next/navigation';

type UserContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useCompany();
  const router = useRouter();

  const {
    data,
    error,
    isLoading,
    refetch,
  } = useFetchProfileQuery(undefined, {
    skip: !accessToken,
  });

  const [user, setUser] = useState<UserProfile | null>(null);

  // 🔐 If API returns 401, clear storage and optionally redirect to login
  useEffect(() => {
    if (error && 'status' in error && error.status === 401) {
      clearStorage();
      setUser(null);
      router.push('/login'); // optional: redirect to login
    }
  }, [error, router]);

  useEffect(() => {
    if (accessToken && !data && !isLoading) {
      refetch();
    } else if (data?.user) {
      setUser(data.user);
    }
  }, [accessToken, data, isLoading, refetch]);


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
