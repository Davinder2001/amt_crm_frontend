'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useFetchEmployesQuery, useDeleteEmployeMutation } from '@/slices/employe/employeApi';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const UserList: React.FC = () => {
  const router = useRouter();
  const { data: employeesData, error, isLoading } = useFetchEmployesQuery();

  console.log('employeesData', employeesData);
  
  const [deleteEmployee] = useDeleteEmployeMutation();

  // Use type assertion for employeesData
  const employees: Employee[] = employeesData?.employees ?? [];

  if (isLoading) return <p>Loading employees...</p>;
  if (error) return <p>Error fetching employees.</p>;
  if (employees.length === 0) return <p>No employees found.</p>;

  const update = (employee: Employee) => {
    if (!employee.company_slug) {
      toast.error('Company slug not found for employee');
      return;
    }
    router.push(`/${employee.company_slug}/employee/hr/status-view/edit-employee/${employee.id}`);
  };

  const view = (employee: Employee) => {
    if (!employee.company_slug) {
      toast.error('Company slug not found for employee');
      return;
    }
    router.push(`/${employee.company_slug}/employee/hr/status-view/view-employee/${employee.id}`);
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
    <div className="user-list-container">
      <table className="user-table">
        <thead className="user-thead">
          <tr className="user-tr">
            <th className="user-th">Sr. No</th>
            <th className="user-th">Name</th>
            <th className="user-th">Email</th>
            <th className="user-th">Roles</th>
            <th className="user-th">Phone Number</th>
            <th className="user-th">Company</th>
            <th className="user-th">Status</th>
            <th className="user-th">Action</th>
          </tr>
        </thead>
        <tbody className="user-tbody">
          {employees.map((employee, index) => (
            <tr key={employee.id} className="user-tr">
              <td className="user-td">{index + 1}</td>
              <td className="user-td">{employee.name}</td>
              <td className="user-td">{employee.email}</td>
              <td className="user-td">
                {employee.roles?.length ? 
                  employee.roles.map((role) => capitalize(role.name)).join(', ') : 
                  'N/A'
                }
              </td>
              <td className="user-td">{employee.number}</td>
              <td className="user-td">{employee.company_name}</td>
              <td className="user-td">{employee.user_status}</td>
              <td className="user-td">
                <div  className='store-t-e-e-icons'>
                <span onClick={() => handleDelete(employee.id)} className="user-btn"><FaTrash color='#222' /></span>
              <span onClick={() => update(employee)} className="user-btn"><FaEdit color='#222' /></span>
                <span onClick={() => view(employee)} className="user-btn"><FaEye color='#222' /></span>
                </div>
                                                      


              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
