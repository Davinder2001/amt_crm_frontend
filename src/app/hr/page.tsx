'use client';

import { useFetchEmployesQuery } from '@/slices/employe/employe';
import React from 'react';


interface Employee {
  id: number;
  name: string;
  position: string;
}

const Page = () => {

  const { data: employeesData, error: employeesError, isLoading: employeesLoading } = useFetchEmployesQuery();

  const employees: Employee[] = Array.isArray(employeesData) 
    ? employeesData 
    : employeesData?.employees ?? [];

  return (
    <div>
      <h1>Employees List</h1>
      {!employeesLoading && !employeesError && employees.length > 0 ? (
        <ul>
          {employees.map((employee) => (
            <li key={employee.id}>
              {employee.name} - {employee.position}
            </li>
          ))}
        </ul>
      ) : (
        !employeesLoading && !employeesError && <p>No employees found.</p>
      )}
    </div>
  );
};

export default Page;
