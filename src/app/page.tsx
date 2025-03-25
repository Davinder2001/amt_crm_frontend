'use client'
import { useFetchProfileQuery, useSelectedCompanyMutation } from '@/slices/auth/authApi';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

const Page = () => {
  const { data: profile, refetch } = useFetchProfileQuery();
  const [sendCompanyId] = useSelectedCompanyMutation();
  const companies = profile?.user?.companies;

  const handleClick = async (companySlug: string, id: number) => {
    Cookies.set('company_slug', companySlug, { path: '/' });

    try {
      await sendCompanyId({ id }).unwrap();
    } catch (error) {
      console.error(error);
      alert('Failed to select company. Please try again.');
    }
  };

  // Set the first company's slug in cookies when the component mounts
  useEffect(() => {
    if (Array.isArray(companies) && companies.length > 0) {
      const firstCompany = companies[0];
      Cookies.set('company_slug', firstCompany.company_slug, { path: '/' });
    }
  }, [companies]);

  // Set the first company's slug in cookies when the component mounts
  useEffect(() => {
    if (companies && companies.length > 0) {
      const firstCompany = companies[0];
      Cookies.set('company_slug', firstCompany.company_slug, { path: '/' });
    }
  }, [companies]);

  // Handle refetching if companies array is empty
  useEffect(() => {
    if (!companies || companies.length === 0) {
      refetch();
    }
  }, [companies, refetch]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Companies</h1>
      {Array.isArray(companies) && companies.map((company, index) => (
        <div
          key={index}
          style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '10px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: '0', color: '#555', fontSize: '18px' }}>{company.company_name}</h2>
          <span><strong>company Id:</strong> {company.company_id}</span>
          <Link
            href={`/${company.company_slug}/dashboard`}
            style={{
              textDecoration: 'none',
              backgroundColor: '#0070f3',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '14px',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#005bb5')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0070f3')}
            onClick={() => handleClick(company.company_slug, company.id)}
          >
            {company.company_name}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Page;
