// app/dashboard/components/UserActivity.tsx
import React from 'react';

const UserActivity = () => {
    return (
        <div className="card user-activity">
            <h3>User Activity</h3>
            <div className="visitor">
                <span className="label orange">Online Visitor</span>
                <div className="count">556655</div>
            </div>
            <div className="chart-placeholder">[Online/Offline Line Chart]</div>
            <div className="visitor">
                <span className="label yellow">Offline Visitor</span>
                <div className="count">654055</div>
            </div>
        </div>
    );
};

export default UserActivity;
