import React from 'react';

type EmptyStateProps = {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

function EmptyState({
  title = 'No data available',
  message = 'There is nothing to display here at the moment.',
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`common-empty-state ${className}`}>
      <div className="empty-state-content">
        <div className="empty-state-icon-container">
          {icon}
        </div>
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-message">{message}</p>
        {action && <div className="empty-state-action buttons">{action}</div>}
      </div>


    </div>
  );
}

export default EmptyState;