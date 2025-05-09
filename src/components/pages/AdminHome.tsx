'use client';
import { useFetchProfileQuery, useSelectedCompanyMutation } from '@/slices/auth/authApi';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Logout from '../common/Logout';
import { useRouter } from 'next/navigation';
import { homelogo } from '@/assets/useImage';
import Image from 'next/image';
import { encodeStorage, useCompany } from '@/utils/Company';

const AdminHome = () => {
    const { data: profile, refetch } = useFetchProfileQuery();
    const [sendCompanyId] = useSelectedCompanyMutation();
    const [companies, setCompanies] = useState<Company[]>([]);
    const { userType } = useCompany();
    const router = useRouter();

    useEffect(() => {
        if (profile?.user?.companies) {
            setCompanies(profile.user.companies);
        }
    }, [profile]);

    const handleClick = async (companySlug: string, id: number, isVerified: boolean, e: React.MouseEvent) => {
        e.preventDefault();
        if (!isVerified) {
            toast.error('This company is not verified. Please contact support.');
            return;
        }

        Cookies.set('company_slug', companySlug, { path: '/' });
        localStorage.setItem('company_slug', encodeStorage(companySlug));

        try {
            await sendCompanyId({ id }).unwrap();
            router.push(`/${companySlug}/dashboard`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to select company. Please try again.');
        }
    };

    const isAdmin = userType === 'admin';

    useEffect(() => {
        if (!isAdmin) return;

        if (!companies || companies.length === 0) {
            refetch(); // Trigger refetch when companies are empty
        } else if (companies.length > 0) {
            const firstCompany = companies[0];
            Cookies.set('company_slug', firstCompany.company_slug, { path: '/' });
        }
    }, [companies, refetch, isAdmin]);

    return (
        <>
            <ToastContainer />
            <div className='admin-home-container'>
                <div className='admin-header'>
                    <div className="admin-header-inner">
                        <Link href="/" className="logo-link">
                            <Image src={homelogo} alt="Logo" width={20} height={20} />
                            <span>Himmanav Asset Management Technology </span>
                        </Link>
                        <Logout />
                    </div>
                </div>
                <div className="admin-home-intro">
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
                        <div className="empty-state">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <p>No companies available</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminHome;
