"use client";

import React from "react";
import { FormSectionProps, ExtendedEmployeeFormData } from "./types";
import RequiredLabel from "./RequiredLabel";
import { getDefaultEmployeeForm } from "./utils";

const PersonalInformationSection: React.FC<FormSectionProps> = ({
    formData,
    errors,
    onFieldChange,
    renderField
}) => {
    const safeFormData: ExtendedEmployeeFormData = formData || getDefaultEmployeeForm();

    const safeErrors = errors || {};

    return (
        <div className="form-card">
            <div className="form-card-content">
                <div className="form-grid">
                    {renderField("Name", "name", "text", "Enter full name")}
                    <div className="employee-field">
                        <RequiredLabel htmlFor="number">Phone Number</RequiredLabel>
                        <input
                            type="text"
                            name="number"
                            value={safeFormData.number}
                            onChange={onFieldChange}
                            minLength={10}
                            maxLength={10}
                            pattern="\d{10}"
                            required
                            placeholder="Enter phone number"
                        />
                        {safeErrors.number && <div className="error-message">{safeErrors.number}</div>}
                    </div>
                    {renderField("Address", "address", "text", "Enter residential address")}

                    <div className="employee-field">
                        <RequiredLabel htmlFor="nationality" className="flex items-center gap-2">
                            Nationality
                        </RequiredLabel>
                        <select
                            name="nationality"
                            value={safeFormData.nationality}
                            onChange={onFieldChange}
                            className={`select-field ${safeFormData.nationality === '' ? 'common-placeholder' : ''}`}
                        >
                            <option value="">Select Nationality</option>
                            <option value="Indian">Indian</option>
                            <option value="Foreigner">Foreigner</option>
                            <option value="NRI">NRI</option>
                        </select>
                        {safeErrors.nationality && <div className="error-message">{safeErrors.nationality}</div>}
                    </div>

                    {renderField("Date of Birth", "dob", "date", "Select date of birth")}

                    <div className="employee-field">
                        <RequiredLabel htmlFor="religion" className="flex items-center gap-2">
                            Religion
                        </RequiredLabel>
                        <select
                            name="religion"
                            value={safeFormData.religion}
                            onChange={onFieldChange}
                            className={`select-field ${safeFormData.religion === '' ? 'common-placeholder' : ''}`}
                        >
                            <option value="">Select Religion</option>
                            <option value="Hinduism">Hinduism</option>
                            <option value="Islam">Islam</option>
                            <option value="Christianity">Christianity</option>
                            <option value="Sikhism">Sikhism</option>
                            <option value="Buddhism">Buddhism</option>
                            <option value="Jainism">Jainism</option>
                            <option value="Judaism">Judaism</option>
                            <option value="Other">Other</option>
                        </select>
                        {safeErrors.religion && <div className="error-message">{safeErrors.religion}</div>}
                    </div>

                    <div className="employee-field">
                        <RequiredLabel htmlFor="maritalStatus" className="flex items-center gap-2">
                            Marital Status
                        </RequiredLabel>
                        <select
                            name="maritalStatus"
                            value={safeFormData.maritalStatus}
                            onChange={onFieldChange}
                            className={`select-field ${safeFormData.maritalStatus === '' ? 'common-placeholder' : ''}`}
                        >
                            <option value="">Select Marital Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Separated">Separated</option>
                            <option value="Other">Other</option>
                        </select>
                        {safeErrors.maritalStatus && <div className="error-message">{safeErrors.maritalStatus}</div>}
                    </div>

                    <div className="employee-field">
                        <RequiredLabel htmlFor="idProofType" className="flex items-center gap-2">
                            ID Proof Type
                        </RequiredLabel>
                        <select
                            name="idProofType"
                            value={safeFormData.idProofType}
                            onChange={onFieldChange}
                            className={`select-field ${safeFormData.idProofType === '' ? 'common-placeholder' : ''}`}
                        >
                            <option value="">Select ID Proof</option>
                            <option value="aadhar">Aadhar Number</option>
                            <option value="license">License</option>
                            <option value="passport">Passport Number</option>
                            <option value="bill">Utility Bill</option>
                        </select>
                        {safeErrors.idProofType && <div className="error-message">{safeErrors.idProofType}</div>}
                    </div>

                    {safeFormData.idProofType && safeFormData.idProofType !== "bill" && (
                        <div className="employee-field">
                            <RequiredLabel className="flex items-center gap-2">
                                Enter {safeFormData.idProofType.charAt(0).toUpperCase() + safeFormData.idProofType.slice(1)} Number
                            </RequiredLabel>
                            <input
                                type="number"
                                name="idProofValue"
                                value={safeFormData.idProofValue}
                                onChange={onFieldChange}
                                minLength={
                                    safeFormData.idProofType === "aadhar" ? 12 :
                                        safeFormData.idProofType === "passport" ? 8 :
                                            safeFormData.idProofType === "license" ? 15 :
                                                undefined
                                }
                                maxLength={
                                    safeFormData.idProofType === "aadhar" ? 12 :
                                        safeFormData.idProofType === "license" ? 15 :
                                            safeFormData.idProofType === "passport" ? 8 :
                                                undefined
                                }
                                placeholder={`Enter ${safeFormData.idProofType} number`}
                            />
                            {safeErrors.idProofValue && <div className="error-message">{safeErrors.idProofValue}</div>}
                        </div>
                    )}

                    {renderField("Emergency Contact", "emergencyContact", "text", "Enter emergency contact number", undefined, 10, 10)}

                    <div className="employee-field">
                        <RequiredLabel htmlFor="emergencyContactRelation" className="flex items-center gap-2">
                            Emergency Contact Relation
                        </RequiredLabel>
                        <select
                            name="emergencyContactRelation"
                            value={safeFormData.emergencyContactRelation}
                            onChange={onFieldChange}
                            className={`select-field ${safeFormData.emergencyContactRelation === '' ? 'common-placeholder' : ''}`}
                        >
                            <option value="">Select Relation</option>
                            <option value="father">Father</option>
                            <option value="mother">Mother</option>
                            <option value="brother">Brother</option>
                            <option value="sister">Sister</option>
                            <option value="other">Other</option>
                        </select>
                        {safeErrors.emergencyContactRelation && (
                            <div className="error-message">{safeErrors.emergencyContactRelation}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInformationSection; 