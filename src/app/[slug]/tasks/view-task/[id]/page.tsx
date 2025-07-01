
// 'use client';

// import React, { useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { useBreadcrumb } from '@/provider/BreadcrumbContext';
// import {
//   useGetTasksQuery,
//   useApproveHistoryMutation,
//   useRejectHistoryMutation,
// } from '@/slices/tasks/taskApi';
// import ResponsiveTable from '@/components/common/ResponsiveTable';
// import { toast } from 'react-toastify';
// import { FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
// import Link from 'next/link';
// import { useCompany } from '@/utils/Company';

// // Define the Task type locally since it is not exported from taskApi


// function TaskViewPage() {
//   const { id } = useParams();
//   const { setTitle } = useBreadcrumb();

//   const { data: tasks } = useGetTasksQuery();
//   const [approveHistory, { isLoading: isApproving }] = useApproveHistoryMutation();
//   const [rejectHistory, { isLoading: isRejecting }] = useRejectHistoryMutation();
//   const { companySlug } = useCompany();
//   useEffect(() => {
//     setTitle('View Task');
//   }, [setTitle]);

//   const task = tasks?.data.find((task) => task.id.toString() === id);

//   if (!task) {
//     return <p className="p-4 text-center">No task found with ID: {id}</p>;
//   }

//   const handleApprove = async () => {
//     try {
//       await approveHistory({ message: String(task.id) }).unwrap();
//       toast.success('Task approved successfully');
//     } catch (err) {
//       console.error("Approve Error:", err);
//       toast.error('Error approving task');
//     }
//   };

//   const handleReject = async () => {
//     try {
//       await rejectHistory({ id: task.id }).unwrap();
//       toast.success('Task rejected');
//     } catch (err) {
//       console.error("Reject Error:", err);
//       toast.error('Error rejecting task');
//     }
//   };
//   const columns: {
//     label: string;
//     key?: keyof Task;
//     render?: (t: Task) => React.ReactNode;
//   }[] = [
//       { label: 'Task Name', key: 'name' },
//       { label: 'Description', key: 'description' },
//       { label: 'Assigned By', key: 'assigned_by_name' },
//       { label: 'Assigned To', key: 'assigned_to_name' },
//       { label: 'Assigned Role', key: 'assigned_role' },
//       { label: 'Company Name', key: 'company_name' },
//       {
//         label: 'Start Date',
//         render: (t: Task) => t.start_date?.replace('T', ' ').slice(0, 16),
//       },
//       {
//         label: 'End Date',
//         render: (t: Task) => t.end_date?.replace('T', ' ').slice(0, 16),
//       },
//       {
//         label: 'Status',
//         render: (t: Task) => {
//           const status = t.status?.toLowerCase();
//           const statusColor =
//             status === 'pending'
//               ? 'text-red-600 bg-red-100'
//               : status === 'ended'
//                 ? 'text-green-600 bg-green-100'
//                 : 'text-gray-600 bg-gray-100';

//           return (
//             <span className={`inline-block px-3 py-1 rounded font-semibold text-sm ${statusColor}`}>
//               {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
//             </span>
//           );
//         },
//       },


//       {
//         label: 'Actions',
//         render: () => (
//           <div className="view-task-actions-container">
//             <button
//               onClick={handleApprove}
//               disabled={isApproving}
//             >
//               {isApproving ? (
//                 <span className="loader"></span> // Optional loader spinner
//               ) : (
//                 <FaCheck className='view-task-check-icon' />
//               )}
//             </button>
//             <button
//               onClick={handleReject}
//               disabled={isRejecting}
//             >
//               {isRejecting ? (
//                 <span className="loader"></span> // Optional loader spinner
//               ) : (
//                 <FaTimes className='view-times-check-icon' />
//               )}
//             </button>
//           </div>
//         ),
//       }

//     ];

//   // Since we're showing one row, wrap the task in an array
//   return (
//     <div className="p-4">
//       <Link href={`/${companySlug}/tasks`} className='back-button'>
//         <FaArrowLeft size={20} color='#fff' />
//       </Link>
//       <ResponsiveTable data={[task]} columns={columns} />
//     </div>
//   );
// }

// export default TaskViewPage;







'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import {
  useGetTasksQuery,
  useApproveHistoryMutation,
  useRejectHistoryMutation,
} from '@/slices/tasks/taskApi';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useCompany } from '@/utils/Company';
import Image from 'next/image';

function TaskViewPage() {
  const { id } = useParams();
  const { setTitle } = useBreadcrumb();
  const { companySlug } = useCompany();

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
      await approveHistory({ message: String(task.id) }).unwrap();
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

  const statusColor = {
    pending: 'bg-red-100 text-red-600',
    ended: 'bg-green-100 text-green-600',
    default: 'bg-gray-100 text-gray-600'
  };

  const statusClass = statusColor[task.status?.toLowerCase() as keyof typeof statusColor] || statusColor.default;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href={`/${companySlug}/tasks`} className="inline-flex items-center mb-4 text-blue-600 hover:underline">
        <FaArrowLeft className="mr-2" /> Back to Tasks
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><strong>Task Name:</strong> <p>{task.name}</p></div>
          <div><strong>Description:</strong> <p>{task.description}</p></div>
          <div><strong>Assigned By:</strong> <p>{task.assigned_by_name}</p></div>
          <div><strong>Assigned To:</strong> <p>{task.assigned_to_name}</p></div>
          <div><strong>Assigned Role:</strong> <p>{task.assigned_role}</p></div>
          <div><strong>Company Name:</strong> <p>{task.company_name}</p></div>
          <div><strong>Start Date:</strong> <p>{task.start_date?.replace('T', ' ').slice(0, 16)}</p></div>
          <div><strong>End Date:</strong> <p>{task.end_date?.replace('T', ' ').slice(0, 16)}</p></div>
          <div className="col-span-2">
            <strong>Status:</strong>
            <span className={`inline-block ml-2 px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>
              {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isApproving ? <span className="loader" /> : <><FaCheck className="inline mr-1" /> Approve</>}
          </button>
          <button
            onClick={handleReject}
            disabled={isRejecting}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isRejecting ? <span className="loader" /> : <><FaTimes className="inline mr-1" /> Reject</>}
          </button>
        </div>

        {/* Attachments Images */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Attachments</h3>
          {Array.isArray(task.attachment_url) && task.attachment_url.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {task.attachment_url.map((url: string, index: number) => (
                <Image
                  key={index}
                  src={url}
                  width={100}
                  height={100}
                  alt={`Attachments ${index + 1}`}
                  className="w-full h-48 object-cover rounded shadow border"
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No attachments available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskViewPage;
