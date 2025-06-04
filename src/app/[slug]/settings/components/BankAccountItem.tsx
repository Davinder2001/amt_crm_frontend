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
        <div className="bank-account-item">
            {editMode ? (
                <BankAccountForm initialData={account} onSubmit={handleUpdate} onCancel={() => setEditMode(false)} />
            ) : (
                <div className="account-details">
                    <p>
                        <strong>{account.bank_name}</strong> - {account.account_number}
                    </p>
                    <p>
                        {account.ifsc_code} ({account.type})
                    </p>
                    <button className="btn" onClick={() => setEditMode(true)}>
                        Edit
                    </button>
                    <button className="btn danger" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default BankAccountItem;
