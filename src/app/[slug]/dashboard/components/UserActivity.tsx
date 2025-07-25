// app/dashboard/components/UserActivity.tsx
"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const activityData = [
    { name: 'Jan', online: 420000, offline: 510000 },
    { name: 'Feb', online: 480000, offline: 590000 },
    { name: 'Mar', online: 520000, offline: 630000 },
    { name: 'Apr', online: 490000, offline: 610000 },
    { name: 'May', online: 550000, offline: 650000 },
    { name: 'Jun', online: 600000, offline: 680000 },
    { name: 'Jul', online: 580000, offline: 670000 },
    { name: 'Aug', online: 560000, offline: 655000 },
    { name: 'Sep', online: 540000, offline: 640000 },
    { name: 'Oct', online: 530000, offline: 630000 },
    { name: 'Nov', online: 570000, offline: 660000 },
    { name: 'Dec', online: 620000, offline: 700000 },
];

const UserActivity = () => {
    return (
        <div className="card user-activity">
            <h3>User Activity</h3>

            <div className="visitor">
                <span className="label orange">Online Visitor</span>
                <div className="count">556,555</div>
            </div>

            <div className="chart-placeholder" style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={activityData}
                        margin={{
                            top: 10,
                            right: 0,
                            left: 0,
                            bottom: 5,
                        }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#888', fontSize: 12 }}
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#888', fontSize: 12 }}
                            width={40}
                            tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                value.toLocaleString(),
                                name === 'online' ? 'Online' : 'Offline'
                            ]}
                            labelFormatter={(label) => label}
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                padding: '8px'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="online"
                            stroke="var(--primary-color)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, stroke: 'var(--primary-color)', strokeWidth: 2, fill: '#fff' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="offline"
                            stroke="var(--primary-light)"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, stroke: 'var(--primary-light)', strokeWidth: 2, fill: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="visitor">
                <span className="label yellow">Offline Visitor</span>
                <div className="count">654,055</div>
            </div>
        </div>
    );
};

export default UserActivity;