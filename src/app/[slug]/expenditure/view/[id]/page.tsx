// 'use client';

// import React from 'react';
// import { useParams } from 'next/navigation';
// import { useFetchExpenseQuery } from '@/slices';

// export default function Page() {
//     const { id } = useParams();
//     const expenseId = Number(id);
//     const { data, isLoading, error } = useFetchExpenseQuery(expenseId);
//     const Expense = data?.data || null;

//     if (isLoading) return <p>Loading...</p>;
//     if (error) return <p>Error loading expense.</p>;

//     return (
//         <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
//             <h1 className="text-2xl font-semibold mb-4">Expense Details</h1>

//             {Expense ? (
//                 <div className="space-y-3">
//                     <p><strong>Company ID:</strong> {Expense.company_id}</p>
//                     <p><strong>Heading:</strong> {Expense.heading}</p>
//                     <p><strong>Description:</strong> {Expense.description}</p>
//                     <p><strong>Price:</strong> ₹{Expense.price}</p>
//                     <p><strong>Status:</strong> {Expense.status}</p>
//                     <div>
//                         <strong>Attachment:</strong><br />
//                         <img
//                             src={Expense.file_url}
//                             alt="Expense Attachment"
//                             className="max-w-full max-h-64 rounded border mt-2"
//                         />
//                     </div>
//                 </div>
//             ) : (
//                 <p>No expense found.</p>
//             )}
//         </div>
//     );
// }




'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useFetchExpenseQuery } from '@/slices';

export default function Page() {
    const { id } = useParams();
    const expenseId = Number(id);
    const { data, isLoading, error } = useFetchExpenseQuery(expenseId);
    const Expense = data?.data || null;

    if (isLoading) return (
      <div className="expense-detail-page">
        <div className="expense-container">
          <div className="loading-state">Loading expense details...</div>
        </div>
      </div>
    );
    
    if (error) return (
      <div className="expense-detail-page">
        <div className="expense-container">
          <div className="error-state">Error loading expense details</div>
        </div>
      </div>
    );

    return (
      <div className="expense-detail-page">
        <div className="expense-container">
          {Expense && (
            <>
              <div className="expense-header">
                <div className="expense-title-wrapper">
                  <h1 className="expense-title">{Expense.heading}</h1>
                  <div className="expense-meta">
                    <span className="expense-id">ID: {Expense.id}</span>
                    <span className={`expense-status status-${Expense.status.toLowerCase()}`}>
                      {Expense.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="expense-content">
                <div className="expense-details">
                  <div className="detail-grid">
                    <div className="detail-card">
                      <div className="detail-label">Company ID</div>
                      <div className="detail-value">{Expense.company_id}</div>
                    </div>
                    
                    <div className="detail-card">
                      <div className="detail-label">Description</div>
                      <div className="detail-value">{Expense.description}</div>
                    </div>
                    
                    <div className="detail-card">
                      <div className="detail-label">Amount</div>
                      <div className="detail-value price-value">{Expense.price}</div>
                    </div>
                    
                    <div className="detail-card">
                      <div className="detail-label">Date</div>
                      <div className="detail-value">{new Date().toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="expense-attachment">
                  <div className="attachment-header">
                    <h2 className="attachment-title">Receipt</h2>
                    
                  </div>
                  <div className="attachment-image-container">
                    <img
                      src={Expense.file_url}
                      alt="Expense Receipt"
                      className="attachment-image"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
}