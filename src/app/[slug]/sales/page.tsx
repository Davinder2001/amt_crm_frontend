"use client"
import React, { useState, useEffect, useMemo } from 'react'
import { useFetchSalesReportQuery } from '@/slices/reports/reportsApi';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import ResponsiveTable from '@/components/common/ResponsiveTable';

type TableSalesReportItem = SalesReportItem & {
    id: number;
};

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

    // Adapt the items data to include required id field
    const tableData = useMemo(() => {
        if (!selectedMonthObj) return [];
        return selectedMonthObj.items.map((item, index) => ({
            ...item,
            id: index + 1, // Using index as id (you might want a better unique identifier)
            name: item.item_name // Mapping item_name to name if needed
        }));
    }, [selectedMonthObj]);

    useEffect(() => {
        if (availableMonths.length && !availableMonths.includes(selectedMonth)) {
            setSelectedMonth(availableMonths[0]);
        }
    }, [availableMonths, selectedMonth]);

    if (isLoading) return <LoadingState />;
    if (error) return <EmptyState
        icon="alert"
        title="Error loading sales report"
        message="We encountered an error while loading the sales report. Please try again later."
    />;
    if (!data) return <EmptyState
        icon="search"
        title="No data found"
        message="No sales report data available for the selected period."
    />;

    const columns = [
        { label: 'Item Name', key: 'item_name' as const },
        { label: 'Quantity', key: 'quantity' as const },
        { label: 'Sales', key: 'sales' as const },
    ];

    return (
        <div className='sales-report-page'>
            <div className="page-header">
                <div className="s-r-filter-controls">
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

            {selectedMonthObj ? (
                <div className="sales-report-content">
                    <h3>{selectedMonth} {selectedYear} Sales</h3>
                    <ResponsiveTable
                        data={tableData}
                        columns={columns}
                        cardView={(item: TableSalesReportItem) => (
                            <>
                                <div className="card-row">
                                    <h5>{item.item_name}</h5>
                                    <p> <strong> Quantity: </strong> {item.quantity}</p>
                                </div>
                                <div className="card-row">
                                    <p><strong> Sales: </strong> {item.sales}</p>
                                </div>
                            </>
                        )}
                    />
                </div>
            ) : (
                <EmptyState
                    icon="search"
                    title="No data available"
                    message="No sales data found for the selected month."
                />
            )}
        </div>
    );
}

export default Page;