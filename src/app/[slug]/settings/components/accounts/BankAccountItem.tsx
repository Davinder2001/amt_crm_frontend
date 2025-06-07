// components/BankAccounts/BankAccountItem.tsx
import React, { useState } from 'react';
import {
    useDeleteCompanyAccountMutation,
} from '@/slices/company/companyApi';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toast } from 'react-toastify';

type Props = {
    account: BankAccount;
    onEdit: (account: BankAccount) => void;
};

const BankAccountItem: React.FC<Props> = ({ account, onEdit }) => {

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteAccount] = useDeleteCompanyAccountMutation();

    const handleDelete = async () => {

        try {
            const response = await deleteAccount(account.id).unwrap();
            toast.success(response.message);
            setShowConfirm(false);
        } catch {
            toast.error('Failed to delete bank account')
        }
    };

    return (
        <div className="bank-account-item">
            <div className="account-details">
                <p>
                    <strong>Bank Name:</strong><span> {account.bank_name} </span>
                </p>
                <p>
                    <strong>Account Number:</strong><span> {account.account_number} </span>
                </p>
                <p>
                    <strong>IFSC Code:</strong><span> {account.ifsc_code} </span>
                </p>
                <p>
                    <strong>Account Type:</strong><span> ({account.type}) </span>
                </p>
                <div className="bank-form-actions">
                    <button className="Edit-btn" onClick={() => onEdit(account)}>
                        Edit
                    </button>
                    <button className="Delete-btn" onClick={() => setShowConfirm(true)}>
                        Delete
                    </button>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showConfirm}
                message="Are you sure you want to delete Account?"
                onConfirm={handleDelete}
                onCancel={() => setShowConfirm(false)}
                type="delete"
            />
        </div>
    );
};

export default BankAccountItem;
