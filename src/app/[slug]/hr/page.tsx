'use client';

import React from 'react';
import UserList from './components/UserList';
import RoleList from './components/RoleList';
import Navigation from './components/hrNavigation';
import HrHroSection from './(hrHome)/HrHroSection';



const Page: React.FC = () => {


  return (
    <div className="p-6">
     <Navigation/>
     <HrHroSection/>
      {/* <UserList /> */}
      <RoleList />
    </div>
  );
};

export default Page;