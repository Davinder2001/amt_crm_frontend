"use client";

import React, { useState } from "react";
import { useCreateEmployeMutation } from "@/slices/employe/employe";
import { useGetRolesQuery } from "@/slices/roles/rolesApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AddEmployeeForm: React.FC = () => {
  const router = useRouter();
  const [createEmployee, { isLoading }] = useCreateEmployeMutation();
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery({});

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    number: "",
    address: "",
    nationality: "",
    dob: "",
    religion: "",
    maritalStatus: "",
    passportNo: "",
    emergencyContact: "",
    emergencyContactRelation: "", // Added relation

    // Employment Details
    email: "",
    password: "",
    salary: "",
    role: "",
    department: "", // Added department
    currentSalary: "",
    shiftTimings: "",
    dateOfHire: "",
    workLocation: "",
    joiningDate: "",
    joiningType: "", // Added joining type (e.g. full-time, part-time)
    previousEmployer: "", // Added previous employer
    medicalInfo: "", // Added medical info (blood group, allergies, etc.)

    // Bank Information
    bankName: "",
    accountNo: "",
    ifscCode: "",
    panNo: "",
    upiId: "",

    // Additional Information
    addressProof: "", // Added address proof (e.g. Aadhar number)
    profilePicture: "", // Added profile picture upload
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmployee(formData).unwrap();
      toast.success("Employee created successfully!");
      router.push("/hr/status-view");
    } catch {
      toast.error("Failed to create employee. Please try again.");
    }
  };

  return (
    <div>
      <div className="add-employee-form">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <>
              <div className="employee-fields-wrapper">
                <div className="employee-field">
                  <label htmlFor="name">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
                </div>
                <div className="employee-field">
                  <label htmlFor="number">Phone Number</label>
                  <input type="text" name="number" value={formData.number} onChange={handleChange} placeholder="0000 000 000" />
                </div>
                <div className="employee-field">
                  <label htmlFor="address">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                </div>
                <div className="employee-field">
                  <label htmlFor="nationality">Nationality</label>
                  <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Nationality" />
                </div>
                <div className="employee-field">
                  <label htmlFor="dob">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                </div>
                <div className="employee-field">
                  <label htmlFor="religion">Religion</label>
                  <input type="text" name="religion" value={formData.religion} onChange={handleChange} placeholder="Religion" />
                </div>
                <div className="employee-field">
                  <label htmlFor="maritalStatus">Marital Status</label>
                  <input type="text" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} placeholder="Marital Status" />
                </div>
                <div className="employee-field">
                  <label htmlFor="passportNo">Passport No</label>
                  <input type="text" name="passportNo" value={formData.passportNo} onChange={handleChange} placeholder="Passport No" />
                </div>
                <div className="employee-field">
                  <label htmlFor="emergencyContact">Emergency Contact</label>
                  <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Emergency Contact" />
                </div>
                <div className="employee-field">
                  <label htmlFor="emergencyContactRelation">Emergency Contact Relation</label>
                  <input type="text" name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleChange} placeholder="Emergency Contact Relation" />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Employment Details */}
          {step === 2 && (
            <>
              
              <div className="employee-fields-wrapper">
                <div className="employee-field">
                  <label htmlFor="email">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                </div>
                <div className="employee-field">
                  <label htmlFor="password">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                </div>
                <div className="employee-field">
                  <label htmlFor="salary">Salary</label>
                  <input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary" />
                </div>
                <div className="employee-field">
                  <label htmlFor="currentSalary">Current Salary</label>
                  <input type="text" name="currentSalary" value={formData.currentSalary} onChange={handleChange} placeholder="Current Salary" />
                </div>
                <div className="employee-field">
                  <label htmlFor="dateOfHire">Date of Hiring</label>
                  <input type="date" name="dateOfHire" value={formData.dateOfHire} onChange={handleChange} />
                </div>
                <div className="employee-field">
                  <label htmlFor="workLocation">Work Location</label>
                  <input type="text" name="workLocation" value={formData.workLocation} onChange={handleChange} placeholder="Work Location" />
                </div>
                <div className="employee-field">
                  <label htmlFor="joiningDate">Joining Date</label>
                  <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
                </div>
                <div className="employee-field">
                  <label htmlFor="shiftTimings">Shift Timings</label>
                  <input type="text" name="shiftTimings" value={formData.shiftTimings} onChange={handleChange} placeholder="0am - 0pm" />
                </div>
                <div className="employee-field">
                  <label htmlFor="role">Role</label>
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="">Select Role</option>
                    {rolesLoading ? <option disabled>Loading...</option> : rolesError ? <option disabled>Error loading roles</option> : rolesData?.roles?.map((role: { id: string; name: string }) => <option key={role.id} value={role.name}>{role.name}</option>)}
                  </select>
                </div>
                <div className="employee-field">
                  <label htmlFor="department">Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" />
                </div>
                <div className="employee-field">
                  <label htmlFor="joiningType">Joining Type</label>
                  <select name="joiningType" value={formData.joiningType} onChange={handleChange}>
                    <option value="">Select Joining Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div className="employee-field">
                  <label htmlFor="previousEmployer">Previous Employer</label>
                  <input type="text" name="previousEmployer" value={formData.previousEmployer} onChange={handleChange} placeholder="Previous Employer" />
                </div>
                <div className="employee-field">
                  <label htmlFor="medicalInfo">Medical Info (e.g., Blood Group)</label>
                  <input type="text" name="medicalInfo" value={formData.medicalInfo} onChange={handleChange} placeholder="Medical Info" />
                </div>
              </div>
            </>
          )}

          {/* Step 3: Bank Information */}
          {step === 3 && (
            <>

              <div className="employee-fields-wrapper">
                <div className="employee-field">
                  <label htmlFor="bankName">Bank Name</label>
                  <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" />
                </div>
                <div className="employee-field">
                  <label htmlFor="accountNo">Account No</label>
                  <input type="text" name="accountNo" value={formData.accountNo} onChange={handleChange} placeholder="Account No" />
                </div>
                <div className="employee-field">
                  <label htmlFor="ifscCode">IFSC Code</label>
                  <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="IFSC Code" />
                </div>
                <div className="employee-field">
                  <label htmlFor="panNo">PAN No</label>
                  <input type="text" name="panNo" value={formData.panNo} onChange={handleChange} placeholder="PAN No" />
                </div>
                <div className="employee-field">
                  <label htmlFor="upiId">UPI ID</label>
                  <input type="text" name="upiId" value={formData.upiId} onChange={handleChange} placeholder="UPI ID" />
                </div>
                {/* Medical Info, Address Proof, Previous Employer */}
                <div className="employee-field">
                  <label htmlFor="addressProof">Address Proof (e.g. Aadhar Number)</label>
                  <input type="text" name="addressProof" value={formData.addressProof} onChange={handleChange} placeholder="Address Proof" />
                </div>
                <div className="employee-field">
                  <label htmlFor="profilePicture">Profile Picture</label>
                  <input type="file" name="profilePicture" onChange={handleChange} />
                </div>
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="create-employess-action">
            {step > 1 && <button className="form-button" type="button" onClick={() => setStep(step - 1)}>Back</button>}
            {step < 3 && <button className="form-button" type="button" onClick={() => setStep(step + 1)}>Next</button>}
            {step === 3 && <button className="form-button" type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Submit"}</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
