// 'use client';

// import React from 'react';
// import { useParams } from 'next/navigation';
// import { useFetchExpenseQuery } from '@/slices';
// import LoadingState from '@/components/common/LoadingState';
// import Image from 'next/image';

// export default function Page() {
//   const { id } = useParams();
//   const expenseId = Number(id);
//   const { data, isLoading, error } = useFetchExpenseQuery(expenseId);

//   // Type assertion with proper checking
//   const expenseData = data?.data as ExpenseData | undefined;

//   if (isLoading) return <LoadingState />;

//   if (error) return (
//     <div className="error-container">
//       <div className="error-card">
//         <div className="error-icon">!</div>
//         <h2>Failed to Load Expense</h2>
//         <p>Please try refreshing the page or contact support.</p>
//       </div>
//     </div>
//   );

//   if (!expenseData) return (
//     <div className="error-container">
//       <div className="error-card">
//         <div className="error-icon">!</div>
//         <h2>Expense Not Found</h2>
//         <p>The requested expense could not be loaded.</p>
//       </div>
//     </div>
//   );

//   const hasAttachment = expenseData.file_url;
//   const formattedDate = expenseData.created_at 
//     ? new Date(expenseData.created_at).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       })
//     : 'N/A';

//   return (
//     <div className={`expense-page ${!hasAttachment ? 'no-sidebar' : ''}`}>
//       <div className="expense-container">
//         {expenseData && (
//           <>
//             <div className="expense-header">
//               <div>
//                 <h1 className="expense-title">{expenseData.heading}</h1>
//                 <div className="expense-meta">
//                   <span className="expense-id">ID: {expenseData.id}</span>
//                   <span className={`status-badge ${expenseData.status.toLowerCase()}`}>
//                     {expenseData.status}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="expense-content">
//               <div className="details-section">
//                 <div className="detail-cards">
//                   <div className="detail-card">
//                     <label>Company ID</label>
//                     <p>{expenseData.company_id}</p>
//                   </div>
//                   <div className="detail-card">
//                     <label>Total Amount</label>
//                     <p className="amount">₹{expenseData.price}</p>
//                   </div>
//                   <div className="detail-card">
//                     <label>Date Created</label>
//                     <p>{formattedDate}</p>
//                   </div>

