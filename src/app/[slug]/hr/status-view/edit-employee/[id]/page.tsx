// 'use client';

// import React, { useEffect, useState, FormEvent } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useFetchEmployesQuery, useUpdateEmployeMutation } from '@/slices/employe/employe';
// import { useGetRolesQuery } from '@/slices/roles/rolesApi';
// import HrNavigation from '../../../components/hrNavigation';
// import { useBreadcrumb } from '@/provider/BreadcrumbContext';
// import { useCompany } from '@/utils/Company';

// const EditUserPage: React.FC = () => {
//   const { setTitle } = useBreadcrumb();

//   useEffect(() => {
//     setTitle('Edit Employee Profile');
//   }, [setTitle]);

//   const { id } = useParams() as { id: string };
//   const { data: usersData, error: usersError, isLoading: usersLoading } = useFetchEmployesQuery();
//   const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery({});

//   const [updateUser, { isLoading: isUpdating }] = useUpdateEmployeMutation();
//   const router = useRouter();
//   const { companySlug } = useCompany();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [number, setNumber] = useState('');
//   const [role, setRole] = useState<Role | null>(null);
//   const [companyName, setCompanyName] = useState('');

//   useEffect(() => {
//     if (usersData) {
//       const user = usersData.employees.find((user: employee) => user.id.toString() === id);
//       if (user) {
//         setName(user.name || '');
//         setEmail(user.email || '');
//         setNumber(user.number || '');
//         setCompanyName(user.company_name || '');
//         setRole(user.roles?.[0] || null);
//       }
//     }
//   }, [usersData, id]);

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       await updateUser({
//         id: parseInt(id, 10),
//         name,
//         email,
//         number,
//         company_name: companyName,
//         roles: role ? [role] : [],
//       }).unwrap();
//       toast.success('User updated successfully!');
//       router.push(`/${companySlug}/hr/status-view`);
//     } catch (err: unknown) {
//       if (err && typeof err === 'object' && 'data' in err) {
//         const error = err as { data: { message: string } };
//         toast.error(error?.data?.message || 'Failed to update user. Please try again.');
//       } else {
//         toast.error('An unexpected error occurred.');
//       }
//     }
//   };

//   if (usersLoading) return <p>Loading user data...</p>;
//   if (usersError) return <p>Error fetching user data.</p>;

//   return (
//     <div className="edit-user-container">
//       <HrNavigation />
//       <h1 className="edit-user-title">Edit User</h1>
//       <form className="edit-user-form-outer" onSubmit={handleSubmit}>
//       <div className="edit-user-form">
//        <div className="form-group">
//        <label className="form-label">Name:</label>
//           <input
//             type="text"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="form-input"
//           />
//         </div>
//         <div className="form-group">
//         <label className="form-label">Email:</label>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="form-input"
//           />
//         </div>
//         <div className="form-group">
//         <label className="form-label">Phone Number:</label>
//           <input
//             type="text"
//             placeholder="Phone Number"
//             value={number}
//             onChange={(e) => setNumber(e.target.value)}
//             className="form-input"
//           />
//         </div>
//         <div className="form-group">
//           <label className="form-label">Select Role:</label>
//           <select
//             value={role?.name || ''}
//             onChange={(e) => {
//               const selectedRole = rolesData?.roles.find((r: Role) => r.name === e.target.value);
//               setRole(selectedRole || null);
//             }}
//             className="form-select"
//           >
//             {rolesLoading ? (
//               <option>Loading roles...</option>
//             ) : rolesError ? (
//               <option>Error loading roles</option>
//             ) : rolesData && rolesData.total > 0 ? (
//               <>
//                 <option value="">Select a role</option>
//                 {rolesData.roles.map((roleItem: Role) => (
//                   <option key={roleItem.id} value={roleItem.name}>
//                     {roleItem.name}
//                   </option>
//                 ))}
//               </>
//             ) : (
//               <option value="">No roles available</option>
//             )}
//           </select>
//         </div>
        
//         </div>
//         <div className='edit-user-form-smt-btn'>
//         <button
//           type="submit"
//           disabled={isUpdating}
//           className={`buttons ${isUpdating ? 'button-disabled' : ''}`}
//         >
//           {isUpdating ? 'Updating...' : 'Update'}
//         </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditUserPage;




























'use client';

import React, { useState, useEffect } from "react";
import { useUpdateEmployeMutation, useFetchEmployesQuery } from "@/slices/employe/employe";
import { useGetRolesQuery } from "@/slices/roles/rolesApi";
import { useFetchCompanyShiftsQuery } from "@/slices/company/companyApi";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import { useCompany } from "@/utils/Company";
import Step1Form from "../../../add-employee/components/Step1Form";
import Step2Form from "../../../add-employee/components/Step2Form";
import Step3Form from "../../../add-employee/components/Step3Form";
import { useBreadcrumb } from '@/provider/BreadcrumbContext';

const EditEmployeeForm: React.FC = () => {
  const { setTitle } = useBreadcrumb();
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { companySlug } = useCompany();
  
  const [updateEmployee, { isLoading }] = useUpdateEmployeMutation();
  const { data: employeeData, isLoading: employeeLoading, error: employeeError } = useFetchEmployesQuery();
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery({});
  const { data: shiftData, isLoading: shiftLoading, error: shiftError } = useFetchCompanyShiftsQuery();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
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

  useEffect(() => {
    setTitle('Edit Employee Profile');
  }, [setTitle]);

  // Load employee data when component mounts or employeeData changes
  useEffect(() => {
    if (employeeData && id) {
      const employee = employeeData.employees.find((emp: any) => emp.id.toString() === id);
      if (employee) {
        setFormData({
          ...employee,
          role: employee.roles?.[0]?.name || "",
          shiftTimings: employee.shift?.id || "",
        });
      }
    }
  }, [employeeData, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await updateEmployee({
        id: parseInt(id, 10),
        ...formData,
        roles: formData.role ? [{ name: formData.role }] : [],
        shift: formData.shiftTimings ? { id: formData.shiftTimings } : null,
      }).unwrap();
      toast.success("Employee updated successfully!");
      router.push(`/${companySlug}/hr/status-view`);
    } catch (err) {
      console.error("Error updating employee:", err);
      toast.error("Failed to update employee");
    }
  };

  if (employeeLoading) return <p>Loading employee data...</p>;
  if (employeeError) return <p>Error loading employee data</p>;

  return (
    <div className="edit-employee-container add-employee-form">
      
      <div className="edit-employee-form">
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

          <div className="edit-employee-actions create-employess-action">
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
                {isLoading ? "Updating..." : "Update Employee"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeForm;