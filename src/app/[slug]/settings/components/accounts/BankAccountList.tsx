'use client';
import React, { useState } from 'react';
import {
    useFetchCompanyAccountsQuery,
    useAddCompanyAccountsMutation,
    useUpdateCompanyAccountMutation,
    useDeleteCompanyAccountMutation,
} from '@/slices/company/companyApi';
import BankAccountForm from './BankAccountForm';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import Modal from '@/components/common/Modal';
import EmptyState from '@/components/common/EmptyState';
import { FaUniversity, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const BankAccountList = () => {
    const { data, isLoading, error, refetch } = useFetchCompanyAccountsQuery();
    const [addAccount] = useAddCompanyAccountsMutation();
    const [updateAccount] = useUpdateCompanyAccountMutation();
    const [deleteAccount] = useDeleteCompanyAccountMutation();

    const accounts = data?.accounts ?? [];

    const [showForm, setShowForm] = useState(false);
    const [editAccount, setEditAccount] = useState<BankAccount | null>(null);

    const openAddModal = () => {
        setEditAccount(null);
        setShowForm(true);
    };

    const openEditModal = (account: BankAccount) => {
        setEditAccount(account);
        setShowForm(true);
    };

    const closeModal = () => {
        setEditAccount(null);
        setShowForm(false);
    };

    const handleCreate = async (account: AddCompanyAccountsPayload['accounts'][0]) => {
        try {
            const formData = new FormData();
            Object.entries(account).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value as string | Blob);
                }
            });
            await addAccount(formData).unwrap();
            toast.success('Bank account added successfully');
            closeModal();
            refetch();
        } catch (e) {
            toast.error('Failed to add bank account');
            console.error('Failed to add account', e);
        }
    };

    const handleUpdate = async (updated: AddCompanyAccountsPayload['accounts'][0]) => {
        if (!editAccount) return;
        try {
            await updateAccount({ id: editAccount.id, ...updated }).unwrap();
            toast.success('Bank account updated successfully');
            closeModal();
            refetch();
        } catch (e) {
            toast.error('Failed to update bank account');
            console.error('Update failed', e);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this account?')) return;
        try {
            await deleteAccount(id).unwrap();
            toast.success('Bank account deleted successfully');
            refetch();
        } catch (e) {
            toast.error('Failed to delete bank account');
            console.error('Delete failed', e);
        }
    };

    const noAccounts = !isLoading && !error && accounts.length === 0;

    const columns = [
        { label: 'Bank Name', key: 'bank_name' as keyof BankAccount },
        { label: 'Account Number', key: 'account_number' as keyof BankAccount },
        { label: 'IFSC Code', key: 'ifsc_code' as keyof BankAccount },
        { label: 'Type', key: 'type' as keyof BankAccount },
        {
            label: 'Actions',
            render: (account: BankAccount) => (
                <div className="action-buttons">
                    <button
                        type="button"
                        className="icon-button edit-button"
                        onClick={() => openEditModal(account)}
                        title="Edit"
                        style={{ marginRight: 8 }}
                    >
                        <FaEdit />
                    </button>
                    <button
                        type="button"
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

    return (
        <div className="bank-account-list">
            {!noAccounts && (
                <div className="add-bank-btn-outer">
                    <button onClick={() => setShowForm(true)} className="buttons" disabled={showForm} type="button">
                       <FaPlus/> Add Bank Account
                    </button>
                </div>
            )}

            <Modal
                isOpen={showForm}
                onClose={closeModal}
                title={editAccount ? 'Edit Bank Account' : 'Add Bank Account'}
                width="600px"
            >
                <BankAccountForm
                    initialData={editAccount || undefined}
                    onSubmit={editAccount ? handleUpdate : handleCreate}
                    onCancel={closeModal}
                />
            </Modal>

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
                        <button
                            className="buttons"
                            onClick={openAddModal}
                            color="primary"
                            type="button"
                        >
                            <FaPlus />Add Bank Account
                        </button>
                    }
                />
            )}

            {accounts.length > 0 && (
                <ResponsiveTable data={accounts} columns={columns} cardViewKey='bank_name' />
            )}
        </div>
    );
};

export default BankAccountList;
