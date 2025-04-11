"use client";

import React, { useState } from "react";
import {
  useCreateShiftMutation,
  useFetchCompanyShiftsQuery,
} from "@/slices/company/companyApi";
import { toast } from "react-toastify";

const Page = () => {
  const { data: shiftData, isLoading, refetch } = useFetchCompanyShiftsQuery();
  const [createShift, { isLoading: isCreating }] = useCreateShiftMutation();

  const [form, setForm] = useState({
    shift_name: "",
    start_time: "",
    end_time: "",
  });

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
      refetch(); // refresh shift list
    } catch (err) {
      console.error(err);
      toast.error("Failed to create shift");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Shift</h1>

      <form onSubmit={handleCreate} className="space-y-4 mb-10">
        <div>
          <label className="block font-medium">Shift Name</label>
          <input
            type="text"
            name="shift_name"
            value={form.shift_name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Start Time</label>
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">End Time</label>
          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Shift"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">All Shifts</h2>
      {isLoading ? (
        <p>Loading shifts...</p>
      ) : (
        <ul className="space-y-2">
          {shiftData?.data?.map((shift) => (
            <li
              key={shift.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <strong>{shift.shift_name}</strong> <br />
                {shift.start_time} - {shift.end_time}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
