'use client';
import { useFetchProfileQuery, useSelectedCompanyMutation } from '@/slices/auth/authApi';
import Link from 'next/link';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logout from '../common/Logout';

const AdminHome = () => {
    const { data: profile, refetch } = useFetchProfileQuery();
    const [sendCompanyId] = useSelectedCompanyMutation();
    const companies = profile?.user?.companies;
    const userType = profile?.user?.user_type;

    const handleClick = async (companySlug: string, id: number, isVerified: boolean, e: React.MouseEvent) => {
        e.preventDefault();
        if (!isVerified) {
            toast.error('This company is not verified. Please contact support.');
            return;
        }

        Cookies.set('company_slug', companySlug, { path: '/' });

        try {
            await sendCompanyId({ id }).unwrap();
            window.location.href = `/${companySlug}/dashboard`;
        } catch (error) {
            console.error(error);
            alert('Failed to select company. Please try again.');
        }
    };

    const isAdmin = userType === 'admin';

    useEffect(() => {
        if (!isAdmin) {
            return;
        }

        if (Array.isArray(companies) && companies.length > 0) {
            const firstCompany = companies[0];
            Cookies.set('company_slug', firstCompany.company_slug, { path: '/' });
        }

        if (!companies || companies.length === 0) {
            refetch();
        }
    }, [companies, refetch, isAdmin]);

    console.log('AdminHome component mounted or updated', { companies, userType });

    return (
        <>
            <ToastContainer />
            <div className='admin-home-container'>
                <Logout />
                <div className='admin-header'>
                    <h1>Welcome to Your Admin Dashboard</h1>
                    <p>Select a company to manage or view details</p>
                </div>
                <div className='company-grid'>
                    {Array.isArray(companies) && companies.length > 0 ? (
                        companies.map((company, index) => (
                            <div key={index} className='company-card'>
                                <Link
                                    className='company-link'
                                    href={`/${company.company_slug}/dashboard`}
                                    onClick={(e) => handleClick(company.company_slug, company.id, company.verification_status === 'verified', e)}
                                >
                                    <div className='company-card-content'>
                                        <div className='company-header'>
                                            <h2>{company.company_name}</h2>
                                            <span className={`status ${company.verification_status}`}>{company.verification_status}</span>
                                        </div>
                                        <p className='company-description'>{company.description || "No description available."}</p>
                                        <div className='company-info'>
                                            <p><strong>ID:</strong> {company.company_id}</p>
                                            <p><strong>Location:</strong> {company.location || "N/A"}</p>
                                        </div>
                                        <div className='company-actions'>
                                            <button className='btn-action' onClick={(e) => {
                                                e.stopPropagation();
                                                handleClick(company.company_slug, company.id, company.verification_status === 'verified', e);
                                            }}>Manage</button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No companies available.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminHome;
