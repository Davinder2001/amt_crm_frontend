
'use client';
import React, { useState } from 'react';
import AllTasks from './components/allTasks';
import MyTasks from './components/myTasks';
import TableToolbar from '@/components/common/TableToolbar';
import { FaPlus, FaUserCheck, FaRedo, FaList, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';
import { Box } from '@mui/material';
import { useGetMyTasksQuery, useGetTasksQuery } from '@/slices';

const Page = () => {
  const router = useRouter();
  const { companySlug } = useCompany();
  const { data } = useGetMyTasksQuery();
  const { data: tasks } = useGetTasksQuery();
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);

  const handleTabChange = (tab: 'all' | 'my') => {
    setActiveTab(tab);
  };

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
            label: `My Tasks (${data?.data?.length || 0})`,
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
          ...(tasks && tasks?.data.length > 0
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
          />
        ) : (
          <MyTasks />
        )}
      </Box>
    </>
  );
};

export default Page;