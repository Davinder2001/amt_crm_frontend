// 'use client'
// import Loader from '@/components/common/Loader'
// import { useFetchProfileQuery, useSelectedCompanyMutation } from '@/slices/auth/authApi'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import Cookies from 'js-cookie'
// import { toast } from 'react-toastify'
// import { encodeStorage } from '@/utils/Company'
// import { useEffect, useState } from 'react'
// import { invalidateAllCompanyApis } from '@/utils/ApiDispatch'
// import { AppDispatch } from '@/store/store'
// import { useDispatch } from 'react-redux'

// const Profile = () => {
//   const { data, isLoading, isError } = useFetchProfileQuery()
//   const [sendCompanyId] = useSelectedCompanyMutation()
//   const [companies, setCompanies] = useState<Company[]>([])
//   const [loadingCompanyId, setLoadingCompanyId] = useState<number | null>(null)
//   const router = useRouter()
//   const dispatch = useDispatch<AppDispatch>()

//   const user = data?.user

//   useEffect(() => {
//     if (user?.companies) {
//       setCompanies(user.companies)
//     }
//   }, [user])

//   const selectCompany = async (companySlug: string, id: number, isVerified: boolean) => {
//     if (!isVerified) {
//       toast.error('This company is not verified. Please contact support.')
//       return false
//     }

//     Cookies.set('company_slug', companySlug, { path: '/' })
//     localStorage.setItem('company_slug', encodeStorage(companySlug))

//     try {
//       await sendCompanyId({ id }).unwrap()
//       invalidateAllCompanyApis(dispatch)
//       return true
//     } catch (error) {
//       console.error(error)
//       toast.error('Failed to select company. Please try again.')
//       return false
//     }
//   }

//   const handleCardClick = async (
//     companySlug: string,
//     id: number,
//     isVerified: boolean,
//     e: React.MouseEvent
//   ) => {
//     e.preventDefault()
//     const success = await selectCompany(companySlug, id, isVerified)
//     if (success) {
//       router.push(`/${companySlug}/dashboard`)
//     }
//   }

//   const handleViewDetailsClick = async (
//     companySlug: string,
//     id: number,
//     isVerified: boolean,
//     e: React.MouseEvent
//   ) => {
//     e.stopPropagation()
//     e.preventDefault()
//     const success = await selectCompany(companySlug, id, isVerified)
//     if (success) {
//       router.push(`/${companySlug}/company-details`)
//       setLoadingCompanyId(id)
//     }
//   }

//   if (isLoading) return <Loader />
//   if (isError) return <div className="radical-error">⚠️ Failed to load profile</div>

//   return (
//     <div className="radical-profile">
//       {/* Asymmetric Header */}
//       <div className="radical-header">
//         <div className="header-content">
//           <h1>
//             <span className="name-highlight">{user?.name}</span>
//             <span className="id-badge">ID: {user?.id}</span>
//           </h1>
//           <div className="header-actions">
//             <Link href="my-account/change-password" className="action-btn">
//               <span>🔒 Password</span>
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Split Layout */}
//       <div className="radical-layout">
//         {/* Left Panel - Personal Info */}
//         <div className="panel personal-panel">
//           <div className="panel-header">
//             <h2>🧑 USER PROFILE</h2>
//           </div>
//           <div className="info-stack">
//             <div className="info-line">
//               <span>📧</span>
//               <span>{user?.email}</span>
//             </div>
//             <div className="info-line">
//               <span>📱</span>
//               <span>{user?.number}</span>
//             </div>
//             <div className="info-line">
//               <span>🆔</span>
//               <span>{user?.uid}</span>
//             </div>
//             <div className="info-line">
//               <span>👔</span>
//               <span className="role-badge">{user?.user_type}</span>
//             </div>
//           </div>

//           {user?.meta && Array.isArray(user.meta) && user.meta.length > 0 && (
//             <>
//               <div className="panel-header">
//                 <h2>📝 ADDITIONAL</h2>
//               </div>
//               <div className="meta-grid">
//                 {Object.entries(user.meta).map(([key, value]) => (
//                   <div key={key} className="meta-item">
//                     <div>{key.replace('_', ' ')}</div>
//                     <div>{String(value)}</div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Right Panel - Companies */}
//         <div className="panel companies-panel">
//           <div className="panel-header">
//             <h2>🏢 COMPANIES ({companies.length})</h2>
//             <Link href="/add-company" className="add-btn">
//               + NEW
//             </Link>
//           </div>

//           <div className="company-stack">
//             {companies.map((company) => (
//               <div
//                 key={company.id}
//                 className={`company-item ${company.verification_status}`}
//                 onClick={(e) =>
//                   handleCardClick(
//                     company.company_slug,
//                     company.id,
//                     company.verification_status === 'verified',
//                     e
//                   )
//                 }
//               >
//                 <div className="company-main">
//                   <h3>{company.company_name}</h3>
//                   <div className="company-id">#{company.company_id}</div>
//                 </div>

