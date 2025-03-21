'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define context type
interface BreadcrumbContextType {
  title: string;
  setTitle: (newTitle: string) => void;
}

// Create context with default values
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

// Custom hook for using Breadcrumb Context
export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
};

// Context Provider
export const BreadcrumbProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState('Overview'); // Default title

  return (
    <BreadcrumbContext.Provider value={{ title, setTitle }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
