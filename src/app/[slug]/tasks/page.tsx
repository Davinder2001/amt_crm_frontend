
'use client';
import React, { useState } from 'react';
import AllTasks from './components/allTasks';
import MyTasks from './components/myTasks';
import TableToolbar from '@/components/common/TableToolbar';
import { FaPlus, FaUserCheck, FaRedo, FaList, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { TASKS_COUNT, useCompany } from '@/utils/Company';
import { Box } from '@mui/material';
import { useGetMyTasksQuery, useGetTasksQuery } from '@/slices';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import { FaTriangleExclamation } from 'react-icons/fa6';

const Page = () => {
  const router = useRouter();
  const { companySlug } = useCompany();
  const { data: myTasks } = useGetMyTasksQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(TASKS_COUNT);
  const { data, error: tasksError, isLoading: tasksLoading, refetch } = useGetTasksQuery({
    page: currentPage,
    per_page: itemsPerPage,
  });
  const pagination = data?.pagination;

  // Add these handler functions
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setItemsPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);

  const handleTabChange = (tab: 'all' | 'my') => {
    setActiveTab(tab);
  };


  if (tasksLoading) return <LoadingState />;
  if (tasksError) return (
    <EmptyState
      icon={<FaTriangleExclamation className='empty-state-icon' />}
      title="Failed to load tasks"
      message="We encountered an error while loading tasks. Please try again later."
    />
  );

  const noTasks = !tasksLoading && !tasksError && (!data?.tasks || data.tasks.length === 0);

  return (
    <>
      <TableToolbar
        actions={[
          {
            label: 'All Tasks',
            icon: <FaList />,
            onClick: () => handleTabChange('all'),
          },
          {
            label: `My Tasks (${myTasks?.tasks?.length || 0})`,
            icon: <FaUser />,
            onClick: () => handleTabChange('my'),
          },
          {
            label: 'Attendance',
            icon: <FaUserCheck />,
            onClick: () => router.push(`/${companySlug}/attendance`),
          },
          {
            label: 'Recurring Tasks',
            icon: <FaRedo />,
            onClick: () => router.push(`/${companySlug}/tasks/recurring-tasks`),
          },
          ...(data && data?.tasks.length > 0
            ? [{ label: 'Add Task', icon: <FaPlus />, onClick: () => setIsAddModalOpen(true) }]
            : []),
        ]}
        introKey='tasks_intro'
      />

      <Box>
        {activeTab === 'all' ? (
          <AllTasks
            isAddModalOpen={isAddModalOpen}
            isEditModalOpen={isEditModalOpen}
            currentTaskId={currentTaskId}
            setIsAddModalOpen={setIsAddModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
            setCurrentTaskId={setCurrentTaskId}
            noTasks={noTasks}
            refetch={refetch}
            tasks={data}
            pagination={pagination}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            counts={TASKS_COUNT}
          />
        ) : (
          <MyTasks />
        )}
      </Box>
    </>
  );
};

export default Page;