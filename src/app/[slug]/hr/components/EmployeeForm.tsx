"use client";

import React, { useState, useEffect } from "react";
import {
    useCreateEmployeMutation,
    useUpdateEmployeMutation,
    useFetchEmployeByIdQuery
} from "@/slices/employe/employe";
import { useGetRolesQuery } from "@/slices/roles/rolesApi";
import { useFetchCompanyShiftsQuery } from "@/slices/company/companyApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useCompany } from "@/utils/Company";
import { useCallback, useMemo } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    FaUser, FaMapMarkerAlt, FaFlag, FaBirthdayCake, FaVenusMars,
    FaPassport, FaPhoneAlt, FaEnvelope, FaLock, FaMoneyBillWave,
    FaBuilding, FaCalendarAlt, FaBriefcase, FaHospital, FaUniversity,
    FaIdCard, FaCreditCard, FaQrcode, FaImage, FaUpload, FaAddressCard,
    FaArrowLeft
} from "react-icons/fa";
import { Tabs, Tab, Box } from "@mui/material";
import Link from "next/link";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { FiXCircle } from "react-icons/fi";

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
    const [activeTab, setActiveTab] = useState(0);
    const [tabCompletion, setTabCompletion] = useState<boolean[]>([true, false, false]);
    const [formData, setFormData] = useState(getDefaultEmployeeForm());
    const [hasLoadedFromLS, setHasLoadedFromLS] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    type RequiredLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
        children: React.ReactNode;
    };

    const RequiredLabel = ({ children, ...props }: RequiredLabelProps) => (
        <label {...props}>
            {children} <span style={{ color: 'red' }}>*</span>
        </label>
    );

    // Helper to compare objects and get only changed fields
    const getChangedFields = <T extends Record<string, unknown>>(original: T, current: T): Partial<T> => {
        const changes: Partial<T> = {};
        (Object.keys(current) as Array<keyof T>).forEach(key => {
            if (original[key] !== current[key]) {
                changes[key] = current[key];
            }
        });
        return changes;
    };

    // Track changes whenever formData changes
    useEffect(() => {
        if (mode === "edit") {
            const changed = getChangedFields(originalData, formData);
            setHasChanges(Object.keys(changed).length > 0);
        }
    }, [formData, originalData, mode]);

    // Load data for edit mode or from localStorage for add mode
    useEffect(() => {
        if (mode === "edit" && employeeId && employeeData) {
            const { employee } = employeeData;
            const formValues = {
                ...getDefaultEmployeeForm(),
                name: employee.name,
                email: employee.email,
                number: employee.number,
                profilePicture: employee.profile_picture,
                ...employee.employee_details,
                role: employee.roles?.[0]?.name || '',
            };
            setFormData(formValues);
            setOriginalData(formValues);
        } else if (mode === "add") {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                setFormData(JSON.parse(saved));
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
    }, [mode, formData.idProofType])


    const tabFields = useMemo(() => ([
        // Personal Info
        ['name', 'number', 'address', 'nationality', 'dob', 'religion',
            'maritalStatus', 'emergencyContact', 'emergencyContactRelation',
            'idProofType', 'idProofValue', 'utility_bill_image'],

        // Job Info
        ['email', 'password', 'salary', 'currentSalary', 'dateOfHire',
            'workLocation', 'joiningDate', 'shiftTimings', 'role',
            'department', 'joiningType'],

        // Bank Info
        ['bankName', 'accountNo', 'ifscCode', 'panNo', 'upiId', 'addressProof']
    ]), []);



    const validateTab = useCallback((index: number): boolean => {
        // Check all fields in the tab
        return tabFields[index].every(field => {
            const value = formData[field as keyof typeof formData];
            return !validateField(field, value as string | File | null);
        });
    }, [formData, tabFields, validateField]);

    useEffect(() => {
        if (mode === "edit") {
            // In edit mode, all tabs are always enabled
            setTabCompletion([true, true, true, true]);
        } else {
            const newTabCompletion = [true];
            for (let i = 0; i < 3; i++) {
                if (validateTab(i)) {
                    newTabCompletion[i + 1] = true;
                } else {
                    break;
                }
            }
            setTabCompletion(newTabCompletion);

            if (!newTabCompletion[activeTab]) {
                const lastValidTab = newTabCompletion.lastIndexOf(true);
                setActiveTab(lastValidTab);
            }
        }
    }, [formData, mode, activeTab, validateTab]); // ✅ validateTab and activeTab included


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Clear any existing error for this field
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });

        const updated = { ...formData, [name]: value };
        setFormData(updated);

        // Validate the field after update
        const error = validateField(name, value);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }

        if (hasLoadedFromLS && mode === "add") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        }
    };

    const handleClearForm = () => {
        if (mode === "add") {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
        setFormData(getDefaultEmployeeForm());
        setShowConfirm(false);
        setActiveTab(0);
    };

    const handleCancelChanges = () => {
        setFormData(originalData);
        setHasChanges(false);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === "edit") {
            // Skip validation completely on edit mode and just update
            try {
                if (employeeId) {
                    const changedFields = getChangedFields(originalData, formData);
                    // Always include role (or any required field) when updating
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

        // mode === "add" case, proceed with validation

        // Validate all tabs first to find which one has errors
        const tabErrors: boolean[] = [];
        const newErrors: Record<string, string> = {};

        tabFields.forEach((fields, tabIndex) => {
            let hasTabError = false;
            fields.forEach(field => {
                const error = validateField(field, formData[field as keyof typeof formData]);
                if (error) {
                    newErrors[field] = error;
                    hasTabError = true;
                }
            });
            tabErrors[tabIndex] = hasTabError;
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Find the first tab with errors
            const firstErrorTab = tabErrors.findIndex(hasError => hasError);
            if (firstErrorTab >= 0) {
                setActiveTab(firstErrorTab);
            }
            toast.error('Please fix all errors before submitting');
            return;
        }

        try {
            const allTabsValid = tabCompletion.every(valid => valid);
            if (!allTabsValid) {
                toast.error('Please complete all sections before submitting');
                return;
            }
            await createEmployee(formData).unwrap();
            toast.success("Employee created successfully!");
            // localStorage.removeItem(LOCAL_STORAGE_KEY);
            // setFormData(getDefaultEmployeeForm());
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
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        required={mode === 'add'}  // <-- Only required in add mode
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

    const tabs = [
        { label: "Personal Info", disabled: mode === 'add' && !tabCompletion[0] },
        { label: "Job Info", disabled: mode === 'add' && !tabCompletion[1] },
        { label: "Bank Info", disabled: mode === 'add' && !tabCompletion[2] },
    ];

    if (mode === "edit" && isEmployeeLoading) {
        return <div>Loading employee data...</div>;
    }

    return (
        <div>
            <div className="add-item-header custom_header_hr">
                <Link href={`/${companySlug}/hr`} className='back-button'>
                    <FaArrowLeft size={16} color='#fff' />
                </Link>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => {
                        if (mode === 'edit' || tabCompletion[newValue]) {
                            setActiveTab(newValue);
                        }
                    }}
                    variant="scrollable"
                    scrollButtons="auto"
                    style={{ backgroundColor: '$primary-color' }}
                    sx={{
                        '& .MuiTab-root': {
                            color: '$light-color',
                            '&.Mui-disabled': { color: '#ccc' },
                            '&.Mui-selected': { color: '#' },
                        },
                        '& .MuiTabs-indicator': { backgroundColor: '#009693' },
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            label={tab.label}
                            disabled={tab.disabled}
                        />
                    ))}
                </Tabs>

            </div>
            <div className="add-employee-form">
                <form onSubmit={handleSubmit}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                        {activeTab === 0 && (
                            <div className="employee-fields-wrapper">
                                {renderField("Name", "name", "text", "Enter full name", FaUser)}
                                {renderField("Phone Number", "number", "text", "Enter phone number", FaPhoneAlt, 10, 10)}
                                {renderField("Address", "address", "text", "Enter residential address", FaMapMarkerAlt)}
                                <div className="employee-field">
                                    <RequiredLabel htmlFor="nationality" className="flex items-center gap-2">
                                        <FaFlag className="text-gray-600" /> Nationality
                                    </RequiredLabel>
                                    <select name="nationality" value={formData.nationality} onChange={handleChange}>
                                        <option value="">Select Nationality</option>
                                        <option value="Indian">Indian</option>
                                        <option value="Foreigner">Foreigner</option>
                                        <option value="NRI">NRI</option>
                                    </select>
                                    {errors.nationality && <div className="error-message">{errors.nationality}</div>}
                                </div>

                                {renderField("Date of Birth", "dob", "date", "Select date of birth", FaBirthdayCake)}
                                <div className="employee-field">
                                    <RequiredLabel htmlFor="religion" className="flex items-center gap-2">
                                        <FaVenusMars className="text-gray-600" /> Religion
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
                                        <FaVenusMars className="text-gray-600" /> Marital Status
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
                                        <FaIdCard className="text-gray-600" /> ID Proof Type
                                    </RequiredLabel>
                                    <select
                                        name="idProofType"
                                        value={formData.idProofType}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                idProofType: e.target.value,
                                                idProofValue: "", // reset previous input
                                                utility_bill_image: null,
                                            }));
                                            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
                                                ...formData,
                                                idProofType: e.target.value,
                                                idProofValue: "",
                                                utility_bill_image: null,
                                            }))
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
                                            {formData.idProofType === "aadhar" && <FaAddressCard />}
                                            {formData.idProofType === "license" && <FaIdCard />}
                                            {formData.idProofType === "passport" && <FaPassport />}
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

                                {formData.idProofType === "bill" && (
                                    <div className="employee-field">
                                        <RequiredLabel htmlFor="utility_bill_image">
                                            <FaUpload /> Utility Bill
                                        </RequiredLabel>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="utility_bill_image"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                setFormData((prev) => {
                                                    const updated = { ...prev, utility_bill_image: file };
                                                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
                                                    return updated;
                                                });
                                            }}
                                        />
                                        {errors.utility_bill_image && <div className="error-message">{errors.utility_bill_image}</div>}
                                    </div>
                                )}

                                {renderField("Emergency Contact", "emergencyContact", "text", "Enter emergency contact number", FaPhoneAlt, 10, 10)}
                                <div className="employee-field">
                                    <RequiredLabel htmlFor="emergencyContactRelation" className="flex items-center gap-2">
                                        <FaUser className="text-gray-600" /> Emergency Contact Relation
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
                        )}

                        {activeTab === 1 && (
                            <div className="employee-fields-wrapper">
                                {renderField("Email", "email", "email", "Enter email address", FaEnvelope)}
                                {mode === "add" && renderField("Password", "password", "password", "Create a password", FaLock)}
                                {renderField("Salary", "salary", "text", "Enter expected salary", FaMoneyBillWave)}
                                {renderField("Current Salary", "currentSalary", "text", "Enter current salary", FaMoneyBillWave)}
                                {renderField("Date of Hiring", "dateOfHire", "date", "Select hiring date", FaCalendarAlt)}
                                {renderField("Work Location", "workLocation", "text", "Enter work location", FaBuilding)}
                                {renderField("Joining Date", "joiningDate", "date", "Select joining date", FaCalendarAlt)}

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
                                        <FaIdCard className="text-gray-600" /> Role
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


                                {renderField("Department", "department", "text", "Enter department", FaUniversity)}

                                <div className="employee-field">
                                    <RequiredLabel htmlFor="joiningType" className="flex items-center gap-2">
                                        <FaBriefcase className="text-gray-600" /> Joining Type
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


                                {renderField("Previous Employer", "previousEmployer", "text", "Enter previous employer", FaBuilding)}
                                {renderField("Medical Info (e.g., Blood Group)", "medicalInfo", "text", "Enter medical info", FaHospital)}
                            </div>
                        )}

                        {activeTab === 2 && (
                            <div className="employee-fields-wrapper">
                                {renderField("Bank Name", "bankName", "text", "Enter bank name", FaUniversity)}
                                {renderField("Account No", "accountNo", "text", "Enter bank account number", FaCreditCard, 9, 18)}
                                {renderField("IFSC Code", "ifscCode", "text", "Enter IFSC code", FaQrcode, 11, 11)}
                                {renderField("PAN No", "panNo", "text", "Enter PAN number", FaIdCard, 10, 10)}
                                {renderField("UPI ID", "upiId", "text", "Enter UPI ID", FaQrcode, 8, 40)}
                                {renderField("Address Proof (e.g. Aadhar Number)", "addressProof", "text", "Enter Aadhar or other ID number", FaIdCard, 5, 12)}
                                <div className="employee-field">
                                    <RequiredLabel htmlFor="profilePicture" className="flex items-center gap-2">
                                        <FaImage className="text-gray-600" />Address Proof Img.
                                    </RequiredLabel>
                                    <input
                                        type="file"
                                        name="addressProof_image"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="file-input"
                                    />
                                    {errors.addressProof_image && (
                                        <div className="error-message">{errors.addressProof_image}</div>
                                    )}
                                </div>
                                <div className="employee-field">
                                    <RequiredLabel htmlFor="profilePicture" className="flex items-center gap-2">
                                        <FaImage className="text-gray-600" /> Profile Picture
                                    </RequiredLabel>
                                    <input
                                        type="file"
                                        name="profilePicture"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="file-input"
                                    />
                                    {errors.profilePicture && (
                                        <div className="error-message">{errors.profilePicture}</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </Box>
                    <div className="create-employess-action">
                        {mode === "edit" && hasChanges && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleCancelChanges}
                                    className="form-button secondary"
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
                            <button
                                className="form-button"
                                type="submit"
                                disabled={isCreating}
                            >
                                {isCreating ? "Creating..." : "Create Employee"}
                            </button>
                        )}
                    </div>

                    <ConfirmDialog
                        isOpen={showConfirm}
                        message="Are you sure you want to clear the form?"
                        onConfirm={handleClearForm}
                        onCancel={() => setShowConfirm(false)}
                        type="clear"
                    />
                    {mode === "add" && (
                        <span className="clear-button" onClick={() => setShowConfirm(true)}>
                            <FiXCircle />
                        </span>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm;

// (useMemo polyfill removed; use useMemo from 'react')
