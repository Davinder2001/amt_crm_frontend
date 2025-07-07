import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useFetchEmployesQuery, useDeleteEmployeMutation, useUpdateEmployeeStatusMutation } from '@/slices/employe/employe';
import 'react-toastify/dist/ReactToastify.css';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { useCompany } from '@/utils/Company';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const UserList: React.FC = () => {
  const router = useRouter();
  const { data: employeesData, error, isLoading, refetch } = useFetchEmployesQuery();
  const { companySlug } = useCompany();

  const [deleteEmployee] = useDeleteEmployeMutation();
  const [updateStatus] = useUpdateEmployeeStatusMutation();
  const employees: Employee[] = employeesData?.employees ?? [];

  // Delete state
  const [deleteState, setDeleteState] = useState<{
    id: number | null;
    name: string;
    showDialog: boolean;
  }>({
    id: null,
    name: "",
    showDialog: false
  });

  if (isLoading) return <LoadingState />;
  if (error) {
    return (
      <EmptyState
        icon="alert"
        title="Failed to fetching employees."
        message="Something went wrong while fetching employees."
      />
    );
  }
  if (employees.length === 0) return <p>No employees found.</p>;

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const promptDelete = (id: number, name: string) => {
    setDeleteState({
      id,
      name,
      showDialog: true
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id).unwrap();
      toast.success('Employee deleted successfully!');
      refetch();
    } catch (err) {
      toast.error('Failed to delete employee. Please try again.');
      console.error('Delete employee error:', err);
    }
  };

  const confirmDelete = async () => {
    if (deleteState.id) {
      await handleDelete(deleteState.id);
      setDeleteState({
        id: null,
        name: "",
        showDialog: false
      });
    }
  };

  const columns = [
    { label: 'Name', key: 'name' as keyof Employee },
    { label: 'Email', key: 'email' as keyof Employee },
    {
      label: 'Roles',
      render: (emp: Employee) => emp.roles?.map((r) => capitalize(r.name)).join(', ') || 'N/A',
    },
    { label: 'Phone Number', key: 'number' as keyof Employee },
    { label: 'Company', key: 'company_name' as keyof Employee },
    {
      label: 'Status',
      render: (emp: Employee) => {
        const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
          const newStatus = e.target.value as "active" | "inactive" | "blocked";
          try {
            await updateStatus({ id: String(emp.id), status: newStatus }).unwrap();
            toast.success(`Status updated to ${newStatus}`);
          } catch {
            toast.error('Failed to update status.');
          }
        };

        const getStatusClass = (status: string) => {
          switch (status) {
            case "active":
              return "status-green";
            case "inactive":
              return "status-orange";
            case "blocked":
              return "status-red";
            default:
              return "";
          }
        };

        return (
          <select
            value={emp.user_status}
            onChange={handleChange}
            className={`status-select ${getStatusClass(emp.user_status)}`}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
        );
      },
    },
    {
      label: 'Actions',
      render: (emp: Employee) => (
        <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
          <FaEye onClick={() => router.push(`/${companySlug}/hr/status-view/view-employee/${emp.id}`)} />
          <FaEdit onClick={() => router.push(`/${companySlug}/hr/status-view/edit-employee/${emp.id}`)} />
          <FaTrash onClick={() => promptDelete(emp.id, emp.name)} />
        </div>
      ),
    }
  ];

  return (
    <>
      <ResponsiveTable
        data={employees}
        columns={columns}
        onDelete={handleDelete}
        onEdit={(id) => router.push(`/${companySlug}/hr/status-view/edit-employee/${id}`)}
        onView={(id) => router.push(`/${companySlug}/hr/status-view/view-employee/${id}`)}
        cardView={(employee: Employee) => (
          <>
            <div className="card-row">
              <h5>{employee.name}</h5>
              <p>{employee.number}</p>
            </div>
            <div className="card-row">
              <p>{employee.email}</p>
              <p>Status: {employee.user_status}</p>
            </div>
            <div className="card-row">
              <p>Company: {employee.company_name}</p>
            </div>
          </>
        )}
      />

      <ConfirmDialog
        isOpen={deleteState.showDialog}
        message={`Are you sure you want to delete the employee "${deleteState.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteState({
          id: null,
          name: "",
          showDialog: false
        })}
        type="delete"
      />
    </>
  );
};

export default UserList;