'use client';
import Loader from '@/components/common/Loader';
import { useFetchProfileQuery, useSelectedCompanyMutation } from '@/slices/auth/authApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { encodeStorage } from '@/utils/Company';

const Profile = () => {
  const { data, isLoading, isError } = useFetchProfileQuery();
  const [sendCompanyId] = useSelectedCompanyMutation();
  const router = useRouter();

  if (isLoading) return <Loader />;
  if (isError) return <div className="error-container"><p>Failed to load profile.</p></div>;

  const user = data?.user;

  const handleCompanySelect = async (
    companySlug: string,
    id: number,
    isVerified: boolean,
    e: React.MouseEvent
  ) => {
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
            <div className="info-row">
              <span className="info-label">ID:</span>
              <span className="info-value">{user?.id}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">{user?.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Number:</span>
              <span className="info-value">{user?.number}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">UID:</span>
              <span className="info-value">{user?.uid}</span>
            </div>
            <div className="info-row">
              <span className="info-label">User Type:</span>
              <span className="info-value capitalize">{user?.user_type}</span>
            </div>
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

      {(user?.companies ?? []).length > 0 && (
        <div className="profile-section">
          <div className="section-header">
            <h2><span className="icon">🏢</span> Associated Companies</h2>
          </div>
          <div className="companies-grid">
            {(user?.companies ?? []).map((company: Company) => (
              <div key={company.id} className="company-card">
                <h3>{company.company_name}</h3>
                <div className="company-info">
                  <div className="info-row">
                    <span className="info-label">Slug:</span>
                    <span className="info-value">{company.company_slug}</span>
                  </div>
                  <div className="info-row">
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
                <div className="company-actions">
                  <button
                    className="btn-action"
                    onClick={(e) =>
                      handleCompanySelect(
                        company.company_slug,
                        company.id,
                        company.verification_status === 'verified',
                        e
                      )
                    }
                  >
                    Manage Company
                  </button>
                </div>
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