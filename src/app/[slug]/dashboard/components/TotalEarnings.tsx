// app/dashboard/components/TotalEarnings.tsx
import React from 'react';

const TotalEarnings = () => {
    return (
        <div className="card total-earnings">
            <div className="card-header">
                <h3>Earnings</h3>
                <div className="dropdown">Today <span>▼</span></div>
            </div>
            <div className="chart-placeholder">[Line Chart: Paid vs Unpaid]</div>
            <div className="legend">
                <span className="dot paid"></span> Paid
                <span className="dot unpaid"></span> Unpaid
            </div>
        </div>
    );
};

export default TotalEarnings;
