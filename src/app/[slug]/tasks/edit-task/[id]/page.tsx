'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetTasksQuery, useUpdateTaskMutation } from '@/slices/tasks/taskApi';
import { useFetchUsersQuery } from '@/slices/users/userApi'; // Import for fetching users
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCompany } from '@/utils/Company';

const EditTask: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { companySlug } = useCompany();

  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useGetTasksQuery();
  const { data: usersData, isLoading: usersLoading, error: usersError } = useFetchUsersQuery();

  const [updateTask, { isLoading: isUpdating, error: updateError }] = useUpdateTaskMutation();

  const [taskData, setTaskData] = useState<Partial<Task>>({
    name: '',
    assigned_to_name: '',
    deadline: '',
  });

  useEffect(() => {
    if (tasks && tasks.data) {
      const taskToEdit = tasks.data.find((t: Task) => t.id === Number(id));
      if (taskToEdit) {
        setTaskData({
          name: taskToEdit.name,
          assigned_to_name: taskToEdit.assigned_to_name,
          deadline: taskToEdit.deadline,
        });
      }
    }
  }, [tasks, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    console.log("Selected user:", newValue);
    setTaskData((prev) => ({
      ...prev,
      assigned_to_name: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedTask = await updateTask({ id: Number(id), ...taskData }).unwrap();
      console.log("Updated Task:", updatedTask);
      setTaskData({
        name: updatedTask.name,
        assigned_to_name: updatedTask.assigned_to_name,
        deadline: updatedTask.deadline,
      });
      toast.success('Task updated successfully');
      router.push(`/${companySlug}/tasks`)
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Error updating task');
    }
  };

  if (tasksLoading || usersLoading) return <p>Loading...</p>;
  if (tasksError) return <p>Error loading task details.</p>;
  if (usersError) return <p>Error loading users.</p>;

  return (
    <>
      <ToastContainer />
      <h1>Edit Task</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Task Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={taskData.name || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="assigned_to_name">Assigned To:</label>
          <select
            id="assigned_to_name"
            name="assigned_to_name"
            value={taskData.assigned_to_name || ''}
            onChange={handleSelectChange}
            required
          >
            <option value="">Select a user</option>
            {usersData?.users.map((user: UserProfile) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="deadline">Deadline:</label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={taskData.deadline || ''}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Task'}
        </button>
        {updateError && <p>Error updating task.</p>}
      </form>
    </>
  );
};

export default EditTask;







// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useGetTasksQuery, useUpdateTaskMutation } from '@/slices/tasks/taskApi';
// import { useFetchUsersQuery } from '@/slices/users/userApi';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useCompany } from '@/utils/Company';

// const EditTask: React.FC = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const { companySlug } = useCompany();

//   const { data: tasks, isLoading: tasksLoading } = useGetTasksQuery();
//   const { data: usersData, isLoading: usersLoading } = useFetchUsersQuery();
//   const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

//   const [formData, setFormData] = useState({
//     name: '',
//     assignedTo: '',
//     role: '',
//     startDate: '',
//     endDate: '',
//     notify: true,
//     description: '',
//   });

//   // Load the task and pre-fill the form
//   useEffect(() => {
//     if (tasks?.data) {
//       const taskToEdit = tasks.data.find((t) => t.id === Number(id));
//       if (taskToEdit) {
//         setFormData({
//           name: taskToEdit.name || '',
//           assignedTo: String(taskToEdit.assignedTo || ''),
//           role: taskToEdit.assigned_role || '',
//           startDate: taskToEdit.start_date || '',
//           endDate: taskToEdit.end_date || '',
//           notify: taskToEdit.notify ?? true,
//           description: taskToEdit.description || '',
//         });
//       }
//     }
//   }, [tasks, id]);

//   // When assigned user changes, update the role
//   useEffect(() => {
//     const selectedUser = usersData?.users.find((user) => String(user.id) === formData.assignedTo);
//     if (selectedUser) {
//       setFormData((prev) => ({
//         ...prev,
//         role: selectedUser.role || '',
//       }));
//     }
//   }, [formData.assignedTo, usersData]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type, checked } = e.target;
//     const fieldValue = type === 'checkbox' ? checked : value;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: fieldValue,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const updatedTask = {
//         id: Number(id),
//         name: formData.name,
//         assigned_to: Number(formData.assignedTo),
//         assigned_role: formData.role,
//         start_date: formData.startDate,
//         end_date: formData.endDate,
//         notify: formData.notify,
//         description: formData.description,
//       };

//       await updateTask(updatedTask).unwrap();
//       toast.success('Task updated successfully');
//       router.push(`/${companySlug}/tasks`);
//     } catch (err) {
//       toast.error('Error updating task');
//       console.error(err);
//     }
//   };

//   if (tasksLoading || usersLoading) return <p>Loading...</p>;

//   return (
//     <>
//       <ToastContainer />
//       <h1>Edit Task</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label htmlFor="name">Task Name:</label>
//           <input
//             id="name"
//             name="name"
//             type="text"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="assignedTo">Assign To:</label>
//           <select
//             id="assignedTo"
//             name="assignedTo"
//             value={formData.assignedTo}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select a user</option>
//             {usersData?.users.map((user) => (
//               <option key={user.id} value={user.id}>
//                 {user.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label htmlFor="role">Role:</label>
//           <input id="role" name="role" value={formData.role} readOnly />
//         </div>
//         <div>
//           <label htmlFor="startDate">Start Date:</label>
//           <input
//             id="startDate"
//             name="startDate"
//             type="date"
//             value={formData.startDate}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label htmlFor="endDate">End Date:</label>
//           <input
//             id="endDate"
//             name="endDate"
//             type="date"
//             value={formData.endDate}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label htmlFor="notify">Notify:</label>
//           <input
//             id="notify"
//             name="notify"
//             type="checkbox"
//             checked={formData.notify}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label htmlFor="description">Description:</label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//           />
//         </div>
//         <button type="submit" disabled={isUpdating}>
//           {isUpdating ? 'Updating...' : 'Update Task'}
//         </button>
//       </form>
//     </>
//   );
// };

// export default EditTask;
