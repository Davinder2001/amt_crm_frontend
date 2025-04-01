'use client'
import React, { useEffect } from 'react';
import { useApplyForLeaveMutation } from '@/slices/attendance/attendance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
  const [applyForLeave, { isLoading, isSuccess, isError }] = useApplyForLeaveMutation();

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
    <div>
      <h1>Apply for Leave</h1>
      <button onClick={handleApplyLeave} disabled={isLoading}>
        {isLoading ? 'Applying...' : 'Apply for Leave'}
      </button>
      <ToastContainer />
    </div>
  );
};

export default Page;
