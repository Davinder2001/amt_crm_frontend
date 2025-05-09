// "use client";

// import React, { useState } from "react";
// import { useCreateEmployeMutation } from "@/slices/employe/employe";
// import { useGetRolesQuery } from "@/slices/roles/rolesApi";
// import { useFetchCompanyShiftsQuery } from "@/slices/company/companyApi";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import { useCompany } from "@/utils/Company";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { FaUser, FaPhone, FaMapMarkerAlt, FaFlag, FaBirthdayCake, FaVenusMars, FaPassport, FaPhoneAlt, FaEnvelope, FaLock, FaMoneyBillWave, FaBuilding, FaCalendarAlt, FaBriefcase, FaHospital, FaUniversity, FaIdCard, FaCreditCard, FaQrcode, FaImage, FaUpload, FaAddressCard } from "react-icons/fa";

// const AddEmployeeForm: React.FC = () => {
//   const router = useRouter();
//   const [createEmployee, { isLoading }] = useCreateEmployeMutation();
//   const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery({});
//   const { data: shiftData, isLoading: shiftLoading, error: shiftError } = useFetchCompanyShiftsQuery();
//   const { companySlug } = useCompany();

//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     name: "",
//     number: "",
//     address: "",
//     nationality: "",
//     dob: "",
//     religion: "",
//     maritalStatus: "",
//     passportNo: "",
//     emergencyContact: "",
//     emergencyContactRelation: "",
//     email: "",
//     password: "",
//     salary: "",
//     role: "",
//     department: "",
//     currentSalary: "",
//     shiftTimings: "",
//     dateOfHire: "",
//     workLocation: "",
//     joiningDate: "",
//     joiningType: "",
//     previousEmployer: "",
//     medicalInfo: "",
//     bankName: "",
//     accountNo: "",
//     ifscCode: "",
//     panNo: "",
//     upiId: "",
//     addressProof: "",
//     profilePicture: "",
//     idProofType: "",
//     idProofValue: "",
//     idProofImage: null,
//   });

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     try {
//       await createEmployee(formData).unwrap();
//       toast.success("Employee created successfully!");
//       router.push(`/${companySlug}/hr/status-view`);
//     } catch (err) {
//       console.error("Error creating employee:", err);
//       toast.error("Failed to create employee");
//     }
//   };

//   const renderField = (
//     label: string,
//     name: string,
//     type = "text",
//     placeholder = "",
//     Icon?: React.ElementType
//   ) => {
//     return (
//       <div className="employee-field">
//         <label htmlFor={name} className="flex items-center gap-2">
//           {Icon && <Icon className="text-gray-600" />} {label}
//         </label>

//         {type === "date" ? (
//           <DatePicker
//             selected={
//               formData[name as keyof typeof formData]
//                 ? new Date(formData[name as keyof typeof formData] as string)
//                 : null
//             }
//             onChange={(date: Date | null) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 [name]: date ? date.toISOString().split("T")[0] : "",
//               }))
//             }
//             dateFormat="yyyy-MM-dd"
//             placeholderText={placeholder}
//             className="your-input-class"
//             showYearDropdown
//             scrollableYearDropdown
//             yearDropdownItemNumber={100}
//             maxDate={new Date()}
//           />
//         ) : (
//           <input
//             type={type}
//             name={name}
//             value={formData[name as keyof typeof formData] || ""}
//             onChange={handleChange}
//             placeholder={placeholder}
//           />
//         )}

//         {errors[name] && <div className="text-red-500 text-sm">{errors[name]}</div>}
//       </div>
//     );
//   };



//   return (
//     <div>
//       <div className="add-employee-form">
//         <form onSubmit={handleSubmit}>
//           {step === 1 && (
//             <div className="employee-fields-wrapper">
//               {renderField("Name", "name", "text", "Enter full name", FaUser)}
//               {renderField("Phone Number", "number", "text", "Enter phone number", FaPhone)}
//               {renderField("Address", "address", "text", "Enter residential address", FaMapMarkerAlt)}
//               {/* {renderField("Nationality", "nationality", "text", "Enter nationality", FaFlag)} */}
//               <div className="employee-field">
//                 <label htmlFor="nationality" className="flex items-center gap-2">
//                   <FaFlag className="text-gray-600" /> Nationality
//                 </label>
//                 <select name="nationality" value={formData.nationality} onChange={handleChange}>
//                   <option value="">Select Nationality</option>
//                   <option value="Indian">Indian</option>
//                   <option value="Foreigner">Foreigner</option>
//                   <option value="NRI">NRI</option>
//                 </select>
//                 {errors.nationality && <div className="text-red-500 text-sm">{errors.nationality}</div>}
//               </div>

//               {renderField("Date of Birth", "dob", "date", "Select date of birth", FaBirthdayCake)}
//               {/* {renderField("Religion", "religion", "text", "Enter religion", FaVenusMars)} */}
//               <div className="employee-field">
//                 <label htmlFor="religion" className="flex items-center gap-2">
//                   <FaVenusMars className="text-gray-600" /> Religion
//                 </label>
//                 <select name="religion" value={formData.religion} onChange={handleChange}>
//                   <option value="">Select Religion</option>
//                   <option value="Hinduism">Hinduism</option>
//                   <option value="Islam">Islam</option>
//                   <option value="Christianity">Christianity</option>
//                   <option value="Sikhism">Sikhism</option>
//                   <option value="Buddhism">Buddhism</option>
//                   <option value="Jainism">Jainism</option>
//                   <option value="Judaism">Judaism</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 {errors.religion && <div className="text-red-500 text-sm">{errors.religion}</div>}
//               </div>

//               {/* {renderField("Marital Status", "maritalStatus", "text", "Enter marital status", FaVenusMars)} */}
//               <div className="employee-field">
//                 <label htmlFor="maritalStatus" className="flex items-center gap-2">
//                   <FaVenusMars className="text-gray-600" /> Marital Status
//                 </label>
//                 <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
//                   <option value="">Select Marital Status</option>
//                   <option value="Single">Single</option>
//                   <option value="Married">Married</option>
//                   <option value="Divorced">Divorced</option>
//                   <option value="Widowed">Widowed</option>
//                   <option value="Separated">Separated</option>
//                   <option value="Other">Other</option>
//                 </select>
//                 {errors.maritalStatus && <div className="text-red-500 text-sm">{errors.maritalStatus}</div>}
//               </div>

//               {/* {renderField("Passport No", "passportNo", "text", "Enter passport number", FaPassport)} */}

//               <div className="employee-field">
//                 <label htmlFor="idProofType" className="flex items-center gap-2">
//                   <FaIdCard className="text-gray-600" /> ID Proof Type
//                 </label>
//                 <select
//                   name="idProofType"
//                   value={formData.idProofType}
//                   onChange={(e) => {
//                     setFormData((prev) => ({
//                       ...prev,
//                       idProofType: e.target.value,
//                       idProofValue: "", // reset previous input
//                       idProofImage: null,
//                     }));
//                   }}
//                 >
//                   <option value="">Select ID Proof</option>
//                   <option value="aadhar">Aadhar Number</option>
//                   <option value="license">License</option>
//                   <option value="passport">Passport Number</option>
//                   <option value="bill">Utility Bill</option>
//                 </select>
//                 {errors.idProofType && <div className="text-red-500 text-sm">{errors.idProofType}</div>}
//               </div>

//               {/* Conditional input based on selection */}
//               {formData.idProofType && formData.idProofType !== "bill" && (
//                 <div className="employee-field">
//                   <label className="flex items-center gap-2">
//                     {formData.idProofType === "aadhar" && <FaAddressCard />}
//                     {formData.idProofType === "license" && <FaIdCard />}
//                     {formData.idProofType === "passport" && <FaPassport />}
//                     Enter {formData.idProofType.charAt(0).toUpperCase() + formData.idProofType.slice(1)} Number
//                   </label>
//                   <input
//                     type="text"
//                     name="idProofValue"
//                     value={formData.idProofValue}
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, idProofValue: e.target.value }))
//                     }
//                     placeholder={`Enter ${formData.idProofType} number`}
//                   />
//                   {errors.idProofValue && <div className="text-red-500 text-sm">{errors.idProofValue}</div>}
//                 </div>
//               )}

