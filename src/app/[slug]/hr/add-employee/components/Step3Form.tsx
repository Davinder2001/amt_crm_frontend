"use client";

import React from "react";
import { FaUniversity, FaCreditCard, FaQrcode, FaIdCard, FaImage } from "react-icons/fa";

interface Step3FormProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    errors: { [key: string]: string };
}

const Step3Form: React.FC<Step3FormProps> = ({ formData, handleChange, errors }) => {
    const renderField = (
        label: string,
        name: string,
        type = "text",
        placeholder = "",
        Icon?: React.ElementType
    ) => {
        return (
            <div className="employee-field">
                <label htmlFor={name} className="flex items-center gap-2">
                    {Icon && <Icon className="text-gray-600" />} {label}
                </label>
                <input
                    type={type}
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                />
                {errors[name] && <div className="text-red-500 text-sm">{errors[name]}</div>}
            </div>
        );
    };

    return (
        <div className="employee-fields-wrapper">
            {renderField("Bank Name", "bankName", "text", "Enter bank name", FaUniversity)}
            {renderField("Account No", "accountNo", "text", "Enter bank account number", FaCreditCard)}
            {renderField("IFSC Code", "ifscCode", "text", "Enter IFSC code", FaQrcode)}
            {renderField("PAN No", "panNo", "text", "Enter PAN number", FaIdCard)}
            {renderField("UPI ID", "upiId", "text", "Enter UPI ID", FaQrcode)}
            {renderField("Address Proof (e.g. Aadhar Number)", "addressProof", "text", "Enter Aadhar or other ID number", FaIdCard)}

            <div className="employee-field">
                <label htmlFor="profilePicture" className="flex items-center gap-2">
                    <FaImage className="text-gray-600" /> Profile Picture
                </label>
                <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleChange}
                    className="file-input"
                />
                {errors.profilePicture && (
                    <div className="text-red-500 text-sm">{errors.profilePicture}</div>
                )}
            </div>
        </div>
    );
};

export default Step3Form;