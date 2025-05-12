// File: app/dashboard/components/TotalRevenue.tsx
import React from 'react';

const TotalRevenue = () => {
    return (
        <div className="card total-revenue">
            <div className="card-header">
                <h3>Total Revenue</h3>
                <span className="revenue-value">
                    ₹50.4K <small className="green">↑ 5% than last month</small>
                </span>
            </div>
            <div className="chart-placeholder">[Bar Chart: Profit vs Loss]</div>
            <div className="legend">
                <span className="dot profit"></span> Profit
                <span className="dot loss"></span> Loss
            </div>
        </div>
    );
};

export default TotalRevenue;