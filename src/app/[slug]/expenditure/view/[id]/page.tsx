'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useFetchExpenseQuery } from '@/slices';
import LoadingState from '@/components/common/LoadingState';
import Image from 'next/image';


export default function Page() {
    const { id } = useParams();
    const { data, isLoading, error } = useFetchExpenseQuery(Number(id));
    const expenseData = data?.data as ExpenseData | undefined;

    if (isLoading) return <LoadingState />;
    if (error) return <ErrorComponent message="Failed to Load Expense" />;
    if (!expenseData) return <ErrorComponent message="Expense Not Found" />;

    const hasAttachment = expenseData.file_url;
    const formattedDate = expenseData.created_at ?
        new Date(expenseData.created_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        }) : 'N/A';

    return (
        <div className={`expense-page ${!hasAttachment ? 'no-sidebar' : ''}`}>
            <div className="expense-container">
                <Header expense={expenseData} />

                <div className="expense-content">
                    <div className="details-section">
                        <DetailCards expense={expenseData} date={formattedDate} />
                    </div>

                    {hasAttachment && <ReceiptSidebar fileUrl={expenseData.file_url} />}
                </div>
            </div>
        </div>
    );
}

const ErrorComponent = ({ message }: { message: string }) => (
    <div className="error-container">
        <div className="error-card">
            <div className="error-icon">!</div>
            <h2>{message}</h2>
            <p>{message.includes('Failed') ? 'Please try refreshing the page or contact support.' :
                'The requested expense could not be loaded.'}</p>
        </div>
    </div>
);

const Header = ({ expense }: { expense: ExpenseData }) => (
    <div className="expense-header">
        <div className='header-content'>
            <h1>{expense.heading}</h1>
            <div className="meta">
                <span className={`badge ${expense.status}`}>{expense.status}</span>
            </div>
        </div>
    </div>
);

const DetailCards = ({ expense }: { expense: ExpenseData, date: string }) => (
    <div className="detail-cards">
        <DetailCard label="Company ID" value={expense.company_id} />
        <DetailCard label="Total Amount" value={`₹${expense.price}`} isAmount />
        <DetailCard label="Description" fullWidth>
            <div className="description">
                {expense.description || 'No description provided'}
            </div>
        </DetailCard>


        {expense.items_batches.length > 0 && (
            <DetailCard label="Items & Batches" fullWidth>
                <table>
                    <thead><tr><th>Item</th><th>Batch ID</th></tr></thead>
                    <tbody>
                        {expense.items_batches.map((item, i) => (
                            <tr key={i}>
                                <td>{item.item_name}</td>
                                <td className="mono">{item.batch_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DetailCard>
        )}

        {expense.invoices.length > 0 && (
            <DetailCard label="Related Invoices" fullWidth>
                <div className="invoices-scroll">
                    {expense.invoices.map(invoice => (
                        <div key={invoice.id} className="invoice-pill">
                            {invoice.name || `Invoice #${invoice.id}`}
                        </div>
                    ))}
                </div>
            </DetailCard>
        )}
        {expense.users.length > 0 && (
            <DetailCard label="Associated Users" fullWidth>
                <div className="users-grid">
                    {expense.users.slice(0, 5).map(user => (
                        <UserPill key={user.id} user={user} />
                    ))}
                    {expense.users.length > 5 && (
                        <div className="more-users">+{expense.users.length - 5} more</div>
                    )}
                </div>
            </DetailCard>
        )}

    </div>
);

const DetailCard = ({
    label,
    value,
    children,
    fullWidth = false,
    isAmount = false
}: DetailCardProps) => (
    <div className={`detail-card ${fullWidth ? 'full-width' : ''}`}>
        <label>{label}</label>
        {value !== undefined ? <p className={isAmount ? 'amount' : ''}>{value}</p> : children}
    </div>
);

const UserPill = ({ user }: { user: User }) => (
    <div className="user-pill">
        <span className="avatar">{user.name.charAt(0)}</span>
        <span>{user.name}</span>
    </div>
);

const ReceiptSidebar = ({ fileUrl }: { fileUrl: string }) => (
    <div className="receipt-sidebar">
        <div className="receipt-card">
            <h3>Attachment</h3>
            <div className="image-container">
                <Image
                    src={fileUrl}
                    alt="Attachment"
                    width={400}
                    height={500}
                    style={{ objectFit: 'contain' }}
                />
            </div>
        </div>
    </div>
);