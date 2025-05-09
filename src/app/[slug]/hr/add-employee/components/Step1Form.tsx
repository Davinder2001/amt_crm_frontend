"use client";

import React from "react";
import { FaUser, FaPhone, FaMapMarkerAlt, FaFlag, FaBirthdayCake, FaVenusMars, FaPassport, FaPhoneAlt, FaIdCard, FaUpload, FaAddressCard } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Step1FormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: { [key: string]: string };
}

const Step1Form: React.FC<Step1FormProps> = ({ formData, handleChange, setFormData, errors }) => {
  const renderField = (
    label: string,
    name: string,
    type = "text",
    placeholder = "",
    Icon?: React.ElementType
  ) => {
    return (
      <div className="employee-field">
        <label htmlFor={name} className="flex items-center gap-2">
          {Icon && <Icon className="text-gray-600" />} {label}
        </label>

        {type === "date" ? (
          <DatePicker
            selected={formData[name] ? new Date(formData[name] as string) : null}
            onChange={(date: Date | null) =>
              setFormData((prev: any) => ({
                ...prev,
                [name]: date ? date.toISOString().split("T")[0] : "",
              }))
            }
            dateFormat="yyyy-MM-dd"
            placeholderText={placeholder}
            className="your-input-class"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            maxDate={new Date()}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name] || ""}
            onChange={handleChange}
            placeholder={placeholder}
          />
        )}

        {errors[name] && <div className="text-red-500 text-sm">{errors[name]}</div>}
      </div>
    );
  };

  return (
    <div className="employee-fields-wrapper">
      {renderField("Name", "name", "text", "Enter full name", FaUser)}
      {renderField("Phone Number", "number", "text", "Enter phone number", FaPhone)}
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
            setFormData((prev: any) => ({
              ...prev,
              idProofType: e.target.value,
              idProofValue: "",
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
              setFormData((prev: any) => ({ ...prev, idProofValue: e.target.value }))
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
              setFormData((prev: any) => ({ ...prev, idProofImage: e.target.files?.[0] || null }))
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
  );
};

export default Step1Form;