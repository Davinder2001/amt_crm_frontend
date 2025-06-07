'use client';

import React, { useState } from 'react';
import {
    useFetchCompanyAccountsQuery,
    useAddCompanyAccountsMutation,
    useDeleteCompanyAccountMutation,
} from '@/slices/company/companyApi';

import BankAccountForm from './BankAccountForm';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import Modal from '@/components/common/Modal';
import EmptyState from '@/components/common/EmptyState';
import { toast } from 'react-toastify';

import { FaPlus, FaUniversity, FaTrash, FaEdit } from 'react-icons/fa';

const BankAccountList = () => {
    const { data, isLoading, error, refetch } = useFetchCompanyAccountsQuery();
    const [addAccount] = useAddCompanyAccountsMutation();
    const [deleteAccount] = useDeleteCompanyAccountMutation();

    const accounts = data?.accounts ?? [];

    const [showForm, setShowForm] = useState(false);
    const [editAccount, setEditAccount] = useState<any | null>(null);

    const handleCreate = async (account: any) => {
        try {
            const formData = new FormData();
            Object.entries(account).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value as string | Blob);
                }
            });

            await addAccount(formData).unwrap();
            toast.success('Bank account added successfully');
            setShowForm(false);
            refetch();
        } catch {
            toast.error('Failed to add bank account');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this account?')) return;
        try {
            await deleteAccount(id).unwrap();
            toast.success('Bank account deleted successfully');
            refetch();
        } catch {
            toast.error('Failed to delete bank account');
        }
    };

    const columns = [
        { label: 'Bank Name', key: 'bank_name' },
        { label: 'Account Number', key: 'account_number' },
        { label: 'IFSC Code', key: 'ifsc_code' },
        { label: 'Type', key: 'type' },
        {
            label: 'Actions',
            render: (account: any) => (
                <div className="action-buttons">
                    {/* Edit logic if needed later */}
                     <button
                        className="icon-button edit-button"
                        onClick={() => setEditAccount(account)}
                        title="Edit"
                    >
                        <FaEdit />
                    </button> 
                    <button
                        className="icon-button delete-button"
                        onClick={() => handleDelete(account.id)}
                        title="Delete"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    const noAccounts = !isLoading && !error && accounts.length === 0;

    return (
        <div className="bank-account-list">
            {!noAccounts && (
                <div className="add-bank-btn">
                    <button onClick={() => setShowForm(true)} className="buttons" disabled={showForm}>
                        Add Bank Account
                    </button>
                </div>
            )}

            <Modal
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setEditAccount(null);
                }}
                title="Add Bank Account"
                width="600px"
            >
                <BankAccountForm
                    onSubmit={handleCreate}
                    onCancel={() => {
                        setShowForm(false);
                        setEditAccount(null);
                    }}
                    initialData={editAccount || undefined}
                />
            </Modal>

            {isLoading && <p>Loading bank accounts...</p>}

            {error && (
                <EmptyState
                    icon="alert"
                    title="Failed to load bank accounts"
                    message="Something went wrong while fetching bank accounts."
                />
            )}

            {noAccounts && !showForm && (
                <EmptyState
                    icon={<FaUniversity className="empty-state-icon" />}
                    title="No Bank Accounts Found"
                    message="You haven't added any bank account details yet."
                    action={
                        <button className="buttons create-btn" onClick={() => setShowForm(true)}>
                            <FaPlus /> Add Bank Account
                        </button>
                    }
                />
            )}

            {accounts.length > 0 && (
                <ResponsiveTable data={accounts} columns={columns} />
            )}
        </div>
    );
};

export default BankAccountList;
