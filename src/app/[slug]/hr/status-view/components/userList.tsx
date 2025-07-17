import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useFetchEmployeesQuery, useDeleteEmployeMutation, useUpdateEmployeeStatusMutation } from '@/slices/employe/employeApi';
import 'react-toastify/dist/ReactToastify.css';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { EMPLOYEES_COUNT, useCompany } from '@/utils/Company';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { FaEdit, FaTrash, FaEye, FaPlus, FaUserPlus } from 'react-icons/fa';
import TableToolbar from '@/components/common/TableToolbar';

const COLUMN_STORAGE_KEY = 'visible_columns_employees';

const UserList: React.FC = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(EMPLOYEES_COUNT);
  const { data, error, isLoading, refetch } = useFetchEmployeesQuery({
    page: currentPage,
    per_page: itemsPerPage,
  });

  const employees = data?.employees ?? [];
  const pagination = data?.pagination;
  const { companySlug } = useCompany();

  // Filter state
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
    return saved ? JSON.parse(saved) : ['name', 'email', 'roles', 'number', 'status'];
  });

  // Define all possible columns
  const allColumns = [
    { label: 'Name', key: 'name' as string },
    { label: 'Email', key: 'email' as string },
    { label: 'Roles', key: 'roles' as string },
    { label: 'Phone Number', key: 'number' as string },
    { label: 'Company', key: 'company_name' as string },
    { label: 'Status', key: 'status' as string },
  ];

  // Define available filters
  const tableFilters = [
    {
      key: 'search',
      label: 'Search',
      type: 'search' as const
    },
    {
      key: 'user_status',
      label: 'Status',
      type: 'multi-select' as const,
      options: ['active', 'inactive', 'blocked']
    }
  ];

  // Column visibility handlers
  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const updated = prev.includes(key)
        ? prev.filter((col) => col !== key)
        : [...prev, key];
      localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const onResetColumns = () => {
    const defaultColumns = ['name', 'email', 'roles', 'number', 'status'];
    setVisibleColumns(defaultColumns);
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(defaultColumns));
  };

  // Filter the data based on active filters
  const filterData = (data: Employee[]): Employee[] => {
    return data.filter((employee) => {
      if (filters.search && filters.search.length > 0) {
        const searchTerm = filters.search[0].toLowerCase();
        const visibleFields = allColumns
          .filter(col => visibleColumns.includes(col.key))
          .map(col => col.key);

        const matchesSearch = visibleFields.some(key => {
          const value = String(employee[key as keyof Employee] ?? '').toLowerCase();
          return value.includes(searchTerm);
        });

        if (!matchesSearch) return false;
      }

      return Object.entries(filters)
        .filter(([field]) => field !== 'search')
        .every(([field, values]) => {
          if (!values || values.length === 0) return true;

          // Handle special cases for nested fields
          if (field === 'roles') {
            const employeeRoles = employee.roles?.map(r => r.name.toLowerCase()) || [];
            return values.some(v => employeeRoles.includes(v.toLowerCase()));
          }

          const employeeValue = String(employee[field as keyof Employee] ?? '').toLowerCase();
          const normalizedValues = values.map(v => v.toLowerCase());

          return normalizedValues.includes(employeeValue);
        });
    });
  };

  const filteredEmployees = filterData(employees);

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(1);
  };

  // Employee CRUD operations
  const [deleteEmployee] = useDeleteEmployeMutation();
  const [updateStatus] = useUpdateEmployeeStatusMutation();

  const [deleteState, setDeleteState] = useState<{
    id: number | null;
    name: string;
    showDialog: boolean;
  }>({
    id: null,
    name: "",
    showDialog: false
  });

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

  // Define table columns with visibility control
  const columns = [
    ...allColumns
      .filter(col => visibleColumns.includes(col.key))
      .map(col => {
        if (col.key === 'roles') {
          return {
            label: col.label,
            render: (emp: Employee) => emp.roles?.map((r) => capitalize(r.name)).join(', ') || 'N/A',
          };
        }
        if (col.key === 'status') {
          return {
            label: col.label,
            render: (emp: Employee) => {
              const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
                const newStatus = e.target.value as "active" | "inactive" | "blocked";
                try {
                  await updateStatus({ id: String(emp.id), status: newStatus }).unwrap();
                  toast.success(`Status updated to ${newStatus}`);
                  refetch();
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
          };
        }
        return {
          label: col.label,
          key: col.key as keyof Employee,
        };
      }),
    {
      label: 'Actions',
      render: (emp: Employee) => (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <FaEye onClick={() => router.push(`/${companySlug}/hr/status-view/view-employee/${emp.id}`)} />
          <FaEdit onClick={() => router.push(`/${companySlug}/hr/status-view/edit-employee/${emp.id}`)} />
          <FaTrash onClick={() => promptDelete(emp.id, emp.name)} />
        </div>
      ),
    }
  ];

  if (isLoading) return <LoadingState />;
  if (error) {
    return (
      <EmptyState
        icon="alert"
        title="Failed to fetch employees"
        message="Something went wrong while fetching employees."
      />
    );
  }

  return (
    <>
      <TableToolbar
        filters={tableFilters}
        onFilterChange={(field, value, type) => {
          if (type === 'search') {
            setFilters(prev => ({
              ...prev,
              [field]: value && typeof value === 'string' ? [value] : []
            }));
          } else {
            setFilters(prev => ({
              ...prev,
              [field]: Array.isArray(value) ? value : [value]
            }));
          }
        }}
        columns={allColumns}
        visibleColumns={visibleColumns}
        onColumnToggle={toggleColumn}
        onResetColumns={onResetColumns}
        introKey="employees_intro"
        actions={[
          ...(employees.length > 0
            ? [{
              label: 'Add Employee',
              icon: <FaUserPlus />,
              onClick: () => router.push(`/${companySlug}/hr/add-employee`),
            }]
            : []),
        ]}
      />

      {employees.length > 0 ? (
        <ResponsiveTable
          data={filteredEmployees}
          columns={columns}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          counts={EMPLOYEES_COUNT}
          onDelete={(id) => {
            const employee = employees.find(e => e.id === id);
            if (employee) promptDelete(id, employee.name);
          }}
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
      ) : (
        <EmptyState
          icon={<FaUserPlus className="empty-state-icon" />}
          title="No employees found"
          message="You haven't added any employees yet. Get started by adding your first team member."
          action={
            <button
              className="buttons"
              onClick={() => router.push(`/${companySlug}/hr/add-employee`)}
            >
              <FaPlus size={18} /> Add New Employee
            </button>
          }
        />
      )}

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