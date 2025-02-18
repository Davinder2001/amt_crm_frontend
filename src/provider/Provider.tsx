'use client'
import  store  from '@/store/store'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'

interface UserProviderProps {
  children: ReactNode;
}

function UserProvider({ children }: UserProviderProps) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default UserProvider;