//               {formData.idProofType === "bill" && (
//                 <div className="employee-field">
//                   <label htmlFor="idProofImage"><FaUpload /> Utility Bill</label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     name="idProofImage"
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, idProofImage: e.target.files?.[0] || null }))
//                     }
//                   />
//                   {errors.idProofImage && <div className="text-red-500 text-sm">{errors.idProofImage}</div>}
//                 </div>
//               )}

//               {renderField("Emergency Contact", "emergencyContact", "text", "Enter emergency contact number", FaPhoneAlt)}
//               {/* {renderField("Emergency Contact Relation", "emergencyContactRelation", "text", "Enter relationship", FaUser)} */}
//               <div className="employee-field">
//                 <label htmlFor="emergencyContactRelation" className="flex items-center gap-2">
//                   <FaUser className="text-gray-600" /> Emergency Contact Relation
//                 </label>
//                 <select
//                   name="emergencyContactRelation"
//                   value={formData.emergencyContactRelation}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Relation</option>
//                   <option value="mother">Father</option>
//                   <option value="father">Mother</option>
//                   <option value="brother">Brother</option>
//                   <option value="sister">Sister</option>
//                   <option value="other">Other</option>
//                 </select>
//                 {errors.emergencyContactRelation && (
//                   <div className="text-red-500 text-sm">{errors.emergencyContactRelation}</div>
//                 )}
//               </div>