//                 <div className="company-status">
//                   <span className={`status-tag ${company.verification_status}`}>
//                     {company.verification_status}
//                   </span>
//                   <span className={`status-tag ${company.payment_status}`}>
//                     {company.payment_status}
//                   </span>
//                 </div>

//                 {company.verification_status === 'verified' && (
//                   <button
//                     className="view-btn"
//                     onClick={(e) =>
//                       handleViewDetailsClick(
//                         company.company_slug,
//                         company.id,
//                         company.verification_status === 'verified',
//                         e
//                       )
//                     }
//                     disabled={loadingCompanyId === company.id}
//                   >
//                     {loadingCompanyId === company.id ? '↻' : '→'}
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile









'use client'
import Loader from '@/components/common/Loader'
import { useFetchProfileQuery, useSelectedCompanyMutation } from '@/slices/auth/authApi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { encodeStorage } from '@/utils/Company'
import { useEffect, useState } from 'react'
import { invalidateAllCompanyApis } from '@/utils/ApiDispatch'
import { AppDispatch } from '@/store/store'
import { useDispatch } from 'react-redux'
import Modal from '@/components/common/Modal' // Make sure this exists

const Profile = () => {
  const { data, isLoading, isError } = useFetchProfileQuery()
  const [sendCompanyId] = useSelectedCompanyMutation()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loadingCompanyId, setLoadingCompanyId] = useState<number | null>(null)
  const [isRecheckModal, setIsRecheckModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const user = data?.user

  useEffect(() => {
    if (user?.companies) {
      setCompanies(user.companies)
    }
  }, [user])

  const selectCompany = async (company: Company) => {
    const { id, company_slug, verification_status, payment_status } = company

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

  if (isLoading) return <Loader />
  if (isError) return <div className="radical-error">⚠️ Failed to load profile</div>

  return (
    <div className="radical-profile">
      {/* Header */}
      <div className="radical-header">
        <div className="header-content">
          <h1>
            <span className="name-highlight">{user?.name}</span>
            <span className="id-badge">ID: {user?.id}</span>
          </h1>
          <div className="header-actions">
            <Link href="my-account/change-password" className="action-btn">
              <span>🔒 Password</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="radical-layout">
        {/* Left Panel */}
        <div className="panel personal-panel">
          <div className="panel-header">
            <h2>🧑 USER PROFILE</h2>
          </div>
          <div className="info-stack">
            <div className="info-line"><span>📧</span><span>{user?.email}</span></div>
            <div className="info-line"><span>📱</span><span>{user?.number}</span></div>
            <div className="info-line"><span>🆔</span><span>{user?.uid}</span></div>
            <div className="info-line"><span>👔</span><span className="role-badge">{user?.user_type}</span></div>
          </div>

          {user?.meta && Array.isArray(user.meta) && user.meta.length > 0 && (
            <>
              <div className="panel-header">
                <h2>📝 ADDITIONAL</h2>
              </div>
              <div className="meta-grid">
                {Object.entries(user.meta).map(([key, value]) => (
                  <div key={key} className="meta-item">
                    <div>{key.replace('_', ' ')}</div>
                    <div>{String(value)}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Panel */}
        <div className="panel companies-panel">
          <div className="panel-header">
            <h2>🏢 COMPANIES ({companies.length})</h2>
            <Link href="/add-company" className="add-btn">+ NEW</Link>
          </div>

          <div className="company-stack">
            {companies.map((company) => (
              <div
                key={company.id}
                className={`company-item ${company.verification_status}`}
                onClick={(e) => handleCardClick(company, e)}
              >
                <div className="company-main">
                  <h3>{company.company_name}</h3>
                  <div className="company-id">#{company.company_id}</div>
                </div>

                <div className="company-status">
                  <span className={`status-tag ${company.payment_status}`}>{company.payment_status}</span>
                  <span className={`status-tag ${company.verification_status}`}>{company.verification_status}</span>
                </div>

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
                    {loadingCompanyId === company.id ? '↻' : 'View Details'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isRecheckModal && selectedCompany && (
        <Modal
          isOpen={isRecheckModal}
          onClose={() => setIsRecheckModal(false)}
          title={`Payment Status - ${selectedCompany.company_name}`}
          width="900px"
        >
          <p>
            Payment for <strong>{selectedCompany.company_name}</strong> is still pending.
            Please complete the payment or contact support.
          </p>
          {/* Additional logic or retry payment component can go here */}
        </Modal>
      )}
    </div>
  )
}

export default Profile
