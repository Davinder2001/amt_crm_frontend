'use client';
import { useFetchEmployeesQuery } from '@/slices/employe/employeApi';
import { useCompany } from '@/utils/Company';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaPlusCircle } from 'react-icons/fa';

const Employees = () => {
    const { data: employeesData } = useFetchEmployeesQuery({});
    const router = useRouter();
    const { companySlug } = useCompany();

    // Safely get the employee list from API data
    const employeeList = employeesData?.employees || [];

    return (
        <div className="card employees">
            <div className="card-header">
                <h3>Employee</h3>
                <button className="add-btn" onClick={() => router.push(`/${companySlug}/hr/add-employee`)}><FaPlusCircle size={16} color='var(--primary-color)' /></button>
            </div>
            <ul className="employee-list">
                {employeeList.slice(0, 5).map((emp: Employee, i: number) => (
                    <li key={i} className="employee-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="avatar">
                                {emp.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div>
                                <div className="name">{emp.name}</div>
                                <div className="role">{emp.roles?.[0]?.name || 'Employee'}</div>
                            </div>
                        </div>
                        <button className="menu-btn">⋮</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Employees;
