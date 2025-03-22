// "use client";

// import React, { useState } from "react";
// import { useCreateEmployeMutation } from "@/slices/employe/employe";
// import { useGetRolesQuery } from "@/slices/roles/rolesApi";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";

// const Page: React.FC = () => {
//   const router = useRouter();
//   const [createEmployee, { isLoading }] = useCreateEmployeMutation();
//   const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery({});

//   // Single state object for all form fields
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     number: "",
//     salary: "",
//     role: "",
//     password: "",
//     dateOfHire: "",
//     joiningDate: "",
//     shiftTimings: "",
//   });

//   // Handles input changes dynamically
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await createEmployee(formData).unwrap();
//       toast.success("Employee created successfully!");
//       router.push("/employee");
//     } catch {
//       toast.error("Failed to create employee. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h2>Create Employee</h2>
//       <div className="add-employee-form">
//         <form onSubmit={handleSubmit}>
//           {/* Text Inputs */}
//           {["name", "email", "number", "salary", "password", "dateOfHire", "joiningDate", "shiftTimings"].map((field) => (
//             <input
//               key={field}
//               type={field.includes("date") ? "date" : field === "password" ? "password" : "text"}
//               placeholder={field.replace(/([A-Z])/g, " $1").trim()} // Converts camelCase to readable format
//               name={field}
//               value={formData[field as keyof typeof formData]}
//               onChange={handleChange}
//             />
//           ))}

//           {/* Role Dropdown */}
//           <select name="role" value={formData.role} onChange={handleChange}>
//             <option value="">Select Role</option>
//             {rolesLoading ? (
//               <option disabled>Loading...</option>
//             ) : rolesError ? (
//               <option disabled>Error loading roles</option>
//             ) : (
//               rolesData?.roles?.map((role: { id: string; name: string }) => (
//                 <option key={role.id} value={role.name}>
//                   {role.name}
//                 </option>
//               ))
//             )}
//           </select>

//           {/* Submit Button */}
//           <button type="submit" disabled={isLoading}>
//             {isLoading ? "Creating..." : "Create Employee"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Page;











"use client";

import React, { useState } from "react";
import { useCreateEmployeMutation } from "@/slices/employe/employe";
import { useGetRolesQuery } from "@/slices/roles/rolesApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
  const router = useRouter();
  const [createEmployee, { isLoading }] = useCreateEmployeMutation();
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery({});

  // State for multi-step form
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    number: "",
    address: "",
    nationality: "",
    religion: "",
    maritalStatus: "",
    passportNo: "",
    emergencyContact: "",
    joiningDate: "",

    // Employment Details
    salary: "",
    role: "",
    password: "",
    currentSalary: "",
    shiftTimings: "",

    // Bank Information
    bankName: "",
    accountNo: "",
    ifscCode: "",
    panNo: "",
    upiId: "",
  });

  // Handles input changes dynamically
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmployee(formData).unwrap();
      toast.success("Employee created successfully!");
      router.push("/employee");
    } catch {
      toast.error("Failed to create employee. Please try again.");
    }
  };

  return (
    <div>
      <h2>Create Employee - Step {step}</h2>
      <div className="add-employee-form">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
              <input type="text" name="number" value={formData.number} onChange={handleChange} placeholder="Phone Number" />
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
              <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Nationality" />
              <input type="text" name="religion" value={formData.religion} onChange={handleChange} placeholder="Religion" />
              <input type="text" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} placeholder="Marital Status" />
              <input type="text" name="passportNo" value={formData.passportNo} onChange={handleChange} placeholder="Passport No" />
              <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Emergency Contact" />
              <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
            </>
          )}

          {/* Step 2: Employment Details */}
          {step === 2 && (
            <>
              <input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary" />
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
              <input type="text" name="currentSalary" value={formData.currentSalary} onChange={handleChange} placeholder="Current Salary" />
              <input type="text" name="shiftTimings" value={formData.shiftTimings} onChange={handleChange} placeholder="Shift Timings" />
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Select Role</option>
                {rolesLoading ? (
                  <option disabled>Loading...</option>
                ) : rolesError ? (
                  <option disabled>Error loading roles</option>
                ) : (
                  rolesData?.roles?.map((role: { id: string; name: string }) => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))
                )}
              </select>
            </>
          )}

          {/* Step 3: Bank Information */}
          {step === 3 && (
            <>
              <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" />
              <input type="text" name="accountNo" value={formData.accountNo} onChange={handleChange} placeholder="Account No" />
              <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="IFSC Code" />
              <input type="text" name="panNo" value={formData.panNo} onChange={handleChange} placeholder="PAN No" />
              <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} placeholder="UPI ID" />
            </>
          )}

          {/* Navigation Buttons */}
          <div>
            {step > 1 && <button type="button" onClick={() => setStep(step - 1)}>Back</button>}
            {step < 3 && <button type="button" onClick={() => setStep(step + 1)}>Next</button>}
            {step === 3 && <button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Submit"}</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
