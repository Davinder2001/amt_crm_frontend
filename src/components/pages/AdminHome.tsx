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
    const { data: profile } = useFetchProfileQuery();
    const [sendCompanyId] = useSelectedCompanyMutation();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loadingCompanyId, setLoadingCompanyId] = useState<number | null>(null);
    const { userType, companySlug } = useCompany();
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

        setLoadingCompanyId(id);

        Cookies.set('company_slug', companySlug, { path: '/' });
        localStorage.setItem('company_slug', encodeStorage(companySlug));

        Cookies.set('company_selection_count', '1', { path: '/' });

        try {
            await sendCompanyId({ id }).unwrap();
            router.push(`/${companySlug}/dashboard`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to select company. Please try again.');
            setLoadingCompanyId(null);
        }
    };

    const isAdmin = userType === 'admin';

    useEffect(() => {
        if (!isAdmin || !companies || companies.length === 0) return;

        if (!companySlug) {
            const firstCompany = companies[0];
            localStorage.setItem('company_slug', encodeStorage(firstCompany.company_slug));
            Cookies.set('company_slug', firstCompany.company_slug, { path: '/' });
        }
    }, [companies, isAdmin, companySlug]);

    return (
        <div className="admin-dashboard-container">
            <ToastContainer position="top-center" autoClose={3000} />

            <header className="admin-header">
                <div className="header-content">
                    <div className="logo-wrapper">
                        <Image src={homelogo} alt="Logo" width={32} height={32} />
                        <span className="system-name">Himmanav Asset Management Technology</span>
                    </div>
                    <div className="header-actions">
                        <Logout />
                    </div>
                </div>
            </header>

            <main className="dashboard-content">
                <section className="welcome-section">
                    <h1 className="welcome-title">Company Management</h1>
                    <p className="welcome-subtitle">Select a company to manage or add a new one</p>
                </section>

                <section className="companies-section">
                    {Array.isArray(companies) && companies.length > 0 ? (
                        <>
                            {/* Desktop List View */}
                            <div className="companies-list">
                                <div className="list-header">
                                    <span className="header-item name">Company Name</span>
                                    <span className="header-item id">ID</span>
                                    <span className="header-item location">Location</span>
                                    <span className="header-item status">Status</span>
                                    <span className="header-item action">Action</span>
                                </div>

                                <div className="list-body">
                                    {companies.map((company) => (
                                        <div key={company.id} className={`company-row ${company.verification_status}`}>
                                            <div className="row-item name">
                                                <h3>{company.company_name}</h3>
                                                <p className="company-description">{company.description || "No description"}</p>
                                            </div>
                                            <div className="row-item id">{company.company_id}</div>
                                            <div className="row-item location">{company.location || "N/A"}</div>
                                            <div className="row-item status">
                                                <span className={`status-badge ${company.verification_status}`}>
                                                    {company.verification_status}
                                                </span>
                                            </div>
                                            <div className="row-item action">
                                                <button
                                                    className="manage-btn"
                                                    onClick={(e) => handleClick(company.company_slug, company.id, company.verification_status === 'verified', e)}
                                                    disabled={loadingCompanyId === company.id}
                                                >
                                                    {loadingCompanyId === company.id ? (
                                                        <span className="btn-loader"></span>
                                                    ) : (
                                                        'Manage'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="company-cards-container">
                                {companies.map((company) => (
                                    <div key={company.id} className={`company-card ${company.verification_status}`}>
                                        <div className="card-row">
                                            <span className="card-label">Name:</span>
                                            <span className="card-value">{company.company_name}</span>
                                        </div>
                                        <div className="card-row">
                                            <span className="card-label">ID:</span>
                                            <span className="card-value">{company.company_id}</span>
                                        </div>
                                        <div className="card-row">
                                            <span className="card-label">Location:</span>
                                            <span className="card-value">{company.location || "N/A"}</span>
                                        </div>
                                        <div className="card-row">
                                            <span className="card-label">Status:</span>
                                            <span className={`status-badge ${company.verification_status}`}>
                                                {company.verification_status}
                                            </span>
                                        </div>
                                        {company.description && (
                                            <p className="card-description">{company.description}</p>
                                        )}
                                        <div className="card-actions">
                                            <button
                                                className="manage-btn"
                                                onClick={(e) => handleClick(company.company_slug, company.id, company.verification_status === 'verified', e)}
                                                disabled={loadingCompanyId === company.id}
                                            >
                                                {loadingCompanyId === company.id ? (
                                                    <span className="btn-loader"></span>
                                                ) : (
                                                    'Manage'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M9 9V19" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </div>
                            <h3>No companies available</h3>
                            <p>Get started by adding your first company</p>
                            <Link href="/add-company" className="add-company-btn">
                                Add New Company
                            </Link>
                        </div>
                    )}
                </section>

                <div className="add-company-cta">
                    <Link href="/add-company" className="add-company-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Add New Company
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default AdminHome;