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