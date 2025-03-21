'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useFetchEmployesQuery, useDeleteEmployeMutation } from '@/slices/employe/employe';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchSelectedCompanyQuery } from '@/slices/auth/authApi';

const UserList: React.FC = () => {
  const router = useRouter();
  const { data: employeesData, error, isLoading } = useFetchEmployesQuery();

  console.log('employeesData', employeesData)
  
  const [deleteEmployee] = useDeleteEmployeMutation();
  const {currentData} = useFetchSelectedCompanyQuery();

  // Use type assertion for employeesData
  const employees: Employee[] = employeesData?.employees ?? [];

  if (isLoading) return <p>Loading employees...</p>;
  if (error) return <p>Error fetching employees.</p>;
  if (employees.length === 0) return <p>No employees found.</p>;

  const update = (employee: Employee) => {
    if (!currentData?.selected_company.company_slug) {
      toast.error('Company slug not found for employee');
      return;
    }
    router.push(`/${currentData?.selected_company.company_slug}/hr/status-view/edit-employee/${employee.id}`);
  };

  const view = (employee: Employee) => {
    if (!currentData?.selected_company.company_slug) {
      toast.error('Company slug not found for employee');
      return;
    }
    router.push(`/${currentData?.selected_company.company_slug}/hr/status-view/view-employee/${employee.id}`);
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await deleteEmployee(id).unwrap();
      toast.success('Employee deleted successfully!');
    } catch (err: unknown) {
      // Handle error with type narrowing
      if (err && typeof err === 'object' && 'data' in err) {
        const error = err as { data: { message: string } };
        toast.error(error?.data?.message || 'Failed to delete employee.');
      } else {
        toast.error('Failed to delete employee. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Employees List</h2>
      <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '4px' }}>Sr. No</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Name</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Email</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Roles</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Phone Number</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Company</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Status</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.id}>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {index + 1}
              </td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{employee.name}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{employee.email}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                {employee.roles?.length ? 
                  employee.roles.map((role) => capitalize(role.name)).join(', ') : 
                  'N/A'
                }
              </td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{employee.number}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{employee.company_name}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>{employee.user_status}</td>
              <td style={{ border: '1px solid black', padding: '4px' }}>
                <button onClick={() => view(employee)}>View</button>&nbsp;
                <button onClick={() => update(employee)}>Edit</button>&nbsp;
                <button onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
