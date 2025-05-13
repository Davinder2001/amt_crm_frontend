// components/common/DatePickerField.tsx
'use client';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerFieldProps {
    label: string;
    selectedDate: string | null;
    onChange: (date: string) => void;
    required?: boolean;
    minDate?: Date;
    maxDate?: Date;
    placeholder?: string;
    className?: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
    label,
    selectedDate,
    onChange,
    required = false,
    minDate,
    maxDate,
    placeholder = 'Select date',
    className = '',
}) => {
    return (
        <div className={`add-items-form-input-label-container ${className}`}>
            <label>{label}{required && '*'}</label>
            <DatePicker
                selected={selectedDate ? new Date(selectedDate) : null}
                onChange={(date: Date | null) => onChange(date ? date.toISOString().split('T')[0] : '')}
                dateFormat="dd/MM/yyyy"
                placeholderText={placeholder}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                wrapperClassName="w-full"
                popperClassName="!z-[10000]"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                minDate={minDate}
                maxDate={maxDate}
                showMonthDropdown
                dropdownMode="select"
                required={required}
                dayClassName={date => date.getDay() === 0 ? 'datepicker-sunday' : ''}
                renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled
                }) => (
                    <div className="date-p-header">
                        <button
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                            className="date-p-btn"
                        >
                            {"<"}
                        </button>
                        <select
                            value={date.getFullYear()}
                            onChange={({ target: { value } }) => changeYear(Number(value))}
                            className="mr-2 p-1 bg-white border rounded"
                        >
                            {Array.from({ length: 100 }, (_, i) => (
                                <option key={i} value={new Date().getFullYear() - 99 + i}>
                                    {new Date().getFullYear() - 99 + i}
                                </option>
                            ))}
                        </select>
                        <select
                            value={date.toLocaleString("default", { month: "long" })}
                            onChange={({ target: { value } }) =>
                                changeMonth(new Date(Date.parse(value + " 1, 2000")).getMonth())
                            }
                            className="p-1 bg-white border rounded"
                        >
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={new Date(0, i).toLocaleString("default", { month: "long" })}>
                                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                            className="date-p-btn"
                        >
                            {">"}
                        </button>
                    </div>
                )}
            />
        </div>
    );
};

export default DatePickerField;