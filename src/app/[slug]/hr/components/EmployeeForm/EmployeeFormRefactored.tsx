"use client";

import React, { useState, useEffect } from "react";
import {
    useCreateEmployeMutation,
    useUpdateEmployeMutation,
    useFetchEmployeByIdQuery
} from "@/slices/employe/employeApi";
import { useGetRolesQuery } from "@/slices/roles/rolesApi";
import { useFetchCompanyShiftsQuery } from "@/slices/company/companyApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useCompany } from "@/utils/Company";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import LoadingState from "@/components/common/LoadingState";

// Import components
import FormHeader from "./FormHeader";
import FormSectionHeader from "./FormSectionHeader";
import PersonalInformationSection from "./PersonalInformationSection";
import JobInformationSection from "./JobInformationSection";
import BankInformationSection from "./BankInformationSection";
import ImageUploadCard from "./ImageUploadCard";
import FormActions from "./FormActions";
import FormField from "./FormField";

// Import types and utils
import { EmployeeFormProps, ExtendedEmployeeFormData } from "./types";
import { LOCAL_STORAGE_KEY, getDefaultEmployeeForm, getChangedFields, validateField } from "./utils";

const EmployeeFormRefactored: React.FC<EmployeeFormProps> = ({ mode = "add", employeeId }) => {
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

    useEffect(() => {
        if (mode === "edit") {
            const changed = getChangedFields(originalData, formData);
            setHasChanges(Object.keys(changed).length > 0);
        }
    }, [formData, originalData, mode]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(profileImagePreview);
            }
            if (addressProofImagePreview && addressProofImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(addressProofImagePreview);
            }
            if (utilityBillImagePreview && utilityBillImagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(utilityBillImagePreview);
            }
        };
    }, [profileImagePreview, addressProofImagePreview, utilityBillImagePreview]);

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
                utility_bill_image: null,
            };

            setFormData(formValues);
            setOriginalData(formValues);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });

        const updated = { ...formData, [name]: value };
        setFormData(updated);
        const error = validateField(name, value, mode, formData.idProofType);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }

        if (hasLoadedFromLS && mode === "add") {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        }
    };

    const handleDateChange = (name: string, date: Date | null) => {
        const value = date ? date.toISOString().split("T")[0] : "";
        const error = validateField(name, value, mode);

        setErrors(prev => ({ ...prev, [name]: error }));
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            // Create preview URL using URL.createObjectURL for better performance
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
            // Don't save File objects to localStorage as they get serialized as empty objects
            if (hasLoadedFromLS && mode === "add") {
                // Create a copy for localStorage without File objects
                const dataForStorage = { ...updated } as Record<string, unknown>;
                // Remove File objects from localStorage data by setting to undefined
                if (dataForStorage.profilePicture instanceof File) {
                    dataForStorage.profilePicture = undefined;
                }
                if (dataForStorage.addressProof_image instanceof File) {
                    dataForStorage.addressProof_image = undefined;
                }
                if (dataForStorage.utility_bill_image instanceof File) {
                    dataForStorage.utility_bill_image = undefined;
                }
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataForStorage));
            }
            return updated;
        });
    };

    const handleClearForm = () => {
        // Revoke object URLs to prevent memory leaks
        if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(profileImagePreview);
        }
        if (addressProofImagePreview && addressProofImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(addressProofImagePreview);
        }
        if (utilityBillImagePreview && utilityBillImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(utilityBillImagePreview);
        }

        setFormData(getDefaultEmployeeForm());
        setErrors({});
        setProfileImagePreview(null);
        setAddressProofImagePreview(null);
        setUtilityBillImagePreview(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setShowConfirm(false);
    };

    const handleCancelChanges = () => {
        setFormData(originalData);
        setHasChanges(false);
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === "edit") {
            try {
                if (employeeId) {
                    const changedFields = getChangedFields(originalData, formData);
                    const updatePayload = { id: employeeId, ...changedFields, role: formData.role };

                    // Create clean JSON payload without file objects
                    const cleanPayload: Record<string, string | number | boolean | Date> = {};
                    
                    Object.entries(updatePayload).forEach(([key, value]) => {
                        if (key !== 'profilePicture' && key !== 'addressProof_image' && key !== 'utility_bill_image') {
                            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value instanceof Date) {
                                // Convert numeric fields to numbers
                                if (['salary', 'currentSalary', 'shiftTimings'].includes(key) && typeof value === 'string') {
                                    cleanPayload[key] = parseInt(value, 10);
                                }
                                // Convert date fields to Date objects
                                else if (['dob', 'dateOfHire', 'joiningDate'].includes(key) && typeof value === 'string') {
                                    cleanPayload[key] = new Date(value);
                                }
                                else {
                                    cleanPayload[key] = value;
                                }
                            }
                        }
                    });

                    await updateEmployee(cleanPayload as { id: number } & Record<string, string | number | boolean | Date>).unwrap();

                    toast.success("Employee updated successfully!");
                    setOriginalData(formData);
                    setHasChanges(false);
                }
                router.push(`/${companySlug}/hr/status-view`);
            } catch (err: unknown) {
                console.error("Error updating employee:", err);
                
                // Handle backend error responses
                const error = err as { data?: { message?: string; error?: string } };
                if (error?.data?.message) {
                    toast.error(error.data.message);
                } else if (error?.data?.error) {
                    toast.error(error.data.error);
                } else {
                    toast.error("Failed to update employee");
                }
            }
            return;
        }

        const newErrors: Record<string, string> = {};
        Object.entries(formData).forEach(([name, value]) => {
            const error = validateField(name, value, mode, formData.idProofType);
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
            // Create clean JSON payload without file objects
            const cleanPayload: Record<string, string | number | boolean | Date> = {};
            
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'profilePicture' && key !== 'addressProof_image' && key !== 'utility_bill_image') {
                    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value instanceof Date) {
                        // Convert numeric fields to numbers
                        if (['salary', 'currentSalary', 'shiftTimings'].includes(key) && typeof value === 'string') {
                            cleanPayload[key] = parseInt(value, 10);
                        }
                        // Convert date fields to Date objects
                        else if (['dob', 'dateOfHire', 'joiningDate'].includes(key) && typeof value === 'string') {
                            cleanPayload[key] = new Date(value);
                        }
                        else {
                            cleanPayload[key] = value;
                        }
                    }
                }
            });

            await createEmployee(cleanPayload).unwrap();
            
            toast.success("Employee created successfully!");
            router.push(`/${companySlug}/hr/status-view`);
        } catch (err: unknown) {
            console.error("Error creating employee:", err);
            
            // Handle backend error responses
            const error = err as { data?: { message?: string; error?: string } };
            if (error?.data?.message) {
                toast.error(error.data.message);
            } else if (error?.data?.error) {
                toast.error(error.data.error);
            } else {
                toast.error("Failed to create employee");
            }
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
        return (
            <FormField
                label={label}
                name={name}
                type={type}
                placeholder={placeholder}
                Icon={Icon}
                min={min}
                max={max}
                value={(formData[name as keyof ExtendedEmployeeFormData] as string) || ""}
                onChange={handleChange}
                onDateChange={(date) => handleDateChange(name, date)}
                error={errors[name]}
                required={mode === 'add'}
            />
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
                        <FormHeader
                            mode={mode}
                            allExpanded={allExpanded}
                            onToggleAllSections={toggleAllSections}
                        />

                        <div className="form-card">
                            <FormSectionHeader
                                title="Personal Information"
                                isExpanded={expandedSections.personal}
                                onToggle={() => toggleSection('personal')}
                            />
                            {expandedSections.personal && (
                                <PersonalInformationSection
                                    formData={formData}
                                    errors={errors}
                                    mode={mode}
                                    onFieldChange={handleChange}
                                    onDateChange={handleDateChange}
                                    renderField={renderField}
                                />
                            )}
                        </div>

                        <div className="form-card">
                            <FormSectionHeader
                                title="Job Information"
                                isExpanded={expandedSections.job}
                                onToggle={() => toggleSection('job')}
                            />
                            {expandedSections.job && (
                                <JobInformationSection
                                    formData={formData}
                                    errors={errors}
                                    mode={mode}
                                    onFieldChange={handleChange}
                                    onDateChange={handleDateChange}
                                    renderField={renderField}
                                    rolesData={rolesData}
                                    rolesLoading={rolesLoading}
                                    rolesError={rolesError}
                                    shiftData={shiftData}
                                    shiftLoading={shiftLoading}
                                    shiftError={shiftError}
                                />
                            )}
                        </div>

                        <div className="form-card">
                            <FormSectionHeader
                                title="Bank Information"
                                isExpanded={expandedSections.bank}
                                onToggle={() => toggleSection('bank')}
                            />
                            {expandedSections.bank && (
                                <BankInformationSection
                                    renderField={renderField}
                                />
                            )}
                        </div>
                    </div>

                    <div className="form-sidebar-outer">
                        <div className="form-sidebar">
                            <ImageUploadCard
                                title="Profile Picture"
                                fieldName="profilePicture"
                                imagePreview={profileImagePreview}
                                onFileChange={handleFileChange}
                                error={errors.profilePicture}
                                id="profilePicture"
                            />

                            <ImageUploadCard
                                title="Address Proof"
                                fieldName="addressProof_image"
                                imagePreview={addressProofImagePreview}
                                onFileChange={handleFileChange}
                                error={errors.addressProof_image}
                                id="addressProof_image"
                            />

                            {formData.idProofType === "bill" && (
                                <ImageUploadCard
                                    title="Utility Bill"
                                    fieldName="utility_bill_image"
                                    imagePreview={utilityBillImagePreview}
                                    onFileChange={handleFileChange}
                                    error={errors.utility_bill_image}
                                    id="utility_bill_image"
                                />
                            )}
                        </div>

                        <FormActions
                            mode={mode}
                            hasChanges={hasChanges}
                            isCreating={isCreating}
                            isUpdating={isUpdating}
                            onClearForm={handleClearForm}
                            onCancelChanges={handleCancelChanges}
                            showConfirm={showConfirm}
                            setShowConfirm={setShowConfirm}
                        />
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

export default EmployeeFormRefactored; 