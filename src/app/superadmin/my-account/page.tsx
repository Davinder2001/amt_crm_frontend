'use client'
import { useFetchProfileQuery, useFetchLoginSessionsQuery } from '@/slices'
import { useState } from 'react'
import LoadingState from '@/components/common/LoadingState'
import EmptyState from '@/components/common/EmptyState'
import { FaEdit, FaLock, FaUser } from 'react-icons/fa'
import Modal from '@/components/common/Modal'
import { EditUserModal } from '@/app/[slug]/my-account/components/EditUserModal'
import ChangePassword from '@/app/[slug]/my-account/components/changePassword'
import { FaTriangleExclamation } from 'react-icons/fa6'

const Profile = () => {
  const { data, isLoading, error } = useFetchProfileQuery()
  const user = data?.user;

  const [editUserModal, setEditUserModal] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const { data: sessionsData } = useFetchLoginSessionsQuery();
  const totalLogins = sessionsData?.total_logins || 0;


  const handleEditOpen = (id: number) => {
    setEditUserModal(true);
    setUserId(id);
  }

  if (isLoading) return <LoadingState />
  if (error)
    return (
      <EmptyState
        icon={<FaTriangleExclamation className='empty-state-icon' />}
        title="Failed to fetching profile data."
        message="Something went wrong while fetching profile data."
      />
    );

  return (
    <>
      {/* Layout */}
      <div className="my-acc-layout">
        {/* personal account Panel */}
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

    </>
  )
}

export default Profile
