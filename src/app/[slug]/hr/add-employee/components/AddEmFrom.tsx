// "use client";

// import React, { useState } from "react";
// import { useCreateEmployeMutation } from "@/slices/employe/employe";
// import { useGetRolesQuery } from "@/slices/roles/rolesApi";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import { useCompany } from "@/utils/Company";

// const AddEmployeeForm: React.FC = () => {
//   const router = useRouter();
//   const [createEmployee, { isLoading }] = useCreateEmployeMutation();
//   const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery({});
//   const {companySlug} = useCompany();

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

//   const renderField = (label: string, name: string, type = "text", placeholder = "") => (
//     <div className="employee-field">
//       <label htmlFor={name}>{label}</label>
//       <input type={type} name={name} value={formData.name} onChange={handleChange} placeholder={placeholder} />
//       {errors[name] && <div className="text-red-500 text-sm">{errors[name]}</div>}
//     </div>
//   );

//   return (
//     <div>
//       <div className="add-employee-form">
//         <form onSubmit={handleSubmit}>
//           {step === 1 && (
//             <div className="employee-fields-wrapper">
//               {renderField("Name", "name")}
//               {renderField("Phone Number", "number", "text", "0000 000 000")}
//               {renderField("Address", "address")}
//               {renderField("Nationality", "nationality")}
//               {renderField("Date of Birth", "dob", "date")}
//               {renderField("Religion", "religion")}
//               {renderField("Marital Status", "maritalStatus")}
//               {renderField("Passport No", "passportNo")}
//               {renderField("Emergency Contact", "emergencyContact")}
//               {renderField("Emergency Contact Relation", "emergencyContactRelation")}
//             </div>
//           )}

//           {step === 2 && (
//             <div className="employee-fields-wrapper">
//               {renderField("Email", "email", "email")}
//               {renderField("Password", "password", "password")}
//               {renderField("Salary", "salary")}
//               {renderField("Current Salary", "currentSalary")}
//               {renderField("Date of Hiring", "dateOfHire", "date")}
//               {renderField("Work Location", "workLocation")}
//               {renderField("Joining Date", "joiningDate", "date")}
//               {renderField("Shift Timings", "shiftTimings", "text", "0am - 0pm")}

//               <div className="employee-field">
//                 <label htmlFor="role">Role</label>
//                 <select name="role" value={formData.role} onChange={handleChange}>
//                   <option value="">Select Role</option>
//                   {rolesLoading ? (
//                     <option disabled>Loading...</option>
//                   ) : rolesError ? (
//                     <option disabled>Error loading roles</option>
//                   ) : (
//                     rolesData?.roles?.map((role: { id: string; name: string }) => (
//                       <option key={role.id} value={role.name}>{role.name}</option>
//                     ))
//                   )}
//                 </select>
//                 {errors.role && <div className="text-red-500 text-sm">{errors.role}</div>}
//               </div>

//               {renderField("Department", "department")}

//               <div className="employee-field">
//                 <label htmlFor="joiningType">Joining Type</label>
//                 <select name="joiningType" value={formData.joiningType} onChange={handleChange}>
//                   <option value="">Select Joining Type</option>
//                   <option value="full-time">Full-time</option>
//                   <option value="part-time">Part-time</option>
//                   <option value="contract">Contract</option>
//                 </select>
//                 {errors.joiningType && <div className="text-red-500 text-sm">{errors.joiningType}</div>}
//               </div>

//               {renderField("Previous Employer", "previousEmployer")}
//               {renderField("Medical Info (e.g., Blood Group)", "medicalInfo")}
//             </div>
//           )}

