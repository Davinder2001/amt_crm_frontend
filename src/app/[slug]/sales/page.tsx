// "use client"
// import React, { useState, useMemo } from 'react'
// import { useFetchSalesReportQuery } from '@/slices/reports/reportsApi';

// const getCurrentYear = () => new Date().getFullYear();
// const getCurrentMonthName = () =>
//     new Date().toLocaleString('default', { month: 'long' });

// const Page = () => {
//     const { data, error, isLoading } = useFetchSalesReportQuery();
//     const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
//     const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthName());

//     // Get available years from data (if API supports multiple years in future)
//     const availableYears = useMemo(() => {
//         if (!data) return [getCurrentYear()];
//         return [data.year]; // If API returns only one year, just use that
//     }, [data]);

//     // Get available months from data for the selected year
//     const availableMonths = useMemo(() => {
//         if (!data) return [];
//         return data.data.map((monthObj: any) => monthObj.month);
//     }, [data]);

//     // Find the month object for the selected month
//     const selectedMonthObj = useMemo(() => {
//         if (!data) return null;
//         return data.data.find((monthObj: any) => monthObj.month === selectedMonth);
//     }, [data, selectedMonth]);

//     React.useEffect(() => {
//         // If the selected month is not in available months (e.g., after year change), reset to first available
//         if (availableMonths.length && !availableMonths.includes(selectedMonth)) {
//             setSelectedMonth(availableMonths[0]);
//         }
//     }, [availableMonths, selectedMonth]);

//     if (isLoading) return <div>Loading...</div>;
//     if (error) return <div>Error loading sales report.</div>;
//     if (!data) return <div>No data found.</div>;

//     return (
//         <div>
//             <h2>Sales Report</h2>
//             <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
//                 <div>
//                     <label htmlFor="year-select">Year: </label>
//                     <select
//                         id="year-select"
//                         value={selectedYear}
//                         onChange={e => setSelectedYear(Number(e.target.value))}
//                     >
//                         {availableYears.map((year: number) => (
//                             <option key={year} value={year}>{year}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div>
//                     <label htmlFor="month-select">Month: </label>
//                     <select
//                         id="month-select"
//                         value={selectedMonth}
//                         onChange={e => setSelectedMonth(e.target.value)}
//                     >
//                         {availableMonths.map((month: string) => (
//                             <option key={month} value={month}>{month}</option>
//                         ))}
//                     </select>
//                 </div>
//             </div>
//             <h3>{selectedMonth}</h3>
//             {selectedMonthObj && (
//                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                     <thead>
//                         <tr>
//                             <th style={{ border: '1px solid #ccc', padding: '8px' }}>Sr No</th>
//                             <th style={{ border: '1px solid #ccc', padding: '8px' }}>Item Name</th>
//                             <th style={{ border: '1px solid #ccc', padding: '8px' }}>Quantity</th>
//                             <th style={{ border: '1px solid #ccc', padding: '8px' }}>Sales</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {selectedMonthObj.items.map((item: any, idx: number) => (
//                             <tr key={item.item_name + '-' + idx}>
//                                 <td style={{ border: '1px solid #ccc', padding: '8px' }}>{idx + 1}</td>
//                                 <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.item_name}</td>
//                                 <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.quantity}</td>
//                                 <td style={{ border: '1px solid #ccc', padding: '8px' }}>{item.sales}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//             {!selectedMonthObj && <div>No data for selected month.</div>}
//         </div>
//     );
// }

// export default Page;



















"use client"
import React, { useState, useMemo } from 'react'
import { useFetchSalesReportQuery } from '@/slices/reports/reportsApi';

// Define types for your data structure
type SalesItem = {
    item_name: string;
    quantity: number;
    sales: number;
};

type MonthData = {
    month: string;
    items: SalesItem[];
};

const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonthName = () =>
    new Date().toLocaleString('default', { month: 'long' });

const Page = () => {
    const { data, error, isLoading } = useFetchSalesReportQuery();
    const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
    const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthName());

    // Get available years from data (if API supports multiple years in future)
    const availableYears = useMemo(() => {
        if (!data) return [getCurrentYear()];
        return [data.year]; // If API returns only one year, just use that
    }, [data]);

    // Get available months from data for the selected year
    const availableMonths = useMemo(() => {
        if (!data) return [];
        return data.data.map((monthObj: MonthData) => monthObj.month);
    }, [data]);

    // Find the month object for the selected month
    const selectedMonthObj = useMemo(() => {
        if (!data) return null;
        return data.data.find((monthObj: MonthData) => monthObj.month === selectedMonth);
    }, [data, selectedMonth]);

    React.useEffect(() => {
        // If the selected month is not in available months (e.g., after year change), reset to first available
        if (availableMonths.length && !availableMonths.includes(selectedMonth)) {
            setSelectedMonth(availableMonths[0]);
        }
    }, [availableMonths, selectedMonth]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading sales report.</div>;
    if (!data) return <div>No data found.</div>;

    return (
        <div>
            <h2>Sales Report</h2>
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
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Quantity</th>
                            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedMonthObj.items.map((item: SalesItem, idx: number) => (
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