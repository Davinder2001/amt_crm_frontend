// components/common/FormInput.tsx
'use client';
import React from 'react';

interface FormInputProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: 'text' | 'number' | 'email' | 'password';
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    name,
    value,
    onChange,
    type = 'text',
    placeholder = '',
    required = false,
    className = '',
}) => (
    <div className={`add-items-form-input-label-container ${className}`}>
        <label>{label}{required && '*'}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            onWheel={type === 'number' ? (e) => (e.target as HTMLInputElement).blur() : undefined}
        />
    </div>
);