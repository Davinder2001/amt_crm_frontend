"use client";

import React, { useState, useEffect } from "react";
import {
  useUpdateEmployeMutation,
  useFetchEmployesQuery,
} from "@/slices/employe/employe";
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
  const {
    data: employeeData,
    isLoading: employeeLoading,
    error: employeeError,
  } = useFetchEmployesQuery();
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useGetRolesQuery({});
  const {
    data: shiftData,
    isLoading: shiftLoading,
    error: shiftError,
  } = useFetchCompanyShiftsQuery();

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
    idProofType: "",
    idProofValue: "",
    idProofImage: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setTitle("Edit Employee Profile");
  }, [setTitle]);

  useEffect(() => {
    if (employeeData && id) {
      const employee = employeeData.employees.find(
        (emp) => emp.id.toString() === id
      );
      if (employee) {
        setFormData({
          ...employee,
          role: employee.roles?.[0]?.name || "",
          shiftTimings: employee.shift?.id || "",
        });
      }
    }
  }, [employeeData, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
              shiftError={!!shiftError}
              rolesData={rolesData}
              rolesLoading={rolesLoading}
              rolesError={!!rolesError}
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
              <button
                className="form-button"
                type="button"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
            {step < 3 && (
              <button
                className="form-button"
                type="button"
                onClick={() => setStep(step + 1)}
              >
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
