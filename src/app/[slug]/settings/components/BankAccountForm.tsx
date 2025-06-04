// components/BankAccountForm.tsx
import React, { useState } from 'react';

type BankAccountFormProps = {
    onSubmit: (data: AddCompanyAccountsPayload['accounts'][0]) => void;
    initialData?: AddCompanyAccountsPayload['accounts'][0];
};

const defaultForm: AddCompanyAccountsPayload['accounts'][0] = {
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    type: 'current',
};

const BankAccountForm: React.FC<BankAccountFormProps> = ({
    onSubmit,
    initialData = defaultForm,
}) => {
    const [form, setForm] = useState(initialData);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form className="bank-account-form" onSubmit={handleSubmit}>
            <input
                name="bank_name"
                placeholder="Bank Name"
                value={form.bank_name}
                onChange={handleChange}
                required
            />
            <input
                name="account_number"
                placeholder="Account Number"
                value={form.account_number}
                onChange={handleChange}
                required
            />
            <input
                name="ifsc_code"
                placeholder="IFSC Code"
                value={form.ifsc_code}
                onChange={handleChange}
                required
            />
            <select name="type" value={form.type} onChange={handleChange}>
                <option value="current">Current</option>
                <option value="savings">Savings</option>
            </select>
            <button className="btn" type="submit">
                Submit
            </button>
        </form>
    );
};

export default BankAccountForm;
