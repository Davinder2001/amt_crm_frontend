// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useLoginMutation } from '@/slices/auth/authApi';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Link from 'next/link';
// import Cookies from 'js-cookie';
// import { useUser } from '@/provider/UserContext';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

// const LoginForm = () => {
//   const router = useRouter();
//   const { setUser, user } = useUser();
//   const [number, setNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const [login, { isLoading }] = useLoginMutation();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const result = await login({ number, password }).unwrap();
//       toast.success(result.message);

//       // Set cookies
//       Cookies.set('access_token', result.access_token, { path: '/' });
//       Cookies.set('user_type', result.user.user_type, { path: '/' });

//       // Update user in context
//       setUser(result.user);

//       // Redirect based on user type
//       if (result.user.user_type === 'admin') {
//         router.push('/');  // Admin goes to the root page
//         router.refresh();
//       } else if (result.user.user_type === 'employee') {
//         const companySlug = result.user.companies[0].company_slug;
//         Cookies.set('company_slug', companySlug, { path: '/' });
//         router.push(`/${companySlug}/employee/dashboard`);
//       } else if (result.user.user_type === 'super-admin') {
//         router.push('/superadmin/dashboard')
//       } else {
//         // Multiple companies, let them choose or go to the home page
//         router.push('/');
//       }
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         toast.error(err.message || 'Login failed');
//       } else {
//         toast.error('An unknown error occurred');
//       }
//     }
//   };

//   const isLoggedIn = !!user;

//   useEffect(() => {
//     const accessToken = Cookies.get('access_token');
//     const userType = Cookies.get('user_type');
//     if (!accessToken && !userType) {
//       setUser(null);
//     }
//   }, [setUser, user]);

//   return (
//     <>
//       <div className="login-page-container">
//         <div className="login-form-wrapper">
//           {isLoggedIn ? (
//             ''
//           ) : (
//             <form onSubmit={handleLogin} className="login-form">
//               <input
//                 type="text"
//                 placeholder="Phone Number"
//                 value={number}
//                 onChange={(e) => setNumber(e.target.value)}
//                 className="login-input"
//                 required
//               />

//               <div className="password-input-container">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="password-input"
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="password-toggle-btn"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>

//               <button type="submit" className="buttons" disabled={isLoading}>
//                 {isLoading ? 'Logging in...' : 'Login'}
//               </button>
//             </form>
//           )}

//           <div className="links">
//             <Link href="/forget-password" className="forgot-password-link">
//               Forget Password
//             </Link>
// <Link href="/register-your-company" className="register-company-link">
//   Register your company
// </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginForm;
















'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/slices/auth/authApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useUser } from '@/provider/UserContext';
import { FaEye, FaEyeSlash, FaPhone } from 'react-icons/fa';
import { FiLock } from 'react-icons/fi';
import { loginPageimage } from '@/assets/useImage';

const LoginForm = () => {
  const router = useRouter();
  const { setUser, user } = useUser();
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login({ number, password }).unwrap();
      toast.success(result.message);

      // Set cookies
      Cookies.set('access_token', result.access_token, { path: '/' });
      Cookies.set('user_type', result.user.user_type, { path: '/' });

      // Update user in context
      setUser(result.user);

      // Redirect based on user type
      if (result.user.user_type === 'admin') {
        router.push('/');  // Admin goes to the root page
        router.refresh();
      } else if (result.user.user_type === 'employee') {
        const companySlug = result.user.companies[0].company_slug;
        Cookies.set('company_slug', companySlug, { path: '/' });
        router.push(`/${companySlug}/employee/dashboard`);
      } else if (result.user.user_type === 'super-admin') {
        router.push('/superadmin/dashboard')
      } else {
        // Multiple companies, let them choose or go to the home page
        router.push('/');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || 'Login failed');
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

  const isLoggedIn = !!user;

  useEffect(() => {
    const accessToken = Cookies.get('access_token');
    const userType = Cookies.get('user_type');
    if (!accessToken && !userType) {
      setUser(null);
    }
  }, [setUser, user]);

  return (
    <>
      <div className="login-container2">
        <div className="left-panel">
          <div className="form-box">
            <h1 className="title">SecurePanel</h1>
            <h2 className="subtitle">Welcome back</h2>
            <p className="description">Please login to manage your dashboard.</p>

            {!isLoggedIn && (
              <form onSubmit={handleLogin} className="login-form">


                <div className="input-group">
                  <label>Mobile Number</label>
                  <div className="input-wrapper filled">
                    <FaPhone size={18} className="input-icon" />
                    <input
                      type="text"
                      placeholder="Enter your mobile number..."
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      className="login-input"
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <div className="input-wrapper filled">
                    <FiLock size={18} className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="password-input"
                      required
                    />
                    <span
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>




                <div className="remember-forgot ">
                  <label className="custom-checkbox">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    Remember me
                  </label>
                  <Link href="/forget-password" className="forgot-password-link">Forgot Password?</Link>
                </div>

                <button type="submit" className="login-button" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            )}

            

            <div className="login-footer-links">
              <Link href="/register-your-company" className="register-company-link">
                Register your company
              </Link>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <img src={loginPageimage.src} alt="Doctors" className="illustration" />
        </div>
      </div>

    </>
  );
};

export default LoginForm;
