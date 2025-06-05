// components/BankAccounts/BankAccountItem.tsx
import React, { useState } from 'react';
import {
    useDeleteCompanyAccountMutation,
    useUpdateCompanyAccountMutation,
} from '@/slices/company/companyApi';
import BankAccountForm from './BankAccountForm';

type Props = {
    account: BankAccount;
};

const BankAccountItem: React.FC<Props> = ({ account }) => {
    const [editMode, setEditMode] = useState(false);
    const [deleteAccount] = useDeleteCompanyAccountMutation();
    const [updateAccount] = useUpdateCompanyAccountMutation();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this account?')) {
            deleteAccount(account.id);
        }
    };

    const handleUpdate = async (updated: AddCompanyAccountsPayload['accounts'][0]) => {
        try {
            await updateAccount({ id: account.id, ...updated }).unwrap();
            setEditMode(false);
        } catch (e) {
            console.error('Update failed', e);
        }
    };

    return (
        <div className="bank-account-item ">
            {editMode ? (
                <BankAccountForm initialData={account} onSubmit={handleUpdate} onCancel={() => setEditMode(false)} />
            ) : (
                <div className="account-details">
                    <p>
                        <strong>Bank Name:</strong><span> {account.bank_name}  </span>
                    </p>
                    <p>
                        <strong>Account Number:</strong>  <span>{account.account_number}</span>
                    </p>
                    <p>
                        <strong>IFSC Code:</strong> <span>{account.ifsc_code} </span>
                    </p>
                    <p>
                        <strong>Account Type:</strong> <span>({account.type})</span>
                    </p>
                    <div className='bank-form-actions'>

                        <button className="Edit-btn" onClick={() => setEditMode(true)}>
                            Edit
                        </button>
                        <button className="Delete-btn" onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankAccountItem;
