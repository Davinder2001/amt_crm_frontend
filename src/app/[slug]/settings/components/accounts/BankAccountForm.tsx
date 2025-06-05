import React, { useState } from 'react';

type BankAccountFormProps = {
    onSubmit: (data: AddCompanyAccountsPayload['accounts'][0]) => void;
    onCancel?: () => void;
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
    onCancel, // ✅ Properly destructured here
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
        <form onSubmit={handleSubmit} className="bank-account-form-wrapper">
            <div className="bank-account-form">
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
                    type="number"
                    className="no-spinner"
                    onWheel={(e) => e.currentTarget.blur()}
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
            </div>

            <div className="bank-form-actions">

                {onCancel && (
                    <button type="button" className="buttons cancel" onClick={onCancel}>
                        Cancel
                    </button>
                )}
                <button className="buttons" type="submit">
                    Submit
                </button>

            </div>
        </form>
    );
};

export default BankAccountForm;
