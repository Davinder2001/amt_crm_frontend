import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useFetchEmployesQuery, useDeleteEmployeMutation, useUpdateEmployeeStatusMutation } from '@/slices/employe/employe';
import 'react-toastify/dist/ReactToastify.css';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { useCompany } from '@/utils/Company';

const UserList: React.FC = () => {
  const router = useRouter();
  const { data: employeesData, error, isLoading } = useFetchEmployesQuery();
  const { companySlug } = useCompany();

  const [deleteEmployee] = useDeleteEmployeMutation();
  const [updateStatus] = useUpdateEmployeeStatusMutation();
  const employees: Employee[] = employeesData?.employees ?? [];

  if (isLoading) return <p>Loading employees...</p>;
  if (error) return <p>Error fetching employees.</p>;
  if (employees.length === 0) return <p>No employees found.</p>;

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await deleteEmployee(id).unwrap();
      toast.success('Employee deleted successfully!');
    } catch {
      toast.error('Failed to delete employee. Please try again.');
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

        // Dynamic class based on status
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
    }


    // {
    //   label: 'Action',
    //   render: (emp: Employee) => (
    //     <div className="store-t-e-e-icons">
    //       <span onClick={() => handleDelete(emp.id)}><FaTrash /></span>
    //       <span onClick={() => update(emp)}><FaEdit /></span>
    //       <span onClick={() => view(emp)}><FaEye /></span>
    //     </div>
    //   ),
    // },
  ];

  return <ResponsiveTable data={employees} columns={columns}
    onDelete={(id) => handleDelete(id)}
    onEdit={(id) => router.push(`/${companySlug}/hr/status-view/edit-employee/${id}`)}
    onView={(id) => router.push(`/${companySlug}/hr/status-view/view-employee/${id}`)} />;
};

export default UserList;
