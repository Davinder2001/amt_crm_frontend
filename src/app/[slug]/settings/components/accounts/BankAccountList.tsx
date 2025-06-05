'use client';
import React, { useState } from 'react';
import {
    useFetchCompanyAccountsQuery,
    useAddCompanyAccountsMutation,
} from '@/slices/company/companyApi';
import BankAccountItem from './BankAccountItem';
import BankAccountForm from './BankAccountForm';
import EmptyState from '@/components/common/EmptyState';
import { FaUniversity, FaPlus } from 'react-icons/fa';
import { Button } from '@mui/material';

const BankAccountList = () => {
    const { data, isLoading, error, refetch } = useFetchCompanyAccountsQuery();
    const [addAccounts] = useAddCompanyAccountsMutation();
    const [showForm, setShowForm] = useState(false);

    const handleCreate = async (account: AddCompanyAccountsPayload['accounts'][0]) => {
        try {
            const formData = new FormData();
            Object.entries(account).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value as string | Blob);
                }
            });
            await addAccounts(formData).unwrap();
            setShowForm(false);
            refetch();
        } catch (e) {
            console.error('Failed to add account', e);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
    };

    const noAccounts = !isLoading && !error && (!data?.accounts || data.accounts.length === 0);

    return (
        <div className="bank-account-list">
            {!noAccounts && (
                <div className='add-bank-btn'>
                    <button
                        onClick={() => setShowForm(true)}
                        className="buttons"
                        disabled={showForm}
                    >
                        Add Bank Account
                    </button>
                </div>
            )}

            {showForm && (
                <div className="form-wrapper">
                    <BankAccountForm
                        onSubmit={handleCreate}
                        onCancel={handleCancel}
                    />
                </div>
            )}

            {isLoading && <p>Loading accounts...</p>}

            {error && (
                <EmptyState
                    icon="alert"
                    title="Failed to load bank accounts"
                    message="Something went wrong while fetching bank account data. Please try again later."
                />
            )}

            {noAccounts && !showForm && (
                <EmptyState
                    icon={<FaUniversity className="empty-state-icon" />}
                    title="No Bank Accounts Found"
                    message="You haven't added any bank account details yet."
                    action={
                        <Button
                            className="buttons"
                            onClick={() => setShowForm(true)}
                            startIcon={<FaPlus />}
                        >
                            Add Bank Account
                        </Button>
                    }
                />
            )}

            <div className="account-list">
                {Array.isArray(data?.accounts) &&
                    data.accounts.map((account) => (
                        <div key={account.id} className="account-item">
                            <BankAccountItem account={account} />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default BankAccountList;
