// File: app/dashboard/components/TotalRevenue.tsx
"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy data for the chart
const revenueData = [
    { name: 'Jan', profit: 4000, loss: 2400 },
    { name: 'Feb', profit: 3000, loss: 1398 },
    { name: 'Mar', profit: 2000, loss: 9800 },
    { name: 'Apr', profit: 2780, loss: 3908 },
    { name: 'May', profit: 1890, loss: 4800 },
    { name: 'Jun', profit: 2390, loss: 3800 },
    { name: 'Jul', profit: 3490, loss: 4300 },
    { name: 'Aug', profit: 4000, loss: 2400 },
    { name: 'Sep', profit: 5000, loss: 1500 },
];

const TotalRevenue = () => {
    return (
        <div className="card total-revenue">
            <div className="card-header">
                <h3>Total Revenue</h3>
                <span className="revenue-value">
                    ₹50.4K <small className="green">↑ 5% than last month</small>
                </span>
            </div>
            <div className="chart-placeholder">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}
                        margin={{
                            top: 10,
                            right: 0,
                            left: 0, 
                            bottom: 5,
                        }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" style={{ fontSize: '12px', fill: '#384B70' }} padding={{ left: 10, right: 10 }}/>
                        <YAxis style={{ fontSize: '12px', fill: '#384B70' }} width={50}/>
                        <Tooltip />
                        <Bar dataKey="profit" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="loss" fill="var(--primary-light)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="legend">
                <span className="dot profit"></span> Profit
                <span className="dot loss"></span> Loss
            </div>
        </div>
    );
};

export default TotalRevenue;