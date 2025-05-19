import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useFetchEmployesQuery, useDeleteEmployeMutation } from '@/slices/employe/employe';
import 'react-toastify/dist/ReactToastify.css';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { useCompany } from '@/utils/Company';

const UserList: React.FC = () => {
  const router = useRouter();
  const { data: employeesData, error, isLoading } = useFetchEmployesQuery();
  const { companySlug } = useCompany();

  const [deleteEmployee] = useDeleteEmployeMutation();
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
    { label: 'Status', key: 'user_status' as keyof Employee },
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
