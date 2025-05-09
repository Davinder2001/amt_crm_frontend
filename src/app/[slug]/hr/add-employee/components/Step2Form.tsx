"use client";

import React from "react";
import { FaEnvelope, FaLock, FaMoneyBillWave, FaCalendarAlt, FaBuilding, FaBriefcase, FaHospital, FaUniversity, FaIdCard } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Step2FormProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    errors: { [key: string]: string };
    shiftData: any;
    shiftLoading: boolean;
    shiftError: any;
    rolesData: any;
    rolesLoading: boolean;
    rolesError: any;
}

const Step2Form: React.FC<Step2FormProps> = ({
    formData,
    handleChange,
    setFormData,
    errors,
    shiftData,
    shiftLoading,
    shiftError,
    rolesData,
    rolesLoading,
    rolesError
}) => {
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

                {type === "date" ? (
                    <DatePicker
                        selected={formData[name] ? new Date(formData[name] as string) : null}
                        onChange={(date: Date | null) =>
                            setFormData((prev: any) => ({
                                ...prev,
                                [name]: date ? date.toISOString().split("T")[0] : "",
                            }))
                        }
                        dateFormat="yyyy-MM-dd"
                        placeholderText={placeholder}
                        className="your-input-class"
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={formData[name] || ""}
                        onChange={handleChange}
                        placeholder={placeholder}
                    />
                )}

                {errors[name] && <div className="text-red-500 text-sm">{errors[name]}</div>}
            </div>
        );
    };

    return (
        <div className="employee-fields-wrapper">
            {renderField("Email", "email", "email", "Enter email address", FaEnvelope)}
            {renderField("Password", "password", "password", "Create a password", FaLock)}
            {renderField("Salary", "salary", "text", "Enter expected salary", FaMoneyBillWave)}
            {renderField("Current Salary", "currentSalary", "text", "Enter current salary", FaMoneyBillWave)}
            {renderField("Date of Hiring", "dateOfHire", "date", "Select hiring date", FaCalendarAlt)}
            {renderField("Work Location", "workLocation", "text", "Enter work location", FaBuilding)}
            {renderField("Joining Date", "joiningDate", "date", "Select joining date", FaCalendarAlt)}

            <div className="employee-field">
                <label htmlFor="shiftTimings">Shift Timings</label>
                <select
                    name="shiftTimings"
                    value={formData.shiftTimings}
                    onChange={handleChange}
                >
                    <option value="">Select Shift</option>
                    {shiftLoading ? (
                        <option disabled>Loading shifts...</option>
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
                {errors.shiftTimings && (
                    <div className="text-red-500 text-sm">{errors.shiftTimings}</div>
                )}
            </div>

            <div className="employee-field">
                <label htmlFor="role" className="flex items-center gap-2">
                    <FaIdCard className="text-gray-600" /> Role
                </label>
                <select name="role" value={formData.role} onChange={handleChange}>
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
                {errors.role && <div className="text-red-500 text-sm">{errors.role}</div>}
            </div>

            {renderField("Department", "department", "text", "Enter department", FaUniversity)}

            <div className="employee-field">
                <label htmlFor="joiningType" className="flex items-center gap-2">
                    <FaBriefcase className="text-gray-600" /> Joining Type
                </label>
                <select name="joiningType" value={formData.joiningType} onChange={handleChange}>
                    <option value="">Select Joining Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                </select>
                {errors.joiningType && (
                    <div className="text-red-500 text-sm">{errors.joiningType}</div>
                )}
            </div>

            {renderField("Previous Employer", "previousEmployer", "text", "Enter previous employer", FaBuilding)}
            {renderField("Medical Info (e.g., Blood Group)", "medicalInfo", "text", "Enter medical info", FaHospital)}
        </div>
    );
};

export default Step2Form;