//                   {expenseData.users.length > 0 && (
//                     <div className="detail-card">
//                       <label>Associated Users</label>
//                       <div className="users-list">
//                         {expenseData.users.map(user => (
//                           <span key={user.id} className="user-tag">
//                             {user.name} ,
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {expenseData.items_batches.length > 0 && (
//                     <div className="detail-card full-width">
//                       <label>Items & Batches</label>
//                       <div className="items-table">
//                         <table>
//                           <thead>
//                             <tr>
//                               <th>Item</th>
//                               <th>Batch ID</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {expenseData.items_batches.map((item, index) => (
//                               <tr key={index}>
//                                 <td>{item.item_name}</td>
//                                 <td>{item.batch_id}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   )}

//                   {expenseData.invoices.length > 0 && (
//                     <div className="detail-card full-width">
//                       <label>Related Invoices</label>
//                       <div className="invoices-list">
//                         {expenseData.invoices.map(invoice => (
//                           <div key={invoice.id} className="invoice-item">
//                             Invoice #{invoice.id}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <div className="detail-card full-width">
//                     <label>Description</label>
//                     <div className="description-box">
//                       {expenseData.description || 'No description provided'}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {hasAttachment && (
//                 <div className="receipt-sidebar">
//                   <div className="receipt-card">
//                     <h3>Receipt Attachment</h3>
//                     <div className="receipt-image-container">
//                       <Image
//                         src={expenseData.file_url}
//                         alt="Expense receipt"
//                         className="receipt-image"
//                         width={500}
//                         height={700}
//                         style={{ objectFit: 'contain' }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }












'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useFetchExpenseQuery } from '@/slices';
import LoadingState from '@/components/common/LoadingState';
import Image from 'next/image';

// Add these interfaces at the top of your file
interface User {
    id: number;
    name: string;
}

interface ItemBatch {
    item_id: number;
    item_name: string;
    batch_id: number;
}

interface Invoice {
    id: number;
    invoice_number?: string;
    // Add other invoice fields as needed
}

interface ExpenseData {
    id: number;
    company_id: number;
    heading: string;
    description: string | null;
    price: string;
    status: 'pending' | 'paid' | 'approved'; // Added 'approved' to match your CSS
    file_url: string;
    items_batches: ItemBatch[];
    invoices: Invoice[];
    users: User[];
    created_at?: string;
    updated_at?: string;
}

export default function Page() {
    const { id } = useParams();
    const expenseId = Number(id);
    const { data, isLoading, error } = useFetchExpenseQuery(expenseId);

    const expenseData = data?.data as ExpenseData | undefined;

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

    if (!expenseData) return (
        <div className="error-container">
            <div className="error-card">
                <div className="error-icon">!</div>
                <h2>Expense Not Found</h2>
                <p>The requested expense could not be loaded.</p>
            </div>
        </div>
    );

    const hasAttachment = expenseData.file_url;
    const formattedDate = expenseData.created_at
        ? new Date(expenseData.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'N/A';

    return (
        <div className={`expense-page ${!hasAttachment ? 'no-sidebar' : ''}`}>
            <div className="expense-container">
                <div className="expense-header">
                    <div>
                        <h1 className="expense-title">{expenseData.heading}</h1>
                        <div className="expense-meta">
                            <span className="expense-id">ID: {expenseData.id}</span>
                            <span className={`status-badge ${expenseData.status.toLowerCase()}`}>
                                {expenseData.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="expense-content">
                    <div className="details-section">
                        <div className="detail-cards">
                            {/* Basic info cards remain the same */}
                            <div className="detail-card">
                                <label>Company ID</label>
                                <p>{expenseData.company_id}</p>
                            </div>
                            <div className="detail-card">
                                <label>Total Amount</label>
                                <p className="amount">₹{expenseData.price}</p>
                            </div>
                            <div className="detail-card">
                                <label>Date Created</label>
                                <p>{formattedDate}</p>
                            </div>

                            {/* Enhanced Users Section */}
                            {expenseData.users.length > 0 && (
                                <div className="detail-card">
                                    <label>Associated Users</label>
                                    <div className="users-list">
                                        {expenseData.users.map(user => (
                                            <div key={user.id} className="user-item">
                                                <span className="user-avatar">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                                <span className="user-name">{user.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Items & Batches Section */}
                            {expenseData.items_batches.length > 0 && (
                                <div className="detail-card full-width">
                                    <label>Items & Batches</label>
                                    <div className="items-table-container">
                                        <table className="items-table">
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Batch ID</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {expenseData.items_batches.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="item-name">{item.item_name}</div>
                                                        </td>
                                                        <td>
                                                            <span className="batch-id">{item.batch_id}</span>
                                                        </td>
                                                        <td>
                                                            <button className="view-button">View</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Invoices Section */}
                            {expenseData.invoices.length > 0 && (
                                <div className="detail-card full-width">
                                    <label>Related Invoices</label>
                                    <div className="invoices-grid">
                                        {expenseData.invoices.map(invoice => (
                                            <div key={invoice.id} className="invoice-card">
                                                <div className="invoice-header">
                                                    <span className="invoice-number">
                                                        {invoice.invoice_number || `Invoice #${invoice.id}`}
                                                    </span>
                                                    <span className="invoice-status">Paid</span>
                                                </div>
                                                <div className="invoice-actions">
                                                    <button className="action-button view">View</button>
                                                    <button className="action-button download">Download</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="detail-card full-width">
                                <label>Description</label>
                                <div className="description-box">
                                    {expenseData.description || 'No description provided'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {hasAttachment && (
                        <div className="receipt-sidebar">
                            <div className="receipt-card">
                                <h3>Receipt Attachment</h3>
                                <div className="receipt-image-container">
                                    <Image
                                        src={expenseData.file_url}
                                        alt="Expense receipt"
                                        className="receipt-image"
                                        width={500}
                                        height={700}
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                                <div className="receipt-actions">
                                    <button className="download-button">
                                        <span className="icon">↓</span> Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}