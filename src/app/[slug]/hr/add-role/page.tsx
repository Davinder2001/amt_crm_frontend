"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useCreateRoleMutation } from "@/slices/roles/rolesApi";

interface Permission {
  id: number;
  name: string;
}

// Manually defined available permissions.
const availablePermissions: Permission[] = [
  { id: 1, name: "create articles" },
  { id: 2, name: "edit articles" },
  { id: 3, name: "delete articles" },
];

const Page: React.FC = () => {
  const [createRole, { isLoading }] = useCreateRoleMutation();

  // State for new role inputs.
  const [newRoleName, setNewRoleName] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Handle creating a new role.
  const handleCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newRoleName.trim() === "") {
      toast.error("Role name is required");
      return;
    }

    try {
      await createRole({
        name: newRoleName,
        permissions: selectedPermissions,
      }).unwrap();

      toast.success("Role created successfully");
      setNewRoleName(""); // Reset role name input
      setSelectedPermissions([]); // Reset permissions selection
    } catch (err: any) {
      console.error("Error creating role:", err);
      toast.error(err?.data?.message || "Error creating role");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Create a Role</h2>
      <form onSubmit={handleCreateRole}>
        {/* Role Name Input */}
        <label className="block mb-2 font-medium">Role Name:</label>
        <input
          type="text"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          placeholder="Enter role name"
          className="w-full p-2 mb-3 border rounded-md"
          required
        />

        {/* Permissions Selection */}
        <label className="block mb-2 font-medium">Select Permissions:</label>
        <div className="mb-4">
          {availablePermissions.map((perm) => (
            <label key={perm.id} className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                value={perm.name}
                checked={selectedPermissions.includes(perm.name)}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedPermissions((prev) =>
                    prev.includes(value)
                      ? prev.filter((p) => p !== value)
                      : [...prev, value]
                  );
                }}
              />
              <span>{perm.name}</span>
            </label>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Role"}
        </button>
      </form>
    </div>
  );
};

export default Page;
