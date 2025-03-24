'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useFetchPaySlipByIdQuery } from '@/slices/employe/employe';

function Page() {
    const { setTitle } = useBreadcrumb();
    const { id } = useParams() as { id: string };
    const { currentData: user } = useFetchPaySlipByIdQuery(Number(id));

    useEffect(() => {
        setTitle('Pay Slip'); // Update breadcrumb title
    }, [setTitle]);

    // Function to print the pay slip
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="pay-slip-page">
            <button>
                <FaArrowLeft size={20} color='#009693' />
            </button>

            <div className="pay-slip-model print-area">
                <div className="payslip-header">
                    <h5>Lorem ipsum dolor sit amet.</h5>
                    <div>
                        <ul>
                            <li><strong>Company:</strong> {user?.company_name || 'Unknown'}</li>
                            <li><strong>Address:</strong> {user?.meta?.address || 'Unknown'}</li>
                            <li><strong>Invoice #:</strong> {user?.meta?.invoice || '#1022'}</li>
                        </ul>
                    </div>
                </div>

                <table className="payslip-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Earnings</th>
                            <th>Total</th>
                            <th>Deductions</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {user?.earnings?.map((earning, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{earning.name}</td>
                                <td>{earning.amount}</td>
                                <td>{user?.deductions?.[index]?.name || '-'}</td>
                                <td>{user?.deductions?.[index]?.amount || '-'}</td>
                            </tr>
                        ))} */}
                    </tbody>
                </table>
            </div>
            <div className="payslip-actions">
                <button onClick={handlePrint} className="print-button">
                    Print
                </button>
                <button className="download-button">
                    Save
                </button>
            </div>
            <style jsx>{`
    @media print {
        body * {
            visibility: hidden; /* Hide everything initially */
        }
        .print-area, .print-area * {
            visibility: visible; /* Show only the pay slip */
        }
        .print-area {
            position: fixed;
            background-color: #F1F9F9;
            display: flex;
            justify-content: center;
            align-items: center;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 999999999999;
        }
    }
`}</style>


        </div>
    );
}

export default Page;
