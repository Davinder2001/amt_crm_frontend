// 'use client';

// import React from 'react';
// import { useParams } from 'next/navigation';
// import { useFetchExpenseQuery } from '@/slices';
// import LoadingState from '@/components/common/LoadingState';

// export default function Page() {
//     const { id } = useParams();
//     const expenseId = Number(id);
//     const { data, isLoading, error } = useFetchExpenseQuery(expenseId);
//     const Expense = data?.data || null;

//     if (isLoading) return (
//         <LoadingState />
//     );

//     if (error) return (
//         <div className="expense-detail-page">
//             <div className="expense-container">
//                 <div className="error-state">Error loading expense details</div>
//             </div>
//         </div>
//     );

//     return (
//         <div className="expense-detail-page">
//             <div className="expense-container">
//                 {Expense && (
//                     <>
//                         <div className="expense-header">
//                             <div className="expense-title-wrapper">
//                                 <h1 className="expense-title">{Expense.heading}</h1>
//                                 <span className={`expense-status status-${Expense.status.toLowerCase()}`}>
//                                     {Expense.status}
//                                 </span>

//                             </div>
//                         </div>


//                         <div className="expense-content">
//                             <div className="expense-details">
//                                 <div className="detail-grid">
//                                     <div className="detail-card">
//                                         <div className="detail-label">Company ID</div>
//                                         <div className="detail-value">{Expense.company_id}</div>
//                                     </div>


//                                     <div className="detail-card">
//                                         <div className="detail-label">Amount</div>
//                                         <div className="detail-value price-value">{Expense.price}</div>
//                                     </div>

//                                     <div className="detail-card">
//                                         <div className="detail-label">Date</div>
//                                         <div className="detail-value">{new Date().toLocaleDateString()}</div>
//                                     </div>

//                                     <div className="expense-attachment">
//                                         <div className="attachment-header">
//                                             <h2 className="attachment-title">Receipt</h2>

//                                         </div>
//                                         <div className="attachment-image-container">
//                                             <img
//                                                 src={Expense.file_url}
//                                                 alt="Expense Receipt"
//                                                 className="attachment-image"
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="detail-card">
//                                         <div className="detail-label">Description</div>
//                                         <div className="detail-value">{Expense.description}</div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div >
//     );
// }








'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useFetchExpenseQuery } from '@/slices';
import LoadingState from '@/components/common/LoadingState';

export default function Page() {
    const { id } = useParams();
    const expenseId = Number(id);
    const { data, isLoading, error } = useFetchExpenseQuery(expenseId);
    const Expense = data?.data || null;

    if (isLoading) return <LoadingState />;

    if (error) return (
        <div className="error-container">
            <div className="error-card">
                <div className="error-icon">!</div>
                <h2>Failed to Load Expense</h2>
                <p>Please try refreshing the page or contact support.</p>
            </div>
        </div>
    );

    const hasAttachment = Expense?.file_url;

    return (
        <div className={`expense-page ${!hasAttachment ? 'no-sidebar' : ''}`}>
            <div className="expense-container">
                {Expense && (
                    <>
                        <div className="expense-header">
                            <div>
                                <h1 className="expense-title">{Expense.heading}</h1>
                                <div className="expense-meta">
                                    <span className={`status-badge ${Expense.status.toLowerCase()}`}>
                                        {Expense.status}
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div className="expense-content">
                            <div className="details-section">
                                <div className="detail-cards">
                                    <div className="detail-card">
                                        <label>Company ID</label>
                                        <p>{Expense.company_id}</p>
                                    </div>
                                    <div className="detail-card">
                                        <label>Total</label>
                                        <p className="amount">₹{Expense.price}</p>
                                    </div>
                                    <div className="detail-card">
                                        <label>Date</label>
                                        <p>{new Date().toLocaleDateString()}</p>
                                    </div>
                                    <div className="detail-card full-width">
                                        <label>Description</label>
                                        <div className="description-box">
                                            {Expense.description || 'No description provided'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {hasAttachment && (
                                <div className="receipt-sidebar">
                                    <div className="receipt-card">
                                        <h3>Receipt</h3>
                                        <div className="receipt-image-container">
                                            <img
                                                src={Expense.file_url}
                                                alt="Expense receipt"
                                                className="receipt-image"
                                            />
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}