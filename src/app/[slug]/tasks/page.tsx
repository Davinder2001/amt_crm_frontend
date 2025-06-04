'use client';
import React, { useEffect, useState } from 'react';
import AllTasks from './components/allTasks';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import MyTasks from './components/myTasks';
import TableToolbar from '@/components/common/TableToolbar';
import { FaPlus, FaRegCalendarAlt, FaUserCheck, FaRedo } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/utils/Company';
import { Tabs, Tab, Box } from '@mui/material';
import { useGetPendingTasksQuery } from '@/slices/tasks/taskApi';

const Page = () => {
  const { setTitle } = useBreadcrumb();
  const router = useRouter();
  const { companySlug } = useCompany();
  const { data } = useGetPendingTasksQuery();
  const [activeTab, setActiveTab] = useState(0);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    setTitle('Tasks Details of Employees');
  }, [setTitle]);

  // Conditionally show tabs based on data length
  const showTabs = (data?.data?.length ?? 0) > 0;

  return (
    <>
      <TableToolbar
        actions={[
          {
            label: 'Task Timeline',
            icon: <FaRegCalendarAlt />,
            onClick: () => router.push(`/${companySlug}/tasks/task-timeline`),
          },
          {
            label: 'Add Task',
            icon: <FaPlus />,
            onClick: () => setIsAddModalOpen(true),
          },
          {
            label: 'Attendance',
            icon: <FaUserCheck />,
            onClick: () => router.push(`/${companySlug}/attendence`),
          },
          {
            label: 'Recurring Tasks',
            icon: <FaRedo />,
            onClick: () => router.push(`/${companySlug}/tasks/recurring-tasks`),
          },
        ]}
      />

      {/* Conditionally render the Tabs component */}
      {showTabs && (
        <Box>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="task tabs"
            variant="scrollable"
            scrollButtons="auto"
            style={{ backgroundColor: '#fff' }}
            sx={{
              '& .MuiTab-root': {
                color: '#384b70',
                '&.Mui-disabled': {
                  color: '#ccc',
                },
                '&.Mui-selected': {
                  color: '#384b70',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#384b70',
              },
            }}
          >
            <Tab label="All Tasks" />
            <Tab label={`My Tasks (${data?.data?.length || 0})`} />
          </Tabs>
        </Box>
      )}

      <Box>
        {/* Conditionally render AllTasks or MyTasks based on the selected tab */}
        {showTabs ? (
          activeTab === 0 ?
            <AllTasks
              isAddModalOpen={isAddModalOpen}
              isEditModalOpen={isEditModalOpen}
              currentTaskId={currentTaskId}
              setIsAddModalOpen={setIsAddModalOpen}
              setIsEditModalOpen={setIsEditModalOpen}
              setCurrentTaskId={setCurrentTaskId}
            /> : <MyTasks />
        ) : (
          // If no data, just render AllTasks by default
          <AllTasks
            isAddModalOpen={isAddModalOpen}
            isEditModalOpen={isEditModalOpen}
            currentTaskId={currentTaskId}
            setIsAddModalOpen={setIsAddModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
            setCurrentTaskId={setCurrentTaskId}
          />
        )}
      </Box>
    </>
  );
};

export default Page;