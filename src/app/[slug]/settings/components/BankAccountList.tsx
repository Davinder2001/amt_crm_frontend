// components/BankAccountList.tsx
'use client';
import React, { useState } from 'react';
import {
    useFetchCompanyAccountsQuery,
    useAddCompanyAccountsMutation,
} from '@/slices/company/companyApi';
import BankAccountItem from './BankAccountItem';
import BankAccountForm from './BankAccountForm';

const BankAccountList = () => {
    const { data, isLoading, error } = useFetchCompanyAccountsQuery();
    const [addAccounts] = useAddCompanyAccountsMutation();
    const [showForm, setShowForm] = useState(false);

    const handleCreate = async (account: AddCompanyAccountsPayload['accounts'][0]) => {
        try {
            const formData = new FormData();
            // Assuming account is an object with keys and values to append
            Object.entries(account).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value as string | Blob);
                }
            });
            await addAccounts(formData).unwrap();
            setShowForm(false);
        } catch (e) {
            console.error('Failed to add account', e);
        }
    };

    return (
        <div className="bank-account-list">
            <button onClick={() => setShowForm(!showForm)} className="btn">
                {showForm ? 'Cancel' : 'Add Bank Account'}
            </button>

            {showForm && <BankAccountForm onSubmit={handleCreate} />}

            {isLoading && <p>Loading accounts...</p>}
            {error && <p>Error loading accounts.</p>}

            {Array.isArray(data?.accounts) && data.accounts.length > 0 ? (
                data.accounts.map((account) => (
                    <BankAccountItem key={account.id} account={account} />
                ))
            ) : (
                !isLoading && !error && <p>No bank accounts found.</p>
            )}
        </div>
    );
};

export default BankAccountList;
