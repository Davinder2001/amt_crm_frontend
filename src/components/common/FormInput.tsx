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
    disabled?: boolean;
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
    disabled = false,
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
            disabled={disabled} 
            onWheel={type === 'number' ? (e) => (e.target as HTMLInputElement).blur() : undefined}
            style={disabled ? { cursor: 'not-allowed', opacity: 0.6, backgroundColor: '#f5f5f5' } : {}}
        />
    </div>
);