//           {step === 3 && (
//             <div className="employee-fields-wrapper">
//               {renderField("Bank Name", "bankName")}
//               {renderField("Account No", "accountNo")}
//               {renderField("IFSC Code", "ifscCode")}
//               {renderField("PAN No", "panNo")}
//               {renderField("UPI ID", "upiId")}
//               {renderField("Address Proof (e.g. Aadhar Number)", "addressProof")}
//               <div className="employee-field">
//                 <label htmlFor="profilePicture">Profile Picture</label>
//                 <input type="file" name="profilePicture" onChange={handleChange} />
//                 {errors.profilePicture && <div className="text-red-500 text-sm">{errors.profilePicture}</div>}
//               </div>
//             </div>
//           )}

//           <div className="create-employess-action">
//             {step > 1 && <button className="form-button" type="button" onClick={() => setStep(step - 1)}>Back</button>}
//             {step < 3 && <button className="form-button" type="button" onClick={() => setStep(step + 1)}>Next</button>}
//             {step === 3 && <button className="form-button" type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Submit"}</button>}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddEmployeeForm;

























"use client";

import React, { useState } from "react";
import { useCreateEmployeMutation } from "@/slices/employe/employe";
import { useGetRolesQuery } from "@/slices/roles/rolesApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useCompany } from "@/utils/Company";

const AddEmployeeForm: React.FC = () => {
  const router = useRouter();
  const [createEmployee, { isLoading }] = useCreateEmployeMutation();
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery({});
  const { companySlug } = useCompany();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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

  const renderField = (label: string, name: string, type = "text", placeholder = "") => (
    <div className="employee-field">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name as keyof typeof formData] || ""}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {errors[name] && <div className="text-red-500 text-sm">{errors[name]}</div>}
    </div>
  );

  return (
    <div>
      <div className="add-employee-form">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="employee-fields-wrapper">
              {renderField("Name", "name")}
              {renderField("Phone Number", "number", "text", "0000 000 000")}
              {renderField("Address", "address")}
              {renderField("Nationality", "nationality")}
              {renderField("Date of Birth", "dob", "date")}
              {renderField("Religion", "religion")}
              {renderField("Marital Status", "maritalStatus")}
              {renderField("Passport No", "passportNo")}
              {renderField("Emergency Contact", "emergencyContact")}
              {renderField("Emergency Contact Relation", "emergencyContactRelation")}
            </div>
          )}

          {step === 2 && (
            <div className="employee-fields-wrapper">
              {renderField("Email", "email", "email")}
              {renderField("Password", "password", "password")}
              {renderField("Salary", "salary")}
              {renderField("Current Salary", "currentSalary")}
              {renderField("Date of Hiring", "dateOfHire", "date")}
              {renderField("Work Location", "workLocation")}
              {renderField("Joining Date", "joiningDate", "date")}
              {renderField("Shift Timings", "shiftTimings", "text", "0am - 0pm")}

              <div className="employee-field">
                <label htmlFor="role">Role</label>
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

              {renderField("Department", "department")}

              <div className="employee-field">
                <label htmlFor="joiningType">Joining Type</label>
                <select name="joiningType" value={formData.joiningType} onChange={handleChange}>
                  <option value="">Select Joining Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                </select>
                {errors.joiningType && <div className="text-red-500 text-sm">{errors.joiningType}</div>}
              </div>

              {renderField("Previous Employer", "previousEmployer")}
              {renderField("Medical Info (e.g., Blood Group)", "medicalInfo")}
            </div>
          )}

          {step === 3 && (
            <div className="employee-fields-wrapper">
              {renderField("Bank Name", "bankName")}
              {renderField("Account No", "accountNo")}
              {renderField("IFSC Code", "ifscCode")}
              {renderField("PAN No", "panNo")}
              {renderField("UPI ID", "upiId")}
              {renderField("Address Proof (e.g. Aadhar Number)", "addressProof")}
              <div className="employee-field">
                <label htmlFor="profilePicture">Profile Picture</label>
                <input
                  type="file"
                  name="profilePicture"
                  onChange={handleChange}
                />
                {errors.profilePicture && <div className="text-red-500 text-sm">{errors.profilePicture}</div>}
              </div>
            </div>
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
