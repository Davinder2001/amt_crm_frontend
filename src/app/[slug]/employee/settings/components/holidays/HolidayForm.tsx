import React, { useEffect, useRef, useState } from 'react';

type Props = {
    onSubmit: (data: CreateHolidayPayload) => void;
    onCancel?: () => void;
    initialData?: Holiday;
};

const defaultForm: CreateHolidayPayload = {
    name: '',
    type: 'general',
    day: '',
};

const HolidayForm: React.FC<Props> = ({ onSubmit, onCancel, initialData }) => {
    const [form, setForm] = useState<CreateHolidayPayload>(defaultForm);
    const dateInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            const { name, type, day } = initialData;
            setForm({ name, type, day });
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
                <div  className='form-input-lable-wrapper'>
                    <label>Holiday Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Holiday Name"
                        required
                    />
                </div>

                <div className='form-input-lable-wrapper' onClick={() => dateInputRef.current?.showPicker()}>
                    <label>Day</label>
                    <input
                        ref={dateInputRef}
                        name="day"
                        value={form.date}
                        onChange={handleChange}
                        placeholder="Select Date"
                        type="date"
                        required
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div  className='form-input-lable-wrapper'>
                    <label>Type</label>
                    <select name="type" value={form.type} onChange={handleChange}>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="general">General</option>
                    </select>
                </div>
            </div>

            <div className="holiday-form-actions">
                {onCancel && (
                    <button type="button" className="buttons cancel cancel-btn" onClick={onCancel}>
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
