// src/components/common/EmptyState.tsx
import React from 'react';
import { FiAlertCircle, FiDatabase, FiInbox, FiSearch, FiMeh } from 'react-icons/fi';

type EmptyStateProps = {
    title?: string;
    message?: string;
    icon?: 'default' | 'search' | 'data' | 'inbox' | 'alert' | 'meh';
    action?: React.ReactNode;
    className?: string;
};

const iconMap = {
    default: <FiDatabase className="empty-state-icon" />,
    search: <FiSearch className="empty-state-icon" />,
    data: <FiDatabase className="empty-state-icon" />,
    inbox: <FiInbox className="empty-state-icon" />,
    alert: <FiAlertCircle className="empty-state-icon" />,
    meh: <FiMeh className="empty-state-icon" />,
};

function EmptyState({
    title = 'No data available',
    message = 'There is nothing to display here at the moment.',
    icon = 'default',
    action,
    className = '',
}: EmptyStateProps) {
    return (
        <div className={`common-empty-state ${className}`}>
            <div className="empty-state-content">
                <div className="empty-state-icon-container">
                    {iconMap[icon]}
                </div>
                <h3 className="empty-state-title">{title}</h3>
                <p className="empty-state-message">{message}</p>
                {action && <div className="empty-state-action">{action}</div>}
            </div>

            <style>{`
        .common-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          min-height: 400px;
          width: 100%;
          animation: fadeIn 0.5s ease-out;
          color: gray;
        }

        .empty-state-content {
          max-width: 400px;
          margin: 0 auto;
        }

        .empty-state-icon-container {
          margin-bottom: 1.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(var(--primary-rgb), 0.1);
          color: var(--primary);
          position: relative;
        }

        .empty-state-icon-container::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid rgba(var(--primary-rgb), 0.2);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .empty-state-icon {
          font-size: 100px;
          animation: bounce 2s infinite;
        }

        .empty-state-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }

        .empty-state-message {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .empty-state-action {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
        </div>
    );
}

export default EmptyState;