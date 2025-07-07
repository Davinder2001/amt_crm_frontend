"use client";

import React, { useState, useEffect } from "react";
import {
    useCreateEmployeMutation,
    useUpdateEmployeMutation,
    useFetchEmployeByIdQuery, useGetRolesQuery, useFetchCompanyShiftsQuery
} from "@/slices";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useCompany } from "@/utils/Company";
import { useCallback } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    FaArrowLeft,
    FaImage,
    FaMinus,
    FaPlus,
    FaUpload,

} from "react-icons/fa";
import Link from "next/link";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import LoadingState from "@/components/common/LoadingState";
import Image from "next/image";

const LOCAL_STORAGE_KEY = "addEmpForm";

const getDefaultEmployeeForm = () => ({
    name: "",
    number: "",
    address: "",
    nationality: "",
    dob: "",
    religion: "",
    maritalStatus: "",
    emergencyContact: "",
    emergencyContactRelation: "",
    email: "",
    password: "",
    salary: "",
    role: "",
    department: "",
    currentSalary: "",
    shiftTimings: "",
    dateOfHire: "",
    workLocation: "",
    joiningDate: "",
    joiningType: "",
    previousEmployer: "",
    medicalInfo: "",
    bankName: "",
    accountNo: "",
    ifscCode: "",
    panNo: "",
    upiId: "",
    addressProof: "",
    profilePicture: "",
    idProofType: "",
    idProofValue: "",
    utility_bill_image: null as File | null,
});

