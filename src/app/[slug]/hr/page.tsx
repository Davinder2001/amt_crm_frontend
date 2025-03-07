'use client';

import React from 'react';
import UserList from './components/UserList';
import Link from 'next/link';
import RoleList from './components/RoleList';


const Page = () => {
  return (
    <div className="p-6">

    <div className="hr_navigation">
      <Link href="/hr/add-employee">Add Employee</Link>
      <Link href="/hr/invite-employee">Invite Employee</Link>
      <Link href="/hr/status-view">Status View</Link>
      <Link href="/hr/employee-salary">Employee Salary</Link>
      <Link href="/hr/attendence">Attendence</Link>
      </div>

      <UserList />

    <RoleList/>

    </div>
  );
};

export default Page;
