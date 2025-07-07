"use client";

import React, { useState } from "react";
import { useGetRolesQuery, useDeleteRoleMutation } from "@/slices";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import RoleForm from "./RoleForm";
import Modal from "@/components/common/Modal";
import ViewRole from "./ViewRole";
import ConfirmDialog from '@/components/common/ConfirmDialog';
import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";
import ResponsiveTable from "@/components/common/ResponsiveTable";

const RoleList: React.FC = () => {
  const { data: rolesData, isLoading, error } = useGetRolesQuery(undefined);
  const [deleteRole] = useDeleteRoleMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const handleDeleteRole = (id: number) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete !== null) {
      try {
        await deleteRole(itemToDelete).unwrap();
      } catch (error) {
        console.error("Failed to delete this Role:", error);
      } finally {
        setShowDeleteConfirm(false);
        setItemToDelete(null);
      }
    }
  };

  if (isLoading) return <LoadingState />;
  if (error)
    return (
      <EmptyState
        icon="alert"
        title="Failed to fetching roles data."
        message="Something went wrong while fetching roles data."
      />
    );
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
          }} color="var(--primary-color)" />

          {role.name !== "admin" ?
            <>
              <FaEdit onClick={() => {
                setSelectedRoleId(role.id);
                setIsEditModalOpen(true);
              }} color="var(--primary-color)" />
              <FaTrash onClick={() => handleDeleteRole(role.id)} color="#ff0000" />
            </>
            : ''
          }
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
        cardView={(role) => (
          <>
            <div className="card-row">
              <h5>{role.name}</h5>
              {role.company_id && (
                <p className="company-id">Company ID: {role.company_id}</p>
              )}
            </div>
            <div className="card-row">
              <p className="role-permissions">
                {role.permissions?.length
                  ? role.permissions.map((perm) => perm.name).join(", ")
                  : "No permissions"}
              </p>
            </div>
          </>
        )}
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
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        message="Are you sure you want to delete this Role ?"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
        }}
        type="delete"
      />
    </div>
  );
};

export default RoleList;
