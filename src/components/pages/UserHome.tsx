import React from 'react'
import LoginForm from '../common/LoginForm'
import { useUser } from '@/provider/UserContext'

function UserHome() {
  const {user} = useUser();
  return (
    <>
    {
      !user ? 
      <LoginForm /> : 
      <>
      <h1>welcome user</h1>
      </>
    }
    </>
  )
}

export default UserHome