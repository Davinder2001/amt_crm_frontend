// components/common/FormSelect.tsx
'use client';
import React from 'react';

interface FormSelectProps<T> {
  label?: string;
  name: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  placeholder?: string;
  className?: string;
}

export const FormSelect = <T extends string | number>({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
}: FormSelectProps<T>) => (
  <div className={`add-items-form-input-label-container ${className}`}>
    <label>{label || ''}</label>
    <select
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);