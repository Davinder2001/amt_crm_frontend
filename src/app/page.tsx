//src/app/page.tsx
'use client'
import { useFetchProfileQuery } from '@/slices/auth/authApi';
import React from 'react'

const Page = () => {
   const { data: profile } = useFetchProfileQuery();
   console.log('profile.........', profile);
   
  return (
    <>
    werwerwer4353454
    </>
  )
}

export default Page