"use client";

import React, { useState, useEffect } from "react";
import {
  useCreateShiftMutation,
  useFetchCompanyShiftsQuery,
} from "@/slices/company/companyApi";
import { toast } from "react-toastify";
import { FiClock, FiPlus, FiCalendar, FiWatch } from "react-icons/fi";

const Page = () => {
  const { data: shiftData, isLoading, refetch } = useFetchCompanyShiftsQuery();
  const [createShift, { isLoading: isCreating }] = useCreateShiftMutation();

  const [form, setForm] = useState({
    shift_name: "",
    start_time: "",
    end_time: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(
      form.shift_name.trim() !== "" &&
      form.start_time !== "" &&
      form.end_time !== ""
    );
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createShift(form).unwrap();
      toast.success("Shift created successfully!");
      setForm({ shift_name: "", start_time: "", end_time: "" });
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create shift");
    }
  };

  return (
    <div className="shift-management-container">
      <div className="glass-panel glass-panel-one ">
        <h1 className="main-heading">
          <FiClock className="icon-spin" /> Shift Management
        </h1>
        <p className="subheading">Create and manage your work shifts</p>
      </div>

      <div className="content-grid">
        {/* Create Shift Section */}
        <section className="create-shift-section glass-panel">
          <h2 className="section-title">
            <FiPlus /> Create New Shift
          </h2>
          
          <form onSubmit={handleCreate} className="shift-form">
            <div className="form-grid">
              <div className={`form-group ${form.shift_name ? "filled" : ""}`}>
                <label>
                  Shift Name <span className="required-asterisk">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="shift_name"
                    value={form.shift_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Morning Shift"
                    className="form-input"
                  />
                  <span className="input-icon">
                    <FiCalendar />
                  </span>
                </div>
              </div>

              <div className={`form-group ${form.start_time ? "filled" : ""}`}>
                <label>
                  Start Time <span className="required-asterisk">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="time"
                    name="start_time"
                    value={form.start_time}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                  <span className="input-icon">
                    <FiWatch />
                  </span>
                </div>
              </div>

              <div className={`form-group ${form.end_time ? "filled" : ""}`}>
                <label>
                  End Time <span className="required-asterisk">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="time"
                    name="end_time"
                    value={form.end_time}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                  <span className="input-icon">
                    <FiWatch />
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isCreating}
              className={`submit-button ${isFormValid ? "active" : "disabled"}`}
            >
              {isCreating ? (
                <span className="button-loader"></span>
              ) : (
                "Create Shift"
              )}
            </button>
          </form>
        </section>

        {/* Shift List Section */}
        <section className="shift-list-section glass-panel">
          <h2 className="section-title">
            <FiClock /> Current Shifts
          </h2>

          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading shifts...</p>
            </div>
          ) : shiftData?.data?.length === 0 ? (
            <div className="empty-state">
              <FiClock size={48} />
              <p>No shifts created yet</p>
            </div>
          ) : (
            <div className="shift-cards-grid">
              {shiftData?.data?.map((shift) => (
                <div key={shift.id} className="shift-card">
                  <div className="shift-time-indicator"></div>
                  <div className="shift-content">
                    <h3 className="shift-name">{shift.shift_name}</h3>
                    <div className="shift-time">
                      <span className="time-badge start-time">
                        {shift.start_time}
                      </span>
                      <span className="time-separator">→</span>
                      <span className="time-badge end-time">
                        {shift.end_time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Page;