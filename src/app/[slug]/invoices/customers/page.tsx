'use client';
import { useFetchAllCustomersQuery } from '@/slices/customers/customer';
import React from 'react'

const Page = () => {
  const {data: customers} = useFetchAllCustomersQuery();
  console.log('customers.....', customers);

  return (
    <>
      <h1>All Customers</h1>
    </>
  )
}

export default Page