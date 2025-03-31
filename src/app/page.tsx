'use client'
import { useFetchProfileQuery, useSelectedCompanyMutation } from '@/slices/auth/authApi';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

const Page = () => {
  const { data: profile, refetch } = useFetchProfileQuery();
  const [sendCompanyId] = useSelectedCompanyMutation();
  const companies = profile?.user?.companies;

  console.log('companies', companies)

  const handleClick = async (companySlug: string, id: number) => {
    Cookies.set('company_slug', companySlug, { path: '/' });

    try {
      await sendCompanyId({ id }).unwrap();
    } catch (error) {
      console.error(error);
      alert('Failed to select company. Please try again.');
    }
  };

  useEffect(() => {
    if (Array.isArray(companies) && companies.length > 0) {
      const firstCompany = companies[0];
      Cookies.set('company_slug', firstCompany.company_slug, { path: '/' });
    }
  }, [companies]);

  useEffect(() => {
    if (!companies || companies.length === 0) {
      refetch();
    }
  }, [companies, refetch]);

  return (
    <div className='company-container-main'>
      <div className='company-inneer-main'>
        <h1>Companies</h1>
        <div className="company-grid">

          {Array.isArray(companies) &&
            companies.map((company, index) => (
              <div key={index} className='company'>
                  <div className='company-inner'>
                  <Link className='company-link' href={`/${company.company_slug}/dashboard`} onClick={() => handleClick(company.company_slug, company.id)}>
                    <div className='company-name'>
                      <h2>{company.company_name}</h2>
                    </div>
                    <div className='company-id'>
                      <h3>Company Id: {company.company_id}</h3>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
