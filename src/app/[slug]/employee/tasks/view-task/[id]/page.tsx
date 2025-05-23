// 'use client'
// import { useBreadcrumb } from '@/provider/BreadcrumbContext';
// import { useGetTasksQuery, useApproveHistoryMutation, useRejectHistoryMutation } from '@/slices/tasks/taskApi';
// import { useParams } from 'next/navigation';
// import React, { useEffect } from 'react';

// function Page() {
//   const { id } = useParams(); // Dynamic route param
//   const { setTitle } = useBreadcrumb();

//   // Fetch tasks and approval/reject mutations
//   const { data: tasks } = useGetTasksQuery();
//   const [approveHistory, { isLoading: isApproving }] = useApproveHistoryMutation();
//   const [rejectHistory, { isLoading: isRejecting }] = useRejectHistoryMutation();

//   useEffect(() => {
//     setTitle(`View Task`);
//   }, [setTitle]);

//   // Find the task by ID
//   const task = tasks?.data.find((task) => task.id.toString() === id);

//   if (!task) {
//     return <div>No task found with ID: {id}</div>;
//   }

//   const handleApprove = async () => {
//     try {
//       await approveHistory(task.id).unwrap();
//       alert('Task approved successfully');
//       // optionally refetch or navigate back
//     } catch (err) {
//       console.error("Approve Error:", err);
//       alert('Error approving task');
//     }
//   };

//   const handleReject = async () => {
//     try {
//       await rejectHistory({ id: task.id }).unwrap();
//       alert('Task rejected');
//     } catch (err) {
//       console.error("Reject Error:", err);
//       alert('Error rejecting task');
//     }
//   };

//   return (
//     <div className="view-task-container">
//       <h2 className="task-heading">Task Details</h2>
//       <div className="task-details">
//         <p><strong>Task Name:</strong> {task.name}</p>
//         <p><strong>Description:</strong> {task.description || 'N/A'}</p>
//         <p><strong>Assigned By:</strong> {task.assigned_by_name}</p>
//         <p><strong>Assigned To:</strong> {task.assigned_to_name}</p>
//         <p><strong>Assigned Role:</strong> {task.assigned_role}</p>
//         <p><strong>Company ID:</strong> {task.company_id}</p>
//         <p><strong>Company Name:</strong> {task.company_name || 'N/A'}</p>
//         <p><strong>Start Date:</strong> {task.start_date?.replace('T', ' ').slice(0, 16)}</p>
//         <p><strong>End Date:</strong> {task.end_date?.replace('T', ' ').slice(0, 16)}</p>
//         {/* New Status Field */}
//         <p><strong>Status:</strong> {task.status}</p>

//         {/* Approve and Reject Buttons */}
//         <div className="mt-4 flex gap-2">
//           <button
//             onClick={handleApprove}
//             disabled={isApproving}
//             className="px-4 py-2 rounded bg-green-500 text-white"
//           >
//             {isApproving ? 'Approving...' : 'Approve'}
//           </button>
//           <button
//             onClick={handleReject}
//             disabled={isRejecting}
//             className="px-4 py-2 rounded bg-red-500 text-white"
//           >
//             {isRejecting ? 'Rejecting...' : 'Reject'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Page;








'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import {
  useGetTasksQuery,
  useApproveHistoryMutation,
  useRejectHistoryMutation,
} from '@/slices/tasks/taskApi';
import ResponsiveTable from '@/components/common/ResponsiveTable';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from 'react-icons/fa';

// Define the Task type locally since it is not exported from taskApi
type Task = {
  id: number | string;
  name: string;
  description: string;
  assigned_by_name?: string;
  assigned_to_name?: string;
  assigned_role?: string;
  company_id?: number | string;
  company_name?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  // Add other fields as needed based on your API response
};

function TaskViewPage() {
  const { id } = useParams();
  const { setTitle } = useBreadcrumb();

  const { data: tasks } = useGetTasksQuery();
  const [approveHistory, { isLoading: isApproving }] = useApproveHistoryMutation();
  const [rejectHistory, { isLoading: isRejecting }] = useRejectHistoryMutation();

  useEffect(() => {
    setTitle('View Task');
  }, [setTitle]);

  const task = tasks?.data.find((task) => task.id.toString() === id);

  if (!task) {
    return <p className="p-4 text-center">No task found with ID: {id}</p>;
  }

  const handleApprove = async () => {
    try {
      await approveHistory(task.id).unwrap();
      toast.success('Task approved successfully');
    } catch (err) {
      console.error("Approve Error:", err);
      toast.error('Error approving task');
    }
  };

  const handleReject = async () => {
    try {
      await rejectHistory({ id: task.id }).unwrap();
      toast.success('Task rejected');
    } catch (err) {
      console.error("Reject Error:", err);
      toast.error('Error rejecting task');
    }
  };

  const columns: {
    label: string;
    key?: keyof Task;
    render?: (t: Task) => React.ReactNode;
  }[] = [
      { label: 'Task Name', key: 'name' },
      { label: 'Description', key: 'description' },
      { label: 'Assigned By', key: 'assigned_by_name' },
      { label: 'Assigned To', key: 'assigned_to_name' },
      { label: 'Assigned Role', key: 'assigned_role' },
      { label: 'Company ID', key: 'company_id' },
      { label: 'Company Name', key: 'company_name' },
      {
        label: 'Start Date',
        render: (t: Task) => t.start_date?.replace('T', ' ').slice(0, 16),
      },
      {
        label: 'End Date',
        render: (t: Task) => t.end_date?.replace('T', ' ').slice(0, 16),
      },
      {
        label: 'Status',
        render: (t: Task) => {
          const status = t.status?.toLowerCase();
          const statusColor =
            status === 'pending'
              ? 'text-red-600 bg-red-100'
              : status === 'ended'
                ? 'text-green-600 bg-green-100'
                : 'text-gray-600 bg-gray-100';

          return (
            <span className={`inline-block px-3 py-1 rounded font-semibold text-sm ${statusColor}`}>
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
            </span>
          );
        },
      },


      {
        label: 'Actions',
        render: () => (
          <div className="view-task-actions-container">
            <button
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? (
                <span className="loader"></span> // Optional loader spinner
              ) : (
                <FaCheck className='view-task-check-icon' />
              )}
            </button>
            <button
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? (
                <span className="loader"></span> // Optional loader spinner
              ) : (
                <FaTimes className='view-times-check-icon' />
              )}
            </button>
          </div>
        ),
      }

    ];

  // Since we're showing one row, wrap the task in an array
  return (
    <div className="p-4">
      <ResponsiveTable data={[task]} columns={columns} />
    </div>
  );
}

export default TaskViewPage;
