'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFetchEmployeByIdQuery, useDeleteEmployeMutation } from '@/slices/employe/employeApi';
import Image from 'next/image';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { useCompany } from '@/utils/Company';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { FaBriefcase, FaCreditCard, FaEdit, FaIdCard, FaMoneyBillWave, FaPlus, FaTrash, FaUser, FaUserCheck } from 'react-icons/fa';
import TableToolbar from '@/components/common/TableToolbar';
import LoadingState from '@/components/common/LoadingState';

const ViewUserPage: React.FC = () => {
  const { setTitle } = useBreadcrumb();
  const [deleteEmployee] = useDeleteEmployeMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const { companySlug } = useCompany();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    setTitle('Employee Profile');
  }, [setTitle]);

  const { id } = useParams() as { id: string };
  const {
    data,
    error: usersError,
    isLoading: usersLoading,
  } = useFetchEmployeByIdQuery(Number(id));

  const user = data;
  const employee = user?.employee;
  const details = user?.employee.employee_details;

  useEffect(() => {
    if (usersError) toast.error('Failed to fetch user data');
  }, [usersError]);

  if (usersLoading) return <LoadingState />;
  if (!employee) return <div className="not-found">User not found</div>;

  const firstLetter = employee?.name?.[0]?.toUpperCase();

  const handleDelete = async () => {
    try {
      await deleteEmployee(Number(id)).unwrap();
      setShowConfirm(false);
      router.push(`/${companySlug}/hr`);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const formatDate = (date: string | null | undefined) =>
    date ? new Date(date).toLocaleDateString('en-IN') : 'N/A';

  return (
    <div className="employee-profile-container">
      <div className='employee-profile-nav'>
        <TableToolbar
          actions={[
            {
              label: 'Add Employee',
              icon: <FaPlus />,
              onClick: () => router.push(`/${companySlug}/hr/add-employee`),
            },
            {
              label: 'Status View',
              icon: <FaUserCheck />,
              onClick: () => router.push(`/${companySlug}/hr/status-view`),
            },
            {
              label: 'Employee Salary',
              icon: <FaMoneyBillWave />,
              onClick: () => router.push(`/${companySlug}/hr/employee-salary`),
            }
          ]}
          introKey='view_emp_intro'
        />
      </div>
      <div className="employee-profile-inner-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {employee.profilePicture ? (
              <Image
                src={employee.profilePicture}
                alt={employee.name}
                className="avatar-image"
                width={120}
                height={120}
                priority
              />
            ) : (
              <div className="avatar-initial">{firstLetter}</div>
            )}
          </div>

          <div className="profile-header-content">
            <div className="profile-title">
              <h1>{employee.name}</h1>
              <div className="profile-meta">
                <span className="badge role employ-view-role">{employee.roles?.[0]?.name || 'N/A'}</span>
                <span className="badge status">{employee.user_status}</span>
              </div>
            </div>
            <div className="profile-actions">
              {/* Desktop Buttons */}
              <div className="action-buttons desktop-only">
                <button
                  onClick={() => router.push(`/${companySlug}/hr/status-view/edit-employee/${id}`)}
                  className="btn primary" type='button'
                >
                  <FaEdit />Edit Profile
                </button>
                <button onClick={() => setShowConfirm(true)} className="btn danger" type='button'>
                  <FaTrash /> Delete Profile
                </button>
              </div>

              {/* Mobile Menu */}
              <div className="mobile-menu mobile-only" ref={menuRef}>
                <button className="dots-button" onClick={() => setMenuOpen(!menuOpen)} type='button'>
                  ⋮
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        router.push(`/${companySlug}/hr/status-view/edit-employee/${id}`);
                      }}
                      className='dropdown-edit-btn' type='button'
                    >
                      <FaEdit /> Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowConfirm(true);
                      }}
                      className='dropdown-delete-btn' type='button'
                    >
                      <FaTrash /> Delete Profile
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        <div className="profile-grid">
          {/* Basic Info */}
          <div className="profile-card basic-info">
            <span className="card-title"><i className="icon-user"><FaUser className="card-title-icon" /></i> <h4>Basic Information</h4> </span>
            <div className="info-grid">
              <div className="info-item"><span className="info-label">Employee ID</span><span className="info-value">{employee.id}</span></div>
              <div className="info-item"><span className="info-label">Company</span><span className="info-value">{employee.company_name || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Mobile</span><span className="info-value">{employee.number || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Email</span><span className="info-value">{employee.email}</span></div>
              <div className="info-item"><span className="info-label">Birth Date</span><span className="info-value">{formatDate(details?.dob)}</span></div>
              <div className="info-item"><span className="info-label">Cispanty</span><span className="info-value">{details?.address || 'N/A'}</span></div>
            </div>
          </div>

          {/* Employment Info */}
          <div className="profile-card employment-info">
            <span className="card-title"><i className="icon-briefcase"><FaBriefcase className="card-title-icon" /></i> <h4>Employment Details</h4></span>
            <div className="info-grid">
              <div className="info-item"><span className="info-label">Department</span><span className="info-value">{details?.department || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Work Location</span><span className="info-value">{details?.workLocation || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Joining Date</span><span className="info-value">{formatDate(details?.joiningDate)}</span></div>
              <div className="info-item"><span className="info-label">Joining Type</span><span className="info-value">{details?.joiningType || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Current Salary</span><span className="info-value">₹{details?.currentSalary || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Salary</span><span className="info-value">₹{details?.salary || 'N/A'}</span></div>
              {details?.shiftTimings && (
                <div className="info-item"><span className="info-label">Shift Timings</span><span className="info-value">{details.shiftTimings}</span></div>
              )}
              {details?.previousEmployer && (
                <div className="info-item"><span className="info-label">Previous Employer</span><span className="info-value">{details.previousEmployer}</span></div>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div className="profile-card personal-info">
            <span className="card-title"><i className="icon-id-card"><FaIdCard className="card-title-icon" /></i>  <h4>Personal Information</h4></span>
            <div className="info-grid">
              <div className="info-item"><span className="info-label">Nationality</span><span className="info-value">{details?.nationality || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Religion</span><span className="info-value">{details?.religion || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Marital Status</span><span className="info-value">{details?.maritalStatus || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Emergency Contact</span><span className="info-value">{details?.emergencyContact || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Emergency Relation</span><span className="info-value">{details?.emergencyContactRelation || 'N/A'}</span></div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="profile-card financial-info">
            <span className="card-title"><i className="icon-credit-card"><FaCreditCard className="card-title-icon" /></i> <h4>Financial Information</h4></span>
            <div className="info-grid">
              <div className="info-item"><span className="info-label">Bank Name</span><span className="info-value">{details?.bankName || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Account No</span><span className="info-value">{details?.accountNo || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">IFSC Code</span><span className="info-value">{details?.ifscCode || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Pan No</span><span className="info-value">{details?.panNo || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">UPI Id</span><span className="info-value">{details?.upiId || 'N/A'}</span></div>
              <div className="info-item"><span className="info-label">Address Proof</span><span className="info-value">{details?.addressProof || 'N/A'}</span></div>
            </div>
          </div>
        </div>

        <ConfirmDialog
          isOpen={showConfirm}
          message="Are you sure you want to delete this employee profile? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          type="delete"
        />
      </div>
    </div>
  );
};

export default ViewUserPage;