//             </div>
//           )}

//           {step === 2 && (
//             <div className="employee-fields-wrapper">
//               {renderField("Email", "email", "email", "Enter email address", FaEnvelope)}
//               {renderField("Password", "password", "password", "Create a password", FaLock)}
//               {renderField("Salary", "salary", "text", "Enter expected salary", FaMoneyBillWave)}
//               {renderField("Current Salary", "currentSalary", "text", "Enter current salary", FaMoneyBillWave)}
//               {renderField("Date of Hiring", "dateOfHire", "date", "Select hiring date", FaCalendarAlt)}
//               {renderField("Work Location", "workLocation", "text", "Enter work location", FaBuilding)}
//               {renderField("Joining Date", "joiningDate", "date", "Select joining date", FaCalendarAlt)}


//               <div className="employee-field">
//                 <label htmlFor="shiftTimings">Shift Timings</label>
//                 <select
//                   name="shiftTimings"
//                   value={formData.shiftTimings}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Shift</option>
//                   {shiftLoading ? (
//                     <option disabled>Loading shifts...</option>
//                   ) : shiftError ? (
//                     <option disabled>Error loading shifts</option>
//                   ) : (
//                     shiftData?.data?.map((shift: { id: number; shift_name: string; start_time: string; end_time: string }) => (
//                       <option key={shift.id} value={shift.id}>
//                         {`${shift.shift_name} (${shift.start_time} - ${shift.end_time})`}
//                       </option>
//                     ))
//                   )}
//                 </select>
//                 {errors.shiftTimings && (
//                   <div className="text-red-500 text-sm">{errors.shiftTimings}</div>
//                 )}
//               </div>


//               <div className="employee-field">
//                 <label htmlFor="role" className="flex items-center gap-2">
//                   <FaIdCard className="text-gray-600" /> Role
//                 </label>
//                 <select name="role" value={formData.role} onChange={handleChange}>
//                   <option value="">Select Role</option>
//                   {rolesLoading ? (
//                     <option disabled>Loading...</option>
//                   ) : rolesError ? (
//                     <option disabled>Error loading roles</option>
//                   ) : (
//                     rolesData?.roles?.map((role: { id: string; name: string }) => (
//                       <option key={role.id} value={role.name}>
//                         {role.name}
//                       </option>
//                     ))
//                   )}
//                 </select>
//                 {errors.role && <div className="text-red-500 text-sm">{errors.role}</div>}
//               </div>


//               {renderField("Department", "department", "text", "Enter department", FaUniversity)}

