'use client'
import { useFetchProfileQuery, useFetchLoginSessionsQuery } from '@/slices'
import { useState } from 'react'
import LoadingState from '@/components/common/LoadingState'
import EmptyState from '@/components/common/EmptyState'
import { FaEdit, FaLock, FaUser, FaSignOutAlt, FaDesktop, FaGlobe, FaClock, FaCalendarAlt } from 'react-icons/fa'
import Modal from '@/components/common/Modal'
import { FaTriangleExclamation } from 'react-icons/fa6'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { EditUserModal } from '../../my-account/components/EditUserModal'
import ChangePassword from '../../my-account/components/changePassword'

const Profile = () => {
    const { data, isLoading, error } = useFetchProfileQuery()
    const user = data?.user;

    const [editUserModal, setEditUserModal] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [changePasswordModal, setChangePasswordModal] = useState(false);
    const { data: sessionsData, isLoading: sessionsLoading } = useFetchLoginSessionsQuery();
    const totalLogins = sessionsData?.total_logins || 0;
    const sessions = sessionsData?.sessions || [];

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
                        <div className="info-line"><span>Login Sessions</span><span className='status-tag'>{totalLogins}</span></div>
                    </div>
                </div>

                {/* Sessions Panel */}
                <div className="panel sessions-panel">
                    <div className="panel-header">
                        <h2><FaDesktop /> Active Sessions</h2>
                        <div className='panel-subtitle'>Manage and review your account&apos;s active login sessions</div>
                    </div>

                    {sessionsLoading ? (
                        <div className="session-loading">
                            <LoadingState />
                        </div>
                    ) : sessions.length === 0 ? (
                        <EmptyState
                            icon={<FaGlobe className="empty-state-icon" />}
                            title="No active sessions"
                            message="You don't have any active login sessions at this time."
                        />
                    ) : (
                        <div className="sessions-list">
                            {sessions.map((session: LoginSession) => (
                                <div key={session.token_id} className="session-item">
                                    <div className="session-icon">
                                        <FaGlobe />
                                    </div>
                                    <div className="session-details">
                                        <div className="session-meta">
                                            <span className="session-ip">{session.ip_address}</span>
                                            <span className="session-location">{session.location}</span>
                                        </div>
                                        <div className="session-info">
                                            <div className="session-info-item">
                                                <FaCalendarAlt className="info-icon" />
                                                <span>Created {formatDistanceToNow(parseISO(session.created_at))} ago</span>
                                            </div>
                                            <div className="session-info-item">
                                                <FaClock className="info-icon" />
                                                <span>Last used {formatDistanceToNow(parseISO(session.last_used_at))} ago</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="session-actions">
                                        <button className="session-action-btn">
                                            <FaSignOutAlt /> Revoke
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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