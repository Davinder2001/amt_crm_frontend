'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';
import { Tabs, Tab } from '@mui/material';

const AttendancePage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { companySlug } = useCompany();
    const [activeTab, setActiveTab] = useState('present');

    // Define tabs
    const tabs = useMemo(() => [
        { id: 'present', label: 'Present' },
        { id: 'absent', label: 'Absent' },
        { id: 'late-arrival', label: 'Late Arrival' },
        { id: 'early-departures', label: 'Early Departures' },
        { id: 'time-off', label: 'Time Off' }
    ], []);

    // Set initial tab from URL params
    useEffect(() => {
        const tabParam = searchParams.get('status');
        if (tabParam && tabs.some(tab => tab.id === tabParam)) {
            setActiveTab(tabParam);
        }
    }, [searchParams, tabs]);

    // Handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
        router.push(`/${companySlug}/hr/attendance?status=${newValue}`);
    };

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'present':
                return (
                    <div>
                        {/* Add your Present tab content here */}
                        <h2>Present Employees</h2>
                        <p>This is where you&apos;ll display present employees</p>
                    </div>
                );
            case 'absent':
                return (
                    <div>
                        {/* Add your Absent tab content here */}
                        <h2>Absent Employees</h2>
                        <p>This is where you&apos;ll display absent employees</p>
                    </div>
                );
            case 'late-arrival':
                return (
                    <div>
                        {/* Add your Late Arrival tab content here */}
                        <h2>Late Arrivals</h2>
                        <p>This is where you&apos;ll display late arriving employees</p>
                    </div>
                );
            case 'early-departures':
                return (
                    <div>
                        {/* Add your Early Departures tab content here */}
                        <h2>Early Departures</h2>
                        <p>This is where you&apos;ll display early departing employees</p>
                    </div>
                );
            case 'time-off':
                return (
                    <div>
                        {/* Add your Time Off tab content here */}
                        <h2>Time Off</h2>
                        <p>This is where you&apos;ll display employees on leave/time off</p>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className='hr-attandance-status'>

            {/* Material UI Tabs */}
            <div className='hr-at-st-tabs'>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            color: 'var(--primary-color)',

                            '&.Mui-disabled': { color: '#ccc' },
                            '&.Mui-selected': { color: 'var(--primary-color)' },
                        },
                        '& .MuiTabs-indicator': { backgroundColor: 'var(--primary-color)' },
                    }}
                >
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.id}
                            label={tab.label}
                            value={tab.id}
                        />
                    ))}
                </Tabs>
            </div>

            {/* Tab Content */}
            <div className='hr-at-st-content'>
                {renderContent()}
            </div>
        </div>
    );
};

export default AttendancePage;