'use client'
import { useFetchProfileQuery, useSelectedCompanyMutation } from '@/slices/auth/authApi';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const Page = () => {
  const { data: profile, refetch } = useFetchProfileQuery();
  const [sendCompanyId] = useSelectedCompanyMutation();
  const companies = profile?.user?.companies;
  const userType = profile?.user?.user_type;
  const router = useRouter(); 

  const handleClick = async (companySlug: string, id: number) => {

    Cookies.set('company_slug', companySlug, { path: '/' });

    try {
      await sendCompanyId({ id }).unwrap();
      router.push(`/${companySlug}/dashboard`)
    } catch (error) {
      console.error(error);
      alert('Failed to select company. Please try again.');
    }
  };

  // Check if the user is an "admin"
  const isAdmin = userType === 'admin' || userType === 'employee';

  useEffect(() => {
    // If user is not an admin or employee, do nothing related to companies
    if (!isAdmin) {
      return; // Exit useEffect early for non-admin/employee users
    }

    if (Array.isArray(companies) && companies.length > 0) {
      const firstCompany = companies[0];
      Cookies.set('company_slug', firstCompany.company_slug, { path: '/' });
    }

    // Refetch companies if the array is empty or undefined
    if (!companies || companies.length === 0) {
      refetch();
    }
  }, [companies, refetch, isAdmin]); // Add isAdminOrEmployee as a dependency

  return (
    <div className='company-container-main'>
      <div className='company-inneer-main'>
        {/* Display a welcome message if user is not an admin or employee */}
        {!isAdmin ? (
          ''
        ) : (
          <>
            <h1>Companies</h1>
            <div className="company-grid">
              {Array.isArray(companies) && companies.length > 0 ? (
                companies.map((company, index) => (
                  <div key={index} className='company'>
                    <div className='company-inner'>
                      <Link
                        className='company-link'
                        href={`/${company.company_slug}/dashboard`}
                        onClick={() => handleClick(company.company_slug, company.id)}
                      >
                        <div className='company-name'>
                          <h2>{company.company_name}</h2>
                        </div>
                        <div className='company-id'>
                          <h3>Company Id: {company.company_id}</h3>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p>No companies available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
