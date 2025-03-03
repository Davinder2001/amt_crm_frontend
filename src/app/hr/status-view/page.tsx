import Link from 'next/link'
import React from 'react'
import UserList from './components/userList'

const Page = () => {
  return (
    <>
    <Link href="/hr">Back</Link>
    <UserList/>
    </>
  )
}

export default Page