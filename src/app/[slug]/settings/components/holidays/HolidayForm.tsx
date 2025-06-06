'use client';
import React, { useState, useEffect } from 'react';

type Props = {
    onSubmit: (data: CreateHolidayPayload) => void;
    onCancel?: () => void;
    initialData?: Holiday;
};

const defaultForm: CreateHolidayPayload = {
    name: '',
    type: 'general',
};

const HolidayForm: React.FC<Props> = ({ onSubmit, onCancel, initialData }) => {
    const [form, setForm] = useState<CreateHolidayPayload>(defaultForm);

    useEffect(() => {
        if (initialData) {
            const { name, type } = initialData;
            setForm({ name, type });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="holiday-form-wrapper">
            <div className="holiday-form">
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Holiday Name"
                    required
                />
                <input
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    placeholder="date (YYYY-MM-DD)"
                    type="date"
                    required
                />

                <select name="type" value={form.type} onChange={handleChange}>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="general">General</option>
                </select>
            </div>

            <div className="holiday-form-actions">
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

export default HolidayForm;
