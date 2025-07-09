'use client';
import React from 'react'
import AttendancesList from './components/AttendancesList'
import Navigation from './components/Navigation';

function Page() {
  return (
    <>
      <Navigation />
      <AttendancesList />
    </>
  )
}

export default Page