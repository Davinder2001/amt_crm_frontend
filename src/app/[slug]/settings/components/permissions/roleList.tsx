  "use client";

  import React, { useState } from "react";
  import { toast } from "react-toastify";
  import { useGetRolesQuery, useDeleteRoleMutation } from "@/slices/roles/rolesApi";
  import {  FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
  import ResponsiveTable from "@/components/common/ResponsiveTable";
  import Loader from "@/components/common/Loader";
  import RoleForm from "./RoleForm";
  import Modal from "@/components/common/Modal";
  import ViewRole from "./ViewRole";

  const RoleList: React.FC = () => {
    const { data: rolesData, isLoading, error } = useGetRolesQuery(undefined);
    const [deleteRole] = useDeleteRoleMutation();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

    const handleDeleteRole = async (id: number) => {
      if (!window.confirm("Are you sure you want to delete this role?")) return;
      try {
        await deleteRole(id).unwrap();
        toast.success("Role deleted successfully");
      } catch (err: unknown) {
        if (err && typeof err === "object" && "data" in err) {
          const error = err as { data: { message: string } };
          toast.error(error?.data?.message || "Error deleting role");
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    };

    if (isLoading) return <Loader />;
    if (error) {
      toast.error("Error loading roles");
      return <div>Error loading roles.</div>;
    }

    const columns = [
      { label: "Role Name", key: "name" as keyof Role },
      {
        label: "Permissions",
        render: (role: Role) =>
          role.permissions?.length
            ? role.permissions.map((perm) => perm.name).join(", ")
            : "None",
      },
      { label: "Company ID", key: "company_id" as keyof Role },
      {
        label: "Actions",
        render: (role: Role) => (
          <div className="action-buttons">
            <FaEye onClick={() => {
              setSelectedRoleId(role.id);
              setIsViewModalOpen(true);
            }} color="#384b70" />

            <FaEdit onClick={() => {
              setSelectedRoleId(role.id);
              setIsEditModalOpen(true);
            }} color="#384b70" />

            <FaTrash onClick={() => handleDeleteRole(role.id)} color="#ff0000" />
          </div>
        ),
      },
    ];

    return (
      <div className="permissions-form-outer">
        <div className="navigation-buttons roll-list-navigation-btn">
          <button className="buttons" onClick={() => setIsAddModalOpen(true)}>
            <FaPlus /> Add Role
          </button>
        </div>

        <ResponsiveTable
          data={rolesData?.roles || []}
          columns={columns}
          onDelete={(id) => handleDeleteRole(id)}
          cardViewKey="name"
        />


        {/* Add Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Role"
          width="700px"
        >
          <RoleForm
            mode="add"
            onSuccess={() => {
              setIsAddModalOpen(false);
              // Optionally refetch roles
            }}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedRoleId(null);
          }}
          title="Edit Role"
          width="700px"
        >
          {selectedRoleId && (
            <RoleForm
              mode="edit"
              roleId={selectedRoleId}
              onSuccess={() => {
                setIsEditModalOpen(false);
                setSelectedRoleId(null);
                // Optionally refetch roles
              }}
            />
          )}
        </Modal>

        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedRoleId(null);
          }}
          title="View Role"
          width="600px"
        >
          {selectedRoleId !== null && <ViewRole roleId={selectedRoleId} />}
        </Modal>

      </div>
    );
  };

  export default RoleList;
