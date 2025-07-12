"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RequiredLabel from "./RequiredLabel";

interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    Icon?: React.ElementType;
    min?: number;
    max?: number;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onDateChange?: (date: Date | null) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    name,
    type = "text",
    placeholder = "",
    Icon,
    min,
    max,
    value,
    onChange,
    onDateChange,
    error,
    required = false,
    disabled = false,
    className = ""
}) => {
    const isInvalid = !!error;

    return (
        <div className="employee-field">
            {required ? (
                <RequiredLabel htmlFor={name} className="flex items-center gap-2">
                    {Icon && <Icon className="text-gray-600" />} {label}
                </RequiredLabel>
            ) : (
                <label htmlFor={name} className="flex items-center gap-2">
                    {Icon && <Icon className="text-gray-600" />} {label}
                </label>
            )}

            {type === "date" ? (
                <DatePicker
                    selected={value ? new Date(value) : null}
                    onChange={(date: Date | null) => {
                        if (onDateChange) {
                            onDateChange(date);
                        }
                    }}
                    dateFormat="yyyy-MM-dd"
                    placeholderText={placeholder}
                    className="employ-dob-input"
                    wrapperClassName="w-full"
                    popperClassName="!z-[10000]"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    maxDate={new Date()}
                    showMonthDropdown
                    dropdownMode="select"
                    dayClassName={(date) =>
                        date.getDay() === 0 ? "datepicker-sunday" : ""
                    }
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value || ""}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (max && val.length > max) return;
                        onChange(e);
                    }}
                    placeholder={placeholder}
                    maxLength={max}
                    minLength={min}
                    required={required}
                    disabled={disabled}
                    className={className}
                />
            )}

            {isInvalid && (
                <div className="error-message">
                    {error}
                </div>
            )}
        </div>
    );
};

export default FormField; 