'use client';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import React, { useEffect } from 'react'
import SettingNavigation from './components/settingNavigation';
// import GoogleTranslate from '@/components/common/GoogleTranslate';

const Page = () => {
  const { setTitle } = useBreadcrumb();

  useEffect(() => {
    setTitle('Settings');
  }, [setTitle]);
  return (
    <>
      <SettingNavigation />
      {/* <GoogleTranslate /> */}
    </>
  )
}

export default Page