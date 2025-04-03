'use client';
import AdminHome from '@/components/pages/AdminHome';
import UserHome from '@/components/pages/UserHome';
import { useCompany } from '@/utils/Company';
import React from 'react'

function Page() {
  const { userType } = useCompany();
  return (
    <>
      {userType === 'admin' ? <AdminHome /> : <UserHome />}
    </>
  )
}

export default Page