//               <div className="employee-field">
//                 <label htmlFor="joiningType" className="flex items-center gap-2">
//                   <FaBriefcase className="text-gray-600" /> Joining Type
//                 </label>
//                 <select name="joiningType" value={formData.joiningType} onChange={handleChange}>
//                   <option value="">Select Joining Type</option>
//                   <option value="full-time">Full-time</option>
//                   <option value="part-time">Part-time</option>
//                   <option value="contract">Contract</option>
//                 </select>
//                 {errors.joiningType && (
//                   <div className="text-red-500 text-sm">{errors.joiningType}</div>
//                 )}
//               </div>


//               {renderField("Previous Employer", "previousEmployer", "text", "Enter previous employer", FaBuilding)}
//               {renderField("Medical Info (e.g., Blood Group)", "medicalInfo", "text", "Enter medical info", FaHospital)}
//             </div>
//           )}

//           {step === 3 && (
//             <div className="employee-fields-wrapper">
//               {renderField("Bank Name", "bankName", "text", "Enter bank name", FaUniversity)}
//               {renderField("Account No", "accountNo", "text", "Enter bank account number", FaCreditCard)}
//               {renderField("IFSC Code", "ifscCode", "text", "Enter IFSC code", FaQrcode)}
//               {renderField("PAN No", "panNo", "text", "Enter PAN number", FaIdCard)}
//               {renderField("UPI ID", "upiId", "text", "Enter UPI ID", FaQrcode)}
//               {renderField("Address Proof (e.g. Aadhar Number)", "addressProof", "text", "Enter Aadhar or other ID number", FaIdCard)}


//               <div className="employee-field">
//                 <label htmlFor="profilePicture" className="flex items-center gap-2">
//                   <FaImage className="text-gray-600" /> Profile Picture
//                 </label>
//                 <input
//                   type="file"
//                   name="profilePicture"
//                   accept="image/*"
//                   onChange={handleChange}
//                   className="file-input" // Optional: Add your custom styling
//                 />

//                 {errors.profilePicture && (
//                   <div className="text-red-500 text-sm">{errors.profilePicture}</div>
//                 )}
//               </div>

//             </div>
//           )}

//           <div className="create-employess-action">
//             {step > 1 && (
//               <button className="form-button" type="button" onClick={() => setStep(step - 1)}>
//                 Back
//               </button>
//             )}
//             {step < 3 && (
//               <button className="form-button" type="button" onClick={() => setStep(step + 1)}>
//                 Next
//               </button>
//             )}
//             {step === 3 && (
//               <button className="form-button" type="submit" disabled={isLoading}>
//                 {isLoading ? "Creating..." : "Submit"}
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddEmployeeForm;















// ...................................................................................................................................................................................................................................
"use client";

import React, { useState } from "react";
import { useCreateEmployeMutation } from "@/slices/employe/employe";
import { useGetRolesQuery } from "@/slices/roles/rolesApi";
import { useFetchCompanyShiftsQuery } from "@/slices/company/companyApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useCompany } from "@/utils/Company";
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form";
import Step3Form from "./Step3Form";

const AddEmployeeForm: React.FC = () => {
  const router = useRouter();
  const [createEmployee, { isLoading }] = useCreateEmployeMutation();
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery({});
  const { data: shiftData, isLoading: shiftLoading, error: shiftError } = useFetchCompanyShiftsQuery();
  const { companySlug } = useCompany();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<employee>({
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
    idProofImage: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await createEmployee(formData).unwrap();
      toast.success("Employee created successfully!");
      router.push(`/${companySlug}/hr/status-view`);
    } catch (err) {
      console.error("Error creating employee:", err);
      toast.error("Failed to create employee");
    }
  };

  return (
    <div>
      <div className="add-employee-form">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <Step1Form
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {step === 2 && (
            <Step2Form
              formData={formData}
              handleChange={handleChange}
              setFormData={setFormData}
              errors={errors}
              shiftData={shiftData}
              shiftLoading={shiftLoading}
              shiftError={shiftError}
              rolesData={rolesData}
              rolesLoading={rolesLoading}
              rolesError={rolesError}
            />
          )}

          {step === 3 && (
            <Step3Form
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          )}

          <div className="create-employess-action">
            {step > 1 && (
              <button className="form-button" type="button" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            {step < 3 && (
              <button className="form-button" type="button" onClick={() => setStep(step + 1)}>
                Next
              </button>
            )}
            {step === 3 && (
              <button className="form-button" type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;