'use client';
import Loader from '@/components/common/Loader';
import { useFetchProfileQuery, useSelectedCompanyMutation } from '@/slices/auth/authApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { encodeStorage } from '@/utils/Company';
import { useEffect, useState } from 'react';
import { invalidateAllCompanyApis } from '@/utils/ApiDispatch';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const { data, isLoading, isError } = useFetchProfileQuery();
  const [sendCompanyId] = useSelectedCompanyMutation();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanyId, setLoadingCompanyId] = useState<number | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const user = data?.user;

  useEffect(() => {
    if (user?.companies) {
      setCompanies(user.companies);
    }
  }, [user]);

  const selectCompany = async (companySlug: string, id: number, isVerified: boolean) => {
    if (!isVerified) {
      toast.error('This company is not verified. Please contact support.');
      return false;
    }

    Cookies.set('company_slug', companySlug, { path: '/' });
    localStorage.setItem('company_slug', encodeStorage(companySlug));

    try {
      await sendCompanyId({ id }).unwrap();
      invalidateAllCompanyApis(dispatch);
      return true;
    } catch (error) {
      console.error(error);
      toast.error('Failed to select company. Please try again.');
      return false;
    }
  };

  const handleCardClick = async (
    companySlug: string,
    id: number,
    isVerified: boolean,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    const success = await selectCompany(companySlug, id, isVerified);
    if (success) {
      router.push(`/${companySlug}/dashboard`);
    }
  };

  const handleViewDetailsClick = async (
    companySlug: string,
    id: number,
    isVerified: boolean,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent card click
    e.preventDefault();
    const success = await selectCompany(companySlug, id, isVerified);
    if (success) {
      router.push(`/${companySlug}/company-details`);
      setLoadingCompanyId(id); // Set loading state
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <div className="error-container"><p>Failed to load profile.</p></div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>{user?.name}</h1>
        <div className="header-actions">
          <Link href="my-account/change-password" className="btn-primary">
            Change Password
          </Link>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2><span className="icon">👤</span> Personal Information</h2>
          <div className="info-grid">
            <div className="info-row"><span className="info-label">ID:</span><span className="info-value">{user?.id}</span></div>
            <div className="info-row"><span className="info-label">Name:</span><span className="info-value">{user?.name}</span></div>
            <div className="info-row"><span className="info-label">Number:</span><span className="info-value">{user?.number}</span></div>
            <div className="info-row"><span className="info-label">Email:</span><span className="info-value">{user?.email}</span></div>
            <div className="info-row"><span className="info-label">UID:</span><span className="info-value">{user?.uid}</span></div>
            <div className="info-row"><span className="info-label">User Type:</span><span className="info-value capitalize">{user?.user_type}</span></div>
          </div>
        </div>

        {user?.meta && Array.isArray(user.meta) && user.meta.length > 0 && (
          <div className="profile-section">
            <h2><span className="icon">ℹ️</span> Additional Information</h2>
            <div className="info-grid">
              {Object.entries(user.meta).map(([key, value]) => (
                <div className="info-row" key={key}>
                  <span className="info-label">{key.replace('_', ' ')}:</span>
                  <span className="info-value">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {companies.length > 0 && (
        <div className="profile-section">
          <div className="section-header">
            <h2><span className="icon">🏢</span> Associated Companies</h2>
          </div>
          <div className="companies-grid">
            {companies.map((company) => (
              <div
                key={company.id}
                className='company-card-wrapper'
              >
                <div
                  className="company-card"
                  onClick={(e) =>
                    handleCardClick(
                      company.company_slug,
                      company.id,
                      company.verification_status === 'verified',
                      e
                    )
                  }
                >
                  <h3>{company.company_name}</h3>
                  <div className="company-info">
                    <div className="info-row" style={{gridColumn: '1/-1'}}>
                      <span className="info-label">Company ID:</span>
                      <span className="info-value">{company.company_id}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Status:</span>
                      <span className={`status-badge ${company.verification_status}`}>
                        {company.verification_status}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Payment:</span>
                      <span className={`status-badge ${company.payment_status}`}>
                        {company.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
                {/* ✅ View Details Button */}
                {company.verification_status === 'verified' ?
                  <div className="card-actions">
                    <button
                      onClick={(e) =>
                        handleViewDetailsClick(
                          company.company_slug,
                          company.id,
                          company.verification_status === 'verified',
                          e
                        )
                      }
                      disabled={loadingCompanyId === company.id}
                      className="btn-secondary view-details-btn"
                    >
                      {loadingCompanyId === company.id ? 'Loading...' : 'View Details'}
                    </button>
                  </div> : ''
                }
              </div>
            ))}

            <Link href="my-account/add-company" className="company-card add-company">
              <div className="add-icon">+</div>
              <p>Add New Company</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;