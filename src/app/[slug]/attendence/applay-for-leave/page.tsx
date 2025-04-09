'use client'
import React, { useEffect } from 'react';
import { useApplyForLeaveMutation } from '@/slices/attendance/attendance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { useCompany } from '@/utils/Company';

const Page = () => {
  const [applyForLeave, { isLoading, isSuccess, isError }] = useApplyForLeaveMutation();
  const { companySlug } = useCompany();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Leave applied successfully!");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error("Error applying leave");
    }
  }, [isError]);

  const handleApplyLeave = async () => {
    try {
      const response = await applyForLeave().unwrap();
      console.log('Leave applied successfully:', response);
    } catch (err) {
      console.error('Error applying leave:', err);
    }
  };

  return (
    <>
      <Link href={`/${companySlug}/attendence`} className='back-button'><FaArrowLeft size={20} color='#fff' /></Link>
      <div>
        <h1>Apply for Leave</h1>
        <button onClick={handleApplyLeave} disabled={isLoading}>
          {isLoading ? 'Applying...' : 'Apply for Leave'}
        </button>
        <ToastContainer />
      </div>
    </>
  );
};

export default Page;
