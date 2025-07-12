"use client";

import React from "react";
import { FormSectionProps } from "./types";

const BankInformationSection: React.FC<FormSectionProps> = ({
    renderField
}) => {
    return (
        <div className="form-card">
            <div className="form-card-content">
                <div className="form-grid">
                    {renderField("Bank Name", "bankName", "text", "Enter bank name")}
                    {renderField("Account No", "accountNo", "text", "Enter bank account number", undefined, 9, 18)}
                    {renderField("IFSC Code", "ifscCode", "text", "Enter IFSC code", undefined, 11, 11)}
                    {renderField("PAN No", "panNo", "text", "Enter PAN number", undefined, 10, 10)}
                    {renderField("UPI ID", "upiId", "text", "Enter UPI ID", undefined, 8, 40)}
                    {renderField("Address Proof (e.g. Aadhar Number)", "addressProof", "text", "Enter Aadhar or other ID number", undefined, 5, 12)}
                </div>
            </div>
        </div>
    );
};

export default BankInformationSection; 