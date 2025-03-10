'use client';

import React from 'react';
import UserList from './components/UserList';
import RoleList from './components/RoleList';
import Navigation from './components/hrNavigation';



const Page: React.FC = () => {


  return (
    <div className="p-6">
     <Navigation/>
      <UserList />
      <RoleList />
    </div>
  );
};

export default Page;