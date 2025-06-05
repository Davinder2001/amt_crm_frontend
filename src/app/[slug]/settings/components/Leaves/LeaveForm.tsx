'use client';
import React, { useState, useEffect } from 'react';

type Props = {
    onSubmit: (data: CreateLeavePayload) => void;
    onCancel?: () => void;
    initialData?: Leave;
};

const defaultForm: CreateLeavePayload = {
    name: '',
    frequency: 'monthly',
    type: 'paid',
    count: 1,
};

const LeaveForm: React.FC<Props> = ({ onSubmit, onCancel, initialData }) => {
    const [form, setForm] = useState<CreateLeavePayload>(defaultForm);

    useEffect(() => {
        if (initialData) {
            const { name, frequency, type, count } = initialData;
            setForm({ name, frequency, type, count });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: name === 'count' ? +value : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="leave-form-wrapper">
            <div className="leave-form">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Leave Name" required />

                <select name="frequency" value={form.frequency} onChange={handleChange}>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>

                <select name="type" value={form.type} onChange={handleChange}>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                </select>

                <input type="number" name="count" value={form.count} onChange={handleChange} required />
            </div>

            <div className="leave-form-actions">
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

export default LeaveForm;