interface EmployeeFormProps {
    mode?: "add" | "edit";
    employeeId?: number;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ mode = "add", employeeId }) => {
    const router = useRouter();
    const [createEmployee, { isLoading: isCreating }] = useCreateEmployeMutation();
    const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeMutation();
    const { data: employeeData, isLoading: isEmployeeLoading } = useFetchEmployeByIdQuery(employeeId || 0, {
        skip: mode !== "edit" || !employeeId,
    });
    const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery({});
    const { data: shiftData, isLoading: shiftLoading, error: shiftError } = useFetchCompanyShiftsQuery();
    const { companySlug } = useCompany();
    const [originalData, setOriginalData] = useState(getDefaultEmployeeForm());
    const [hasChanges, setHasChanges] = useState(false);
    const [formData, setFormData] = useState(getDefaultEmployeeForm());
    const [hasLoadedFromLS, setHasLoadedFromLS] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [addressProofImagePreview, setAddressProofImagePreview] = useState<string | null>(null);
    const [utilityBillImagePreview, setUtilityBillImagePreview] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState({
        personal: true,
        job: true,
        bank: true,
    });

    const toggleSection = (section: 'personal' | 'job' | 'bank') => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };
    const allExpanded = Object.values(expandedSections).every(Boolean);

    const toggleAllSections = () => {
        const newState = !allExpanded;
        setExpandedSections({
            personal: newState,
            job: newState,
            bank: newState,
        });
    };


    type RequiredLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
        children: React.ReactNode;
    };

    const RequiredLabel = ({ children, ...props }: RequiredLabelProps) => (
        <label {...props}>
            {children} <span style={{ color: '#333' }}>*</span>
        </label>
    );

    const getChangedFields = <T extends Record<string, unknown>>(original: T, current: T): Partial<T> => {
        const changes: Partial<T> = {};
        (Object.keys(current) as Array<keyof T>).forEach(key => {
            if (original[key] !== current[key]) {
                changes[key] = current[key];
            }
        });
        return changes;
    };

    useEffect(() => {
        if (mode === "edit") {
            const changed = getChangedFields(originalData, formData);
            setHasChanges(Object.keys(changed).length > 0);
        }
    }, [formData, originalData, mode]);

    useEffect(() => {
        if (mode === "edit" && employeeId && employeeData) {
            const { employee } = employeeData;
            const formValues = {
                ...getDefaultEmployeeForm(),
                name: employee.name,
                email: employee.email,
                number: employee.number,
                profilePicture: employee.profilePicture,
                ...employee.employee_details,
                role: employee.roles?.[0]?.name || '',
                utility_bill_image: null, // Always set to null for edit mode
            };

            setFormData(formValues);
            setOriginalData(formValues);

            // Set image previews with full URLs if they exist
            if (employee.profilePicture) {
                setProfileImagePreview(
                    employee.profilePicture.startsWith('http')
                        ? employee.profilePicture
                        : `/api/images?path=${encodeURIComponent(employee.profilePicture)}`
                );
            }
            if (employee.employee_details?.addressProof) {
                setAddressProofImagePreview(
                    employee.employee_details.addressProof.startsWith('http')
                        ? employee.employee_details.addressProof
                        : `/api/images?path=${encodeURIComponent(employee.employee_details.addressProof)}`
                );
            }
            if (employee.employee_details?.utility_bill_image) {
                setUtilityBillImagePreview(
                    employee.employee_details.utility_bill_image.startsWith('http')
                        ? employee.employee_details.utility_bill_image
                        : `/api/images?path=${encodeURIComponent(employee.employee_details.utility_bill_image)}`
                );
            }
        } else if (mode === "add") {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                const parsedData = JSON.parse(saved);
                setFormData(parsedData);
            }
            setHasLoadedFromLS(true);
        }
    }, [mode, employeeId, employeeData]);
    const validateField = useCallback((name: string, value: string | File | null): string => {
        switch (name) {
            case 'name':
                if (mode === 'add' && !value) return 'Name is required';
                if (typeof value === 'string' && value.length < 3) return 'Name must be at least 3 characters';
                break;

            case 'number':
                if (mode === 'add' && !value) return 'Phone number is required';
                if (typeof value === 'string' && !/^\d{10}$/.test(value))
                    return 'Phone number must be 10 digits';
                break;

            case 'email':
                if (mode === 'add' && !value) return 'Email is required';
                if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    return 'Invalid email format';
                break;

            case 'password':
                if (mode === 'add' && !value) return 'Password is required';
                if (typeof value === 'string' && value.length < 8)
                    return 'Password must be at least 8 characters';
                break;

            case 'dob':
                if (mode === 'add' && !value) return 'Date of birth is required';
                if (typeof value === 'string') {
                    const dobDate = new Date(value);
                    const age = new Date().getFullYear() - dobDate.getFullYear();
                    if (age < 18) return 'Employee must be at least 18 years old';
                }
                break;

            case 'emergencyContact':
                if (mode === 'add' && !value) return 'Emergency contact is required';
                if (typeof value === 'string' && !/^\d{10}$/.test(value))
                    return 'Emergency contact must be 10 digits';
                break;

            case 'idProofValue':
                if (mode === 'add' && formData.idProofType && formData.idProofType !== 'bill' && !value)
                    return `${formData.idProofType.charAt(0).toUpperCase() + formData.idProofType.slice(1)} number is required`;
                if (formData.idProofType === 'aadhar' && typeof value === 'string' && !/^\d{12}$/.test(value))
                    return 'Aadhar must be 12 digits';
                if (formData.idProofType === 'pan' && typeof value === 'string' && !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(value))
                    return 'Invalid PAN format (e.g., ABCDE1234F)';
                break;

            case 'utility_bill_image':
                if (mode === 'add' && formData.idProofType === 'bill' && !value)
                    return 'Utility bill image is required';
                break;

            case 'salary':
            case 'currentSalary':
                if (mode === 'add' && !value) return 'Salary is required';
                if (typeof value === 'string' && !/^\d+$/.test(value))
                    return 'Salary must be a number';
                break;

            case 'accountNo':
                if (mode === 'add' && !value) return 'Account number is required';
                if (typeof value === 'string' && !/^\d{9,18}$/.test(value))
                    return 'Account number must be 9-18 digits';
                break;

            case 'ifscCode':
                if (mode === 'add' && !value) return 'IFSC code is required';
                if (typeof value === 'string' && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value))
                    return 'Invalid IFSC format (e.g., ABCD0123456)';
                break;

            case 'panNo':
                if (mode === 'add' && !value) return 'PAN number is required';
                if (typeof value === 'string' && !/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(value))
                    return 'Invalid PAN format (e.g., ABCDE1234F)';
                break;

            case 'upiId':
                if (mode === 'add' && !value) return 'UPI ID is required';
                if (typeof value === 'string' && !/^[\w.-]+@[\w]+$/.test(value))
                    return 'Invalid UPI ID format (e.g., name@upi)';
                break;

            default:
                if (mode === 'add' && typeof value === 'string' && !value && name !== 'password')
                    return 'This field is required';
        }

        return '';
    }, [mode, formData.idProofType]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });

        const updated = { ...formData, [name]: value };
        setFormData(updated);
        const error = validateField(name, value);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }

        if (hasLoadedFromLS && mode === "add") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);

            if (fieldName === 'profilePicture') {
                setProfileImagePreview(previewUrl);
            } else if (fieldName === 'addressProof_image') {
                setAddressProofImagePreview(previewUrl);
            } else if (fieldName === 'utility_bill_image') {
                setUtilityBillImagePreview(previewUrl);
            }
        }

        setFormData(prev => {
            const updated = { ...prev, [fieldName]: file };
            if (hasLoadedFromLS && mode === "add") {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            }
            return updated;
        });
    };

    const handleClearForm = () => {
        if (mode === "add") {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
        setFormData(getDefaultEmployeeForm());
        setShowConfirm(false);
        setProfileImagePreview(null);
        setAddressProofImagePreview(null);
        setUtilityBillImagePreview(null);
    };

    const handleCancelChanges = () => {
        setFormData(originalData);
        setHasChanges(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === "edit") {
            try {
                if (employeeId) {
                    const changedFields = getChangedFields(originalData, formData);
                    const updatePayload = { id: employeeId, ...changedFields, role: formData.role };

                    await updateEmployee(updatePayload).unwrap();
                    toast.success("Employee updated successfully!");
                    setOriginalData(formData);
                    setHasChanges(false);
                }
                router.push(`/${companySlug}/hr/status-view`);
            } catch (err) {
                console.error("Error updating employee:", err);
                toast.error("Failed to update employee");
            }
            return;
        }
        const newErrors: Record<string, string> = {};
        Object.entries(formData).forEach(([name, value]) => {
            const error = validateField(name, value);
            if (error) {
                newErrors[name] = error;
            }
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        try {
            await createEmployee(formData).unwrap();
            toast.success("Employee created successfully!");
            router.push(`/${companySlug}/hr/status-view`);
        } catch (err) {
            console.error("Error creating employee:", err);
            toast.error("Failed to create employee");
        }
    };

    const renderField = (
        label: string,
        name: string,
        type = "text",
        placeholder = "",
        Icon?: React.ElementType,
        min?: number,
        max?: number,
    ) => {
        const error = errors[name];
        const isInvalid = !!error;
        return (
            <div className="employee-field">
                <RequiredLabel htmlFor={name} className="flex items-center gap-2">
                    {Icon && <Icon className="text-gray-600" />} {label}
                </RequiredLabel>

                {type === "date" ? (
                    <DatePicker
                        selected={
                            formData[name as keyof typeof formData]
                                ? new Date(formData[name as keyof typeof formData] as string)
                                : null
                        }
                        onChange={(date: Date | null) => {
                            const value = date ? date.toISOString().split("T")[0] : "";
                            const error = validateField(name, value);

                            setErrors(prev => ({ ...prev, [name]: error }));
                            setFormData(prev => ({ ...prev, [name]: value }));
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
                        renderCustomHeader={({
                            date,
                            changeYear,
                            changeMonth,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
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
                                    className="date-p-year"
                                >
                                    {Array.from({ length: 100 }, (_, i) => {
                                        const year = new Date().getFullYear() - 99 + i;
                                        return (
                                            <option key={i} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </select>
                                <select
                                    value={date.toLocaleString("default", { month: "long" })}
                                    onChange={({ target: { value } }) =>
                                        changeMonth(new Date(Date.parse(value + " 1, 2000")).getMonth())
                                    }
                                    className="date-p-header-month"
                                >
                                    {Array.from({ length: 12 }, (_, i) => {
                                        const month = new Date(0, i).toLocaleString("default", { month: "long" });
                                        return (
                                            <option key={i} value={month}>
                                                {month}
                                            </option>
                                        );
                                    })}
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
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={(formData[name as keyof typeof formData] as string) || ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (max && val.length > max) return;
                            handleChange(e);
                        }}
                        placeholder={placeholder}
                        maxLength={max}
                        minLength={min}
                        required={mode === 'add'}
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

    if (mode === "edit" && isEmployeeLoading) {
        return <LoadingState />;
    }

    return (
        <div className="employee-form-container">
            <div className="form-content-wrapper">
                <form onSubmit={handleSubmit}>

                    <div className="form-main-content">
                        <div className="add-item-header form-header">

                            <Link href={`/${companySlug}/hr`} className='back-button'>
                                <FaArrowLeft size={16} color='#fff' />
                            </Link>
                            <h4>{mode === "add" ? "Add New Employee" : "Edit Employee"}</h4>
                            <button
                                type="button"
                                onClick={toggleAllSections}
                                className="toggle-all-btn"
                                title={allExpanded ? 'Collapse All' : 'Expand All'}
                            >
                                {allExpanded ? (
                                    <FaMinus className="text-gray-600 text-xs" />
                                ) : (
                                    <FaPlus className="text-gray-600 text-xs" />
                                )}
                            </button>
                        </div>
                        <div className="form-card">
                            <div className="form-card-title flex justify-between items-center">
                                <h3 className="flex items-center gap-2">
                                    Personal Information
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => toggleSection('personal')}
                                    className="toggle-icon-btn "
                                >
                                    {expandedSections.personal ? (
                                        <FaMinus className="text-gray-600 text-xs" />
                                    ) : (
                                        <FaPlus className="text-gray-600 text-xs" />
                                    )}
                                </button>
                            </div>

                            {expandedSections.personal && (
                                <div className="form-card-content">
                                    <div className="form-grid">
                                        {renderField("Name", "name", "text", "Enter full name")}
                                        {renderField("Phone Number", "number", "text", "Enter phone number")}
                                        {renderField("Address", "address", "text", "Enter residential address",)}

                                        <div className="employee-field">
                                            <RequiredLabel htmlFor="nationality" className="flex items-center gap-2">
                                                Nationality
                                            </RequiredLabel>
                                            <select name="nationality" value={formData.nationality} onChange={handleChange}>
                                                <option value="">Select Nationality</option>
                                                <option value="Indian">Indian</option>
                                                <option value="Foreigner">Foreigner</option>
                                                <option value="NRI">NRI</option>
                                            </select>
                                            {errors.nationality && <div className="error-message">{errors.nationality}</div>}
                                        </div>

                                        {renderField("Date of Birth", "dob", "date", "Select date of birth",)}

                                        <div className="employee-field">
                                            <RequiredLabel htmlFor="religion" className="flex items-center gap-2">
                                                Religion
                                            </RequiredLabel>
                                            <select name="religion" value={formData.religion} onChange={handleChange}>
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
                                            {errors.religion && <div className="error-message">{errors.religion}</div>}
                                        </div>

                                        <div className="employee-field">
                                            <RequiredLabel htmlFor="maritalStatus" className="flex items-center gap-2">
                                                Marital Status
                                            </RequiredLabel>
                                            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                                                <option value="">Select Marital Status</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="Divorced">Divorced</option>
                                                <option value="Widowed">Widowed</option>
                                                <option value="Separated">Separated</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.maritalStatus && <div className="error-message">{errors.maritalStatus}</div>}
                                        </div>

                                        <div className="employee-field">
                                            <RequiredLabel htmlFor="idProofType" className="flex items-center gap-2">
                                                ID Proof Type
                                            </RequiredLabel>
                                            <select
                                                name="idProofType"
                                                value={formData.idProofType}
                                                onChange={(e) => {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        idProofType: e.target.value,
                                                        idProofValue: "",
                                                        utility_bill_image: null,
                                                    }));
                                                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
                                                        ...formData,
                                                        idProofType: e.target.value,
                                                        idProofValue: "",
                                                        utility_bill_image: null,
                                                    }));
                                                    setUtilityBillImagePreview(null);
                                                }}
                                            >
                                                <option value="">Select ID Proof</option>
                                                <option value="aadhar">Aadhar Number</option>
                                                <option value="license">License</option>
                                                <option value="passport">Passport Number</option>
                                                <option value="bill">Utility Bill</option>
                                            </select>
                                            {errors.idProofType && <div className="error-message">{errors.idProofType}</div>}
                                        </div>

                                        {formData.idProofType && formData.idProofType !== "bill" && (
                                            <div className="employee-field">
                                                <RequiredLabel className="flex items-center gap-2">
                                                    Enter {formData.idProofType.charAt(0).toUpperCase() + formData.idProofType.slice(1)} Number
                                                </RequiredLabel>
                                                <input
                                                    type="text"
                                                    name="idProofValue"
                                                    value={formData.idProofValue}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value;
                                                        setFormData((prev) => {
                                                            const updated = { ...prev, idProofValue: newValue };
                                                            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                                                            return updated;
                                                        });
                                                    }}
                                                    minLength={
                                                        formData.idProofType === "aadhar" ? 12 :
                                                            formData.idProofType === "passport" ? 8 :
                                                                undefined
                                                    }
                                                    maxLength={
                                                        formData.idProofType === "aadhar" ? 12 :
                                                            formData.idProofType === "license" ? 15 :
                                                                formData.idProofType === "passport" ? 8 :
                                                                    undefined
                                                    }
                                                    placeholder={`Enter ${formData.idProofType} number`}
                                                />
                                                {errors.idProofValue && <div className="error-message">{errors.idProofValue}</div>}
                                            </div>
                                        )}

                                        {renderField("Emergency Contact", "emergencyContact", "text", "Enter emergency contact number", undefined, 10, 10)}

                                        <div className="employee-field">
                                            <RequiredLabel htmlFor="emergencyContactRelation" className="flex items-center gap-2">
                                                Emergency Contact Relation
                                            </RequiredLabel>
                                            <select
                                                name="emergencyContactRelation"
                                                value={formData.emergencyContactRelation}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Relation</option>
                                                <option value="mother">Father</option>
                                                <option value="father">Mother</option>
                                                <option value="brother">Brother</option>
                                                <option value="sister">Sister</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.emergencyContactRelation && (
                                                <div className="error-message">{errors.emergencyContactRelation}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-card">
                            <div className="form-card-title flex justify-between items-center">
                                <h3 className="flex items-center gap-2">
                                    Job Information
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => toggleSection('job')}
                                    className="toggle-icon-btn "
                                >
                                    {expandedSections.job ? (
                                        <FaMinus className="text-gray-600 text-xs" />
                                    ) : (
                                        <FaPlus className="text-gray-600 text-xs" />
                                    )}
                                </button>
                            </div>

                            {expandedSections.job && (
                                <div className="form-card-content">
                                    <div className="form-grid">
                                        {renderField("Email", "email", "email", "Enter email address",)}
                                        {mode === "add" && renderField("Password", "password", "password", "Create a password")}
                                        {renderField("Salary", "salary", "text", "Enter expected salary")}
                                        {renderField("Current Salary", "currentSalary", "text", "Enter current salary")}
                                        {renderField("Date of Hiring", "dateOfHire", "date", "Select hiring date")}
                                        {renderField("Work Location", "workLocation", "text", "Enter work location")}
                                        {renderField("Joining Date", "joiningDate", "date", "Select joining date")}

                                        <div className="employee-field">
                                            <RequiredLabel htmlFor="shiftTimings">Shift Timings</RequiredLabel>
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
                                                <div className="error-message">{errors.shiftTimings}</div>
                                            )}
                                        </div>

                                        <div className="employee-field">
                                            <RequiredLabel htmlFor="role" className="flex items-center gap-2">
                                                Role
                                            </RequiredLabel>
                                            <div className="custom-select-wrapper">
                                                <select
                                                    name="role"
                                                    value={formData.role}
                                                    onChange={handleChange}
                                                    className={errors.role ? "error" : ""}
                                                    disabled={rolesLoading || !!rolesError}
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
                                            {errors.role && <div className="error-message">{errors.role}</div>}
                                        </div>

                                        {renderField("Department", "department", "text", "Enter department")}

                                        <div className="employee-field">
                                            <RequiredLabel htmlFor="joiningType" className="flex items-center gap-2">
                                                Joining Type
                                            </RequiredLabel>
                                            <div className="custom-select-wrapper">
                                                <select
                                                    name="joiningType"
                                                    value={formData.joiningType}
                                                    onChange={handleChange}
                                                    className={errors.joiningType ? "error" : ""}
                                                >
                                                    <option value="">Select Joining Type</option>
                                                    <option value="full-time">Full-time</option>
                                                    <option value="part-time">Part-time</option>
                                                    <option value="contract">Contract</option>
                                                </select>
                                            </div>
                                            {errors.joiningType && <div className="error-message">{errors.joiningType}</div>}
                                        </div>

                                        {renderField("Previous Employer", "previousEmployer", "text", "Enter previous employer")}
                                        {renderField("Medical Info (e.g., Blood Group)", "medicalInfo", "text", "Enter medical info")}
                                    </div>
                                </div>
                            )}
                        </div>


                        <div className="form-card">
                            <div className="form-card-title flex justify-between items-center">
                                <h3 className="flex items-center gap-2">
                                    Bank Information
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => toggleSection('bank')}
                                    className="toggle-icon-btn "
                                >
                                    {expandedSections.bank ? (
                                        <FaMinus className="text-gray-600 text-xs" />
                                    ) : (
                                        <FaPlus className="text-gray-600 text-xs" />
                                    )}
                                </button>
                            </div>

                            {expandedSections.bank && (
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
                            )}
                        </div>

                        {/* ...................... */}
                    </div>
                    {/* Sidebar for image uploads */}
                    <div className="form-sidebar-outer">
                        <div className="form-sidebar">
                            <div className="image-upload-card">
                                <h3>Profile Picture</h3>
                                <div className="image-preview">
                                    {profileImagePreview ? (
                                        typeof profileImagePreview === 'string' && profileImagePreview.startsWith('http') ? (
                                            <Image
                                                src={profileImagePreview}
                                                alt="Profile Preview"
                                                width={100}
                                                height={100}
                                                unoptimized // Add this if you're having issues with external URLs
                                            />
                                        ) : (
                                            // For base64 or local files
                                            <Image
                                                src={profileImagePreview}
                                                alt="Profile Preview"
                                                width={100}
                                                height={100}
                                            />
                                        )
                                    ) : (
                                        <div className="placeholder">
                                            <FaImage size={48} />
                                            <span>No image selected</span>
                                        </div>
                                    )}
                                </div>
                                <div className="upload-controls">
                                    <input
                                        type="file"
                                        id="profilePicture"
                                        name="profilePicture"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'profilePicture')}
                                        className="file-input"
                                    />
                                    <label htmlFor="profilePicture" className="upload-button">
                                        <FaUpload /> Choose File
                                    </label>
                                    {errors.profilePicture && (
                                        <div className="error-message">{errors.profilePicture}</div>
                                    )}
                                </div>
                            </div>

                            <div className="image-upload-card">
                                <h3>Address Proof</h3>
                                <div className="image-preview">
                                    {addressProofImagePreview ? (
                                        <Image src={addressProofImagePreview} alt="Address Proof Preview" width={100} height={100} />
                                    ) : (
                                        <div className="placeholder">
                                            <FaImage size={48} />
                                            <span>No image selected</span>
                                        </div>
                                    )}
                                </div>
                                <div className="upload-controls">
                                    <input
                                        type="file"
                                        id="addressProof_image"
                                        name="addressProof_image"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'addressProof_image')}
                                        className="file-input"
                                    />
                                    <label htmlFor="addressProof_image" className="upload-button">
                                        <FaUpload /> Choose File
                                    </label>
                                    {errors.addressProof_image && (
                                        <div className="error-message">{errors.addressProof_image}</div>
                                    )}
                                </div>
                            </div>

                            {formData.idProofType === "bill" && (
                                <div className="image-upload-card">
                                    <h3>Utility Bill</h3>
                                    <div className="image-preview">
                                        {utilityBillImagePreview ? (
                                            <Image src={utilityBillImagePreview} alt="Utility Bill Preview" width={100} height={100} />
                                        ) : (
                                            <div className="placeholder">
                                                <FaImage size={48} />
                                                <span>No image selected</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="upload-controls">
                                        <input
                                            type="file"
                                            id="utility_bill_image"
                                            name="utility_bill_image"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'utility_bill_image')}
                                            className="file-input"
                                        />
                                        <label htmlFor="utility_bill_image" className="upload-button">
                                            <FaUpload /> Choose File
                                        </label>
                                        {errors.utility_bill_image && (
                                            <div className="error-message">{errors.utility_bill_image}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            {mode === "edit" && hasChanges && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleCancelChanges}
                                        className="form-button secondary cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="form-button"
                                        type="submit"
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? "Updating..." : "Update Employee"}
                                    </button>
                                </>
                            )}

                            {mode === "add" && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(true)}
                                        className="form-button secondary"
                                    >
                                        Clear Form
                                    </button>
                                    <button
                                        className="form-button"
                                        type="submit"
                                        disabled={isCreating}
                                    >
                                        {isCreating ? "Creating..." : "Create Employee"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            <ConfirmDialog
                isOpen={showConfirm}
                message="Are you sure you want to clear the form?"
                onConfirm={handleClearForm}
                onCancel={() => setShowConfirm(false)}
                type="clear"
            />
        </div>
    );
};

export default EmployeeForm;