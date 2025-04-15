'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'
import SettingNavigation from './components/settingNavigation';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Settings'); 
  }, [setTitle]);
  return (
    <>
    <SettingNavigation />
    
    </>
  )
}

export default Page