// context/SelectedItemContext.tsx
'use client';
import { createContext, useContext, useState } from 'react';

const SelectedItemContext = createContext<{
  itemId: number | null,
  setItemId: (id: number) => void
}>({
  itemId: null,
  setItemId: () => { }
});

export const SelectedItemProvider = ({ children }: { children: React.ReactNode }) => {
  const [itemId, setItemId] = useState<number | null>(null);

  return (
    <SelectedItemContext.Provider value={{ itemId, setItemId }}>
      {children}
    </SelectedItemContext.Provider>
  );
};

export const useSelectedItem = () => useContext(SelectedItemContext);
