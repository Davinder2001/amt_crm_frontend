"use client";

import React from "react";
import { FormSectionProps, ExtendedEmployeeFormData } from "./types";
import RequiredLabel from "./RequiredLabel";
import LoadingState from "@/components/common/LoadingState";

const JobInformationSection: React.FC<FormSectionProps> = ({
    formData,
    errors,
    mode,
    onFieldChange,
    renderField,
    rolesData,
    rolesLoading,
    rolesError,
    shiftData,
    shiftLoading,
    shiftError
}) => {
    // Provide default values to prevent undefined errors
    const safeFormData: ExtendedEmployeeFormData = formData || {
        name: '',
        email: '',
        password: '',
        number: 0,
        role: '',
        salary: 0,
        dateOfHire: new Date(),
        joiningDate: new Date(),
        shiftTimings: 0,
        address: '',
        nationality: '',
        dob: new Date(),
        religion: '',
        maritalStatus: '',
        idProofType: '',
        idProofValue: "",
        emergencyContact: 0,
        emergencyContactRelation: '',
        workLocation: '',
        joiningType: '',
        department: '',
        previousEmployer: '',
        acc_hol_name: '',
        bankName: '',
        accountNo: 0,
        ifscCode: '',
        panNo: '',
        upiId: '',
        addressProof: '',
        medicalInfo: '',
        profilePicture: null,
        addressProof_image: null, 
        utility_bill_image: null  
    };


    const safeErrors = errors || {};

    return (
        <div className="form-card">
            <div className="form-card-content">
                <div className="form-grid">
                    {renderField("Email", "email", "email", "Enter email address")}
                    {mode === "add" && renderField("Password", "password", "password", "Create a password")}
                    {renderField("Date of Hiring", "dateOfHire", "date", "Select hiring date")}
                    {renderField("Work Location", "workLocation", "text", "Enter work location")}
                    {renderField("Joining Date", "joiningDate", "date", "Select joining date")}
                    {renderField("Salary", "salary", "number", "Enter salary", undefined, 0)}

                    <div className="employee-field">
                        <RequiredLabel htmlFor="shiftTimings">Shift Timings</RequiredLabel>
                        <select
                            name="shiftTimings"
                            value={safeFormData.shiftTimings}
                            onChange={onFieldChange}
                            className={`select-field ${safeFormData.shiftTimings === 0 ? 'common-placeholder' : ''}`}
                        >
                            <option value={0} disabled hidden>Select Shift</option>
                            {shiftLoading ? (
                                <option disabled><LoadingState /></option>
                            ) : shiftError ? (
                                <option disabled>Error loading shifts</option>
                            ) : (
                                shiftData?.data?.map((shift: { id: number; shift_name: string; start_time: string; end_time: string }) => (
                                    <option key={shift.id} value={shift.id}>
                                        {`${shift.shift_name} (${shift.start_time} - ${shift.end_time})`}
                                    </option>
                                ))
                            )}
                        </select>
                        {safeErrors.shiftTimings && <div className="error-message">{safeErrors.shiftTimings}</div>}
                    </div>

                    <div className="employee-field">
                        <RequiredLabel htmlFor="role" className="flex items-center gap-2">
                            Role
                        </RequiredLabel>
                        <div className="custom-select-wrapper">
                            <select
                                name="role"
                                value={safeFormData.role}
                                onChange={onFieldChange}
                                disabled={rolesLoading || !!rolesError}
                                className={`select-field ${safeFormData.role === '' ? 'common-placeholder' : ''} ${safeErrors.role ? 'error' : ''}`}
                            >
                                <option value="">Select Role</option>
                                {rolesLoading ? (
                                    <option disabled>Loading...</option>
                                ) : rolesError ? (
                                    <option disabled>Error loading roles</option>
                                ) : (
                                    rolesData?.roles?.map((role: { id: string; name: string }) => (
                                        <option key={role.id} value={role.name}>
                                            {role.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                        {safeErrors.role && <div className="error-message">{safeErrors.role}</div>}
                    </div>

                    {renderField("Department", "department", "text", "Enter department")}

                    <div className="employee-field">
                        <RequiredLabel htmlFor="joiningType" className="flex items-center gap-2">
                            Joining Type
                        </RequiredLabel>
                        <div className="custom-select-wrapper">
                            <select
                                name="joiningType"
                                value={safeFormData.joiningType}
                                onChange={onFieldChange}
                                className={`select-field ${safeFormData.joiningType === '' ? 'common-placeholder' : ''} ${safeErrors.joiningType ? 'error' : ''}`}
                            >
                                <option value="">Select Joining Type</option>
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                            </select>
                        </div>
                        {safeErrors.joiningType && <div className="error-message">{safeErrors.joiningType}</div>}
                    </div>

                    {renderField("Previous Employer", "previousEmployer", "text", "Enter previous employer")}
                    {renderField("Medical Info (e.g., Blood Group)", "medicalInfo", "text", "Enter medical info")}
                </div>
            </div>
        </div>
    );
};

export default JobInformationSection; 