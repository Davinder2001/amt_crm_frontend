"use client"
import React, { useState, useMemo } from 'react'
import { useFetchRevenueReportQuery } from '@/slices/reports/reportsApi';
import { RevenueReportMonth, RevenueReportItem } from '@/types/reportsTypes';

const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonthName = () =>
    new Date().toLocaleString('default', { month: 'long' });

const Page = () => {
    const { data, error, isLoading } = useFetchRevenueReportQuery();
    const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
    const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthName());

    const availableYears = useMemo(() => {
        if (!data) return [getCurrentYear()];
        return [data.year];
    }, [data]);

    const availableMonths = useMemo(() => {
        if (!data) return [];
        return data.data.map((monthObj: RevenueReportMonth) => monthObj.month);
    }, [data]);

    const selectedMonthObj = useMemo(() => {
        if (!data) return null;
        return data.data.find((monthObj: RevenueReportMonth) => monthObj.month === selectedMonth) || null;
    }, [data, selectedMonth]);

    React.useEffect(() => {
        if (availableMonths.length && !availableMonths.includes(selectedMonth)) {
            setSelectedMonth(availableMonths[0]);
        }
    }, [availableMonths, selectedMonth]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading revenue report.</div>;
    if (!data) return <div>No data found.</div>;

    return (
        <div>
            <h2>Revenue Report</h2>
            <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
                <div>
                    <label htmlFor="year-select">Year: </label>
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={e => setSelectedYear(Number(e.target.value))}
                    >
                        {availableYears.map((year: number) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="month-select">Month: </label>
                    <select
                        id="month-select"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(e.target.value)}
                    >
                        {availableMonths.map((month: string) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
            </div>
            <h3>{selectedMonth}</h3>
            {selectedMonthObj && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Sr No</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Item Name</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedMonthObj.items.map((item: RevenueReportItem, idx: number) => (
                            <tr key={item.item_name + '-' + idx}>
                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{idx + 1}</td>
                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.item_name}</td>
                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.revenue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {!selectedMonthObj && <div>No data for selected month.</div>}
        </div>
    );
}

export default Page;