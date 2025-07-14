'use client'
import { useFetchProfileQuery, useSelectedCompanyMutation, useCompanyScoreQuery, useFetchLoginSessionsQuery } from '@/slices'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { encodeStorage, useCompany } from '@/utils/Company'
import { useEffect, useState } from 'react'
import { invalidateAllCompanyApis } from '@/utils/ApiDispatch'
import { AppDispatch } from '@/store/store'
import { useDispatch } from 'react-redux'
import RecheckModal from '@/components/common/RecheckModal'
import LoadingState from '@/components/common/LoadingState'
import EmptyState from '@/components/common/EmptyState'
import { FaEdit, FaLock, FaPlus, FaUniversity, FaUser } from 'react-icons/fa'
import { EditUserModal } from './EditUserModal'
import Modal from '@/components/common/Modal'
import ChangePassword from './changePassword'

const Profile = () => {
  const { data, isLoading, error } = useFetchProfileQuery()
  const [sendCompanyId] = useSelectedCompanyMutation();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanyId, setLoadingCompanyId] = useState<number | null>(null);
  const [isRecheckModal, setIsRecheckModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editUserModal, setEditUserModal] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = data?.user;
  const { companySlug } = useCompany();
  const { data: companyScore } = useCompanyScoreQuery();
  const { data: sessionsData } = useFetchLoginSessionsQuery();
  const totalLogins = sessionsData?.total_logins || 0;

  useEffect(() => {
    if (user?.companies) {
      setCompanies(user.companies)
    }
  }, [user])



  const selectCompany = async (company: Company) => {
    const { id, company_slug, verification_status, payment_status } = company;

    if (payment_status === 'pending') {
      setSelectedCompany(company)
      setIsRecheckModal(true)
      return false
    }

    if (payment_status === 'completed' && verification_status !== 'verified') {
      toast.error('This company is not verified. Please contact support.')
      return false
    }

    Cookies.set('company_slug', company_slug, { path: '/' })
    localStorage.setItem('company_slug', encodeStorage(company_slug))

    try {
      await sendCompanyId({ id }).unwrap()
      invalidateAllCompanyApis(dispatch)
      return true
    } catch (error) {
      console.error(error)
      toast.error('Failed to select company. Please try again.')
      return false
    }
  }

  const handleCardClick = async (company: Company, e: React.MouseEvent) => {
    e.preventDefault()

    // Check if this is the currently active company
    if (company.company_slug === companySlug) {
      return // Exit early if it's the active company
    }

    const success = await selectCompany(company)
    if (success) {
      router.push(`/${company.company_slug}/dashboard`)
    }
  }

  const handleViewDetailsClick = async (company: Company, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const success = await selectCompany(company)
    if (success) {
      setLoadingCompanyId(company.id)
      router.push(`/${company.company_slug}/company-details`)
    }
  }

  const handleEditOpen = (id: number) => {
    setEditUserModal(true);
    setUserId(id);
  }

  if (isLoading) return <LoadingState />
  if (error)
    return (
      <EmptyState
        icon="alert"
        title="Failed to fetching profile data."
        message="Something went wrong while fetching profile data."
      />
    );

  return (
    <>
      {/* Layout */}
      <div className="my-acc-layout">
        {/* Left Panel */}
        <div className="panel personal-panel">
          <div className="panel-header">
            <h2><FaUser /> {user?.name}</h2>
            <div className='pannel-header-actions'>
              <span onClick={() => setChangePasswordModal(true)} className="action-btn">
                <FaLock /> Change Password
              </span>
              <span onClick={() => { if (user?.id !== undefined) handleEditOpen(user.id) }}>
                <FaEdit /> Edit Profile
              </span>
            </div>
          </div>
          <div className="info-stack">
            <div className="info-line"><span>📧</span><span>{user?.email}</span></div>
            <div className="info-line"><span>📱</span><span>{user?.number}</span></div>
            <div className="info-line"><span>🆔</span><span>{user?.uid}</span></div>
            <div className="info-line"><span>👔</span><span className="role-badge">{user?.user_type}</span></div>
            <div className="info-line"><span>Login Sessions</span><span className='status-tag'>{totalLogins}</span></div></div>
        </div>

        {/* Right Panel */}
        <div className="panel companies-panel">
          <div className="panel-header">
            <h2><FaUniversity /> Companies ({companies.length})</h2>
            <div className='pannel-header-actions'>
              <Link href="/add-company" className="add-btn"><FaPlus /> Add New Company</Link>
            </div>
          </div>

          <div className="company-stack">
            {companies.map((company) => {
              const isCurrentCompany = company.company_slug === companySlug;
              return (
                <div
                  key={company.id}
                  className={`company-item ${company.verification_status} ${isCurrentCompany ? 'active-company' : ''
                    }`}
                  onClick={(e) => handleCardClick(company, e)}
                >

                  <div className="c-basic">
                  <div className="company-main">
                    <h3>{company.company_name}</h3>
                    <div className="company-id">#{company.company_id}</div>
                  </div>

                  {isCurrentCompany && companyScore && (
                    <div className="company-score">
                      <div className="score-bar-container">
                        <div className="score-bar">
                          <div
                            className="score-fill"
                            style={{ width: `${companyScore.profile_score}%` }}
                          >
                            <div className="score-indicator">
                              <div className="indicator-tooltip">
                                {companyScore.profile_score}% Complete
                              </div>
                            </div>
                            {/* Pointer moved here - at the end of score-fill */}
                            <div className="indicator-pointer"></div>
                          </div>
                        </div>
                      </div>
                      <div className="score-warning">{companyScore.message}</div>
                    </div>
                  )}
                  <div className="company-status">
                    <label htmlFor="payment-status">
                      <span>Payment Status</span>
                      <span className={`status-tag ${company.payment_status}`}>{company.payment_status}</span>
                    </label>
                    <label htmlFor="verification-status">
                      <span>Verification Status</span>
                      <span className={`status-tag ${company.verification_status}`}>{company.verification_status}</span>
                    </label>
                  </div>
                  </div>

                  <div className="c-actions">
                    {!isCurrentCompany ? (
                      <div className="switch-badge">
                        <div className="badge-text">Switch</div>
                      </div>
                    ) : (
                      <div className="active-badge">
                        <div className="badge-text">Active</div>
                      </div>
                    )}

                    <button className='edit-c-profile'>Edit Company Profile</button>

                    {company.payment_status === 'pending' ? (
                      <button
                        className="view-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedCompany(company)
                          setIsRecheckModal(true)
                        }}
                      >
                        Check Status
                      </button>
                    ) : (
                      <button
                        className="view-btn"
                        onClick={(e) => handleViewDetailsClick(company, e)}
                        disabled={loadingCompanyId === company.id}
                      >
                        {loadingCompanyId === company.id ? 'Loading...' : 'View Details'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Modal isOpen={changePasswordModal} onClose={() => setChangePasswordModal(false)} title="Change Password" width="500px">
        <ChangePassword />
      </Modal>

      <EditUserModal
        userId={userId}
        userData={user ?? null}
        isOpen={editUserModal}
        onClose={() => setEditUserModal(false)}
      />

      {/* Recheck Modal */}
      {isRecheckModal && selectedCompany && (
        <RecheckModal
          isOpen={isRecheckModal}
          onClose={() => setIsRecheckModal(false)}
          companyName={selectedCompany?.company_name || ''}
          companyId={selectedCompany?.id}
        />
      )}
    </>
  )
}

export default Profile
