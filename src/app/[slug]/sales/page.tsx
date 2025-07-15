"use client"
import React, { useState, useMemo } from 'react'
import { useFetchSalesReportQuery } from '@/slices/reports/reportsApi';
import LoadingState from '@/components/common/LoadingState';

const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonthName = () =>
    new Date().toLocaleString('default', { month: 'long' });

const Page = () => {
    const { data, error, isLoading } = useFetchSalesReportQuery();
    const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
    const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthName());

    const availableYears = useMemo(() => {
        if (!data) return [getCurrentYear()];
        return [data.year];
    }, [data]);

    const availableMonths = useMemo(() => {
        if (!data) return [];
        return data.data.map((monthObj: SalesReportMonth) => monthObj.month);
    }, [data]);

    const selectedMonthObj = useMemo(() => {
        if (!data) return null;
        return data.data.find((monthObj: SalesReportMonth) => monthObj.month === selectedMonth) || null;
    }, [data, selectedMonth]);

    React.useEffect(() => {
        if (availableMonths.length && !availableMonths.includes(selectedMonth)) {
            setSelectedMonth(availableMonths[0]);
        }
    }, [availableMonths, selectedMonth]);

    if (isLoading) return <LoadingState/>;
    if (error) return <div>Error loading sales report.</div>;
    if (!data) return <div>No data found.</div>;

    return (
        <div>
            <div className="filter-controls">
            <h2 className="sales-report">Sales Report</h2>
                <div className="filter-group-inner">
                <div className="filter-group">
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
                <div className="filter-group">
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
            </div>
            {selectedMonthObj && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Sr No</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Item Name</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Quantity</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedMonthObj.items.map((item: SalesReportItem, idx: number) => (
                            <tr key={item.item_name + '-' + idx}>
                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{idx + 1}</td>
                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.item_name}</td>
                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.quantity}</td>
                                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.sales}</td>
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