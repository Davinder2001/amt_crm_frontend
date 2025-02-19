'use client'
import React, { useState } from 'react';
import { useLoginMutation } from '@/slices/users/userApi'; 

const Page = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login] = useLoginMutation();

  const handleLogin = async () => {
    
    let resp = await login({ email, password });

    let getToken = resp?.data?.token; 
    let getUser = resp?.data?.user; 

    if (getToken) {
      localStorage.setItem('authToken', getToken);
      localStorage.setItem('user', JSON.stringify(getUser));
      alert('Login successful');
    } else {
      alert('Login failed');
    }

    return resp;
  };



  return (
    <div className='' >
      <div className=''>
        <input
          type="text"
          placeholder="Username"
          value={email}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Page;
