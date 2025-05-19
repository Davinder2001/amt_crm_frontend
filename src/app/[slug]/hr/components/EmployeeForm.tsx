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
    passportNo: "",
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
    idProofImage: null as File | null,
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

    const validateTab = (index: number): boolean => {
        switch (index) {
            case 0: // Personal Info Tab
                return (
                    formData.name.trim() !== '' &&
                    formData.number.trim() !== '' &&
                    formData.address.trim() !== '' &&
                    formData.nationality.trim() !== '' &&
                    formData.dob.trim() !== '' &&
                    formData.religion.trim() !== '' &&
                    formData.maritalStatus.trim() !== '' &&
                    formData.emergencyContact.trim() !== '' &&
                    formData.emergencyContactRelation.trim() !== '' &&
                    formData.idProofType.trim() !== '' &&
                    (
                        (formData.idProofType === "bill" && formData.idProofImage !== null) ||
                        (formData.idProofType !== "bill" && formData.idProofValue.trim() !== '')
                    )
                );

            case 1: // Job Info Tab
                return (
                    formData.email.trim() !== '' &&
                    (mode === "edit" || formData.password.trim() !== '') && // Password not required for edit
                    formData.salary.trim() !== '' &&
                    formData.currentSalary.trim() !== '' &&
                    formData.dateOfHire.trim() !== '' &&
                    formData.workLocation.trim() !== '' &&
                    formData.joiningDate.trim() !== '' &&
                    formData.shiftTimings !== '' &&
                    formData.role !== '' &&
                    formData.department.trim() !== '' &&
                    formData.joiningType !== ''
                );

            case 2: // Bank Info Tab
                return (
                    formData.bankName.trim() !== '' &&
                    formData.accountNo.trim() !== '' &&
                    formData.ifscCode.trim() !== '' &&
                    formData.panNo.trim() !== '' &&
                    formData.upiId.trim() !== '' &&
                    formData.addressProof.trim() !== ''
                );

            default:
                return false;
        }
    };

    useEffect(() => {
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
    }, [formData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };
        setFormData(updated);

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
        setErrors({});

        try {
            if (mode === "add") {
                await createEmployee(formData).unwrap();
                toast.success("Employee created successfully!");
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                setFormData(getDefaultEmployeeForm());
            } else if (mode === "edit" && employeeId) {
                // Only send changed fields
                const changedFields = getChangedFields(originalData, formData);
                await updateEmployee({ id: employeeId, ...changedFields }).unwrap();
                toast.success("Employee updated successfully!");
                // Update original data with new changes
                setOriginalData(formData);
                setHasChanges(false);
            }
            router.push(`/${companySlug}/hr/status-view`);
        } catch (err) {
            console.error(`Error ${mode === "add" ? "creating" : "updating"} employee:`, err);
            toast.error(`Failed to ${mode === "add" ? "create" : "update"} employee`);
        }
    };

    const renderField = (
        label: string,
        name: string,
        type = "text",
        placeholder = "",
        Icon?: React.ElementType,
        iconSize: number = 14,
    ) => {
        return (
            <div className="employee-field">
                <label htmlFor={name} className="flex items-center gap-2">
                    {Icon && <Icon size={iconSize} />} {label}
                </label>

                {type === "date" ? (
                    <DatePicker
                        selected={
                            formData[name as keyof typeof formData]
                                ? new Date(formData[name as keyof typeof formData] as string)
                                : null
                        }
                        onChange={(date: Date | null) =>
                            setFormData((prev) => ({
                                ...prev,
                                [name]: date ? date.toISOString().split("T")[0] : "",
                            }))
                        }
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
                        onChange={handleChange}
                        placeholder={placeholder}
                    />
                )}

                {errors[name] && <div className="text-red-500 text-sm">{errors[name]}</div>}
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
            <div className="add-item-header">
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
                    style={{ backgroundColor: '#f1f9f9' }}
                    sx={{
                        '& .MuiTab-root': {
                            color: '#009693',
                            '&.Mui-disabled': { color: '#ccc' },
                            '&.Mui-selected': { color: '#009693' },
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
                                {renderField("Phone Number", "number", "text", "Enter phone number", FaPhoneAlt)}
                                {renderField("Address", "address", "text", "Enter residential address", FaMapMarkerAlt)}
                                <div className="employee-field">
                                    <label htmlFor="nationality" className="flex items-center gap-2">
                                        <FaFlag className="text-gray-600" /> Nationality
                                    </label>
                                    <select name="nationality" value={formData.nationality} onChange={handleChange}>
                                        <option value="">Select Nationality</option>
                                        <option value="Indian">Indian</option>
                                        <option value="Foreigner">Foreigner</option>
                                        <option value="NRI">NRI</option>
                                    </select>
                                    {errors.nationality && <div className="text-red-500 text-sm">{errors.nationality}</div>}
                                </div>

                                {renderField("Date of Birth", "dob", "date", "Select date of birth", FaBirthdayCake)}
                                <div className="employee-field">
                                    <label htmlFor="religion" className="flex items-center gap-2">
                                        <FaVenusMars className="text-gray-600" /> Religion
                                    </label>
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
                                    {errors.religion && <div className="text-red-500 text-sm">{errors.religion}</div>}
                                </div>

                                <div className="employee-field">
                                    <label htmlFor="maritalStatus" className="flex items-center gap-2">
                                        <FaVenusMars className="text-gray-600" /> Marital Status
                                    </label>
                                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                                        <option value="">Select Marital Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">Divorced</option>
                                        <option value="Widowed">Widowed</option>
                                        <option value="Separated">Separated</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.maritalStatus && <div className="text-red-500 text-sm">{errors.maritalStatus}</div>}
                                </div>

                                <div className="employee-field">
                                    <label htmlFor="idProofType" className="flex items-center gap-2">
                                        <FaIdCard className="text-gray-600" /> ID Proof Type
                                    </label>
                                    <select
                                        name="idProofType"
                                        value={formData.idProofType}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                idProofType: e.target.value,
                                                idProofValue: "", // reset previous input
                                                idProofImage: null,
                                            }));
                                        }}
                                    >
                                        <option value="">Select ID Proof</option>
                                        <option value="aadhar">Aadhar Number</option>
                                        <option value="license">License</option>
                                        <option value="passport">Passport Number</option>
                                        <option value="bill">Utility Bill</option>
                                    </select>
                                    {errors.idProofType && <div className="text-red-500 text-sm">{errors.idProofType}</div>}
                                </div>

                                {formData.idProofType && formData.idProofType !== "bill" && (
                                    <div className="employee-field">
                                        <label className="flex items-center gap-2">
                                            {formData.idProofType === "aadhar" && <FaAddressCard />}
                                            {formData.idProofType === "license" && <FaIdCard />}
                                            {formData.idProofType === "passport" && <FaPassport />}
                                            Enter {formData.idProofType.charAt(0).toUpperCase() + formData.idProofType.slice(1)} Number
                                        </label>
                                        <input
                                            type="text"
                                            name="idProofValue"
                                            value={formData.idProofValue}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, idProofValue: e.target.value }))
                                            }
                                            placeholder={`Enter ${formData.idProofType} number`}
                                        />
                                        {errors.idProofValue && <div className="text-red-500 text-sm">{errors.idProofValue}</div>}
                                    </div>
                                )}

                                {formData.idProofType === "bill" && (
                                    <div className="employee-field">
                                        <label htmlFor="idProofImage"><FaUpload /> Utility Bill</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="idProofImage"
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, idProofImage: e.target.files?.[0] || null }))
                                            }
                                        />
                                        {errors.idProofImage && <div className="text-red-500 text-sm">{errors.idProofImage}</div>}
                                    </div>
                                )}

                                {renderField("Emergency Contact", "emergencyContact", "text", "Enter emergency contact number", FaPhoneAlt)}
                                <div className="employee-field">
                                    <label htmlFor="emergencyContactRelation" className="flex items-center gap-2">
                                        <FaUser className="text-gray-600" /> Emergency Contact Relation
                                    </label>
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
                                        <div className="text-red-500 text-sm">{errors.emergencyContactRelation}</div>
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
                        )}

                        {activeTab === 2 && (
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