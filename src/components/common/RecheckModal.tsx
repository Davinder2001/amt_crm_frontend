// components/RecheckModal.tsx
import React from 'react';
import Modal from '../common/Modal';
import { useCompanyStatusDetailsQuery } from '@/slices';
import Loader from '../common/Loader';

interface RecheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyName: string;
    companyId: number;
}

const RecheckModal: React.FC<RecheckModalProps> = ({
    isOpen,
    onClose,
    companyName,
    companyId,
}) => {
    const { data, isLoading } = useCompanyStatusDetailsQuery(companyId);

    // Function to render status with appropriate styling
    const renderStatus = (status: string) => {
        const statusClasses = {
            pending: 'status-pending',
            completed: 'status-completed',
            verified: 'status-verified',
            rejected: 'status-rejected',
            active: 'status-active',
            inactive: 'status-inactive',
            expired: 'status-expired'
        };

        const className = statusClasses[status.toLowerCase() as keyof typeof statusClasses] || '';
        return <span className={`status-badge ${className}`}>{status}</span>;
    };

    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Payment Status - ${companyName}`}
            width="900px"
        >
            <div className="recheck-modal-content">
                {isLoading ? (
                    <Loader />
                ) : data ? (
                    <>
                        <div className="status-details-grid">
                            <div className="status-item">
                                <span className="status-label">Payment Status:</span>
                                {renderStatus(data.data.payment_status)}
                            </div>
                            <div className="status-item">
                                <span className="status-label">Verification:</span>
                                {renderStatus(data.data.verification_status)}
                            </div>
                            <div className="status-item">
                                <span className="status-label">Subscription:</span>
                                {renderStatus(data.data.subscription_status)}
                            </div>
                            {data.data.subscription_date && (
                                <div className="status-item">
                                    <span className="status-label">Subscription Date:</span>
                                    <span>{new Date(data.data.subscription_date).toLocaleDateString()}</span>
                                </div>
                            )}
                            {data.data.order_id && (
                                <div className="status-item">
                                    <span className="status-label">Order ID:</span>
                                    <span>{data.data.order_id}</span>
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </Modal>
    );
};

export default RecheckModal;