// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useGetTasksQuery, useUpdateTaskMutation } from '@/slices/tasks/taskApi';
// import { useFetchUsersQuery } from '@/slices/users/userApi';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useCompany } from '@/utils/Company';
// import { useBreadcrumb } from '@/provider/BreadcrumbContext';


// const EditTask: React.FC = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const { companySlug } = useCompany();

//   const { data: tasks, isLoading: tasksLoading } = useGetTasksQuery();
//   const { data: usersData, isLoading: usersLoading } = useFetchUsersQuery();
//   const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
//   const { setTitle } = useBreadcrumb();

//   const [formData, setFormData] = useState({
//     name: '',
//     assignedTo: '',
//     role: '',
//     startDate: '',
//     endDate: '',
//     notify: true,
//     description: '',
//   });

//   useEffect(() => {
//     setTitle('Edit Task');
//   }, [setTitle]);


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
//         role: Array.isArray(selectedUser.roles) ? String(selectedUser.roles[0] || '') : String(selectedUser.roles || ''),
//       }));
//     }
//   }, [formData.assignedTo, usersData]);


//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
//     const fieldValue = type === 'checkbox' && e.target instanceof HTMLInputElement ? e.target.checked : value;
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
//       <form onSubmit={handleSubmit} className='task-form'>
//         <div className='add-task-form'>
//           <div className='form-group'>
//             <label htmlFor="name">Task Name:</label>
//             <input
//               id="name"
//               name="name"
//               type="text"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className='form-group'>
//             <label htmlFor="assignedTo">Assign To:</label>
//             <select
//               id="assignedTo"
//               name="assignedTo"
//               value={formData.assignedTo}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select a user</option>
//               {usersData?.users.map((user) => (
//                 <option key={user.id} value={user.id}>
//                   {user.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className='form-group'>
//             <label htmlFor="role">Role:</label>
//             <input id="role" name="role" value={formData.role} readOnly />

//           </div>
//           <div className='form-group'>
//             <label htmlFor="description">Description:</label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//             />
//           </div>
//           <div className='form-group'>
//             <label htmlFor="notify">Notification:</label>

//             <button
//               type="button"
//               onClick={() =>
//                 setFormData((prev) => ({ ...prev, notify: !prev.notify }))
//               }
//               className={`toggle-button buttons ${formData.notify ? 'on' : 'off'}`}
//             >
//               {formData.notify ? 'ON 🔔' : 'OFF 🔕'}
//             </button>
//           </div>

//         </div>
//         <div className='update-outer'>
//           <button type="submit" disabled={isUpdating} className='buttons'>
//             {isUpdating ? 'Updating...' : 'Update Task'}
//           </button>
//         </div>
//       </form>
//     </>
//   );
// };

// export default EditTask;














'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetTasksQuery, useUpdateTaskMutation } from '@/slices/tasks/taskApi';
import { useFetchUsersQuery } from '@/slices/users/userApi';
import { useFetchNotificationsQuery } from '@/slices/notifications/notifications';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCompany } from '@/utils/Company';
import { useBreadcrumb } from '@/provider/BreadcrumbContext';
import { FaArrowLeft } from 'react-icons/fa';

const EditTask: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { companySlug } = useCompany();

  const { data: tasks, isLoading: tasksLoading } = useGetTasksQuery();
  const { data: usersData, isLoading: usersLoading } = useFetchUsersQuery();
  const { refetch: refetchNotifications } = useFetchNotificationsQuery();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const { setTitle } = useBreadcrumb();

  const [formData, setFormData] = useState({
    name: '',
    assignedTo: '',
    role: '',
    startDate: '',
    endDate: '',
    notify: true,
    description: '',
  });

  useEffect(() => {
    setTitle('Edit Task');
  }, [setTitle]);

  useEffect(() => {
    if (tasks?.data) {
      const taskToEdit = tasks.data.find((t) => t.id === Number(id));
      if (taskToEdit) {
        const convertToDatetimeLocal = (dateStr: string) => {
          const [day, month, year] = dateStr.split('-');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00`;
        };

        setFormData({
          name: taskToEdit.name || '',
          assignedTo: String(taskToEdit.assigned_to_id || ''),
          role: taskToEdit.assigned_role || '',
          startDate: taskToEdit.start_date ? convertToDatetimeLocal(taskToEdit.start_date) : '',
          endDate: taskToEdit.end_date ? convertToDatetimeLocal(taskToEdit.end_date) : '',
          notify: taskToEdit.notify ?? true,
          description: taskToEdit.description || '',
        });
      }
    }
  }, [tasks, id]);


  useEffect(() => {
    const selectedUser = usersData?.users.find((user) => String(user.id) === formData.assignedTo);
    if (selectedUser) {
      const roleName = Array.isArray(selectedUser.roles) && selectedUser.roles[0]?.name
        ? selectedUser.roles[0].name
        : String(selectedUser.roles || '');
      setFormData((prev) => ({
        ...prev,
        role: roleName,
      }));
    }
  }, [formData.assignedTo, usersData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedTask = {
        id: Number(id),
        name: formData.name,
        assigned_to: String(formData.assignedTo),
        assigned_role: formData.role,
        start_date: formData.startDate,
        end_date: formData.endDate,
        notify: formData.notify,
        description: formData.description,
      };

      await updateTask(updatedTask).unwrap();
      toast.success('Task updated successfully');
      refetchNotifications();
      router.push(`/${companySlug}/employee/tasks`);
    } catch (err) {
      toast.error('Error updating task');
      console.error(err);
    }
  };

  if (tasksLoading || usersLoading) return <p>Loading...</p>;

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="task-form">
        <button type="button" onClick={() => router.back()} className="back-button">
          <FaArrowLeft size={20} color="#fff" />
        </button>

        <div className="add-task-form">
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Assign Task To</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
            >
              <option value="">Select a user</option>
              {usersData?.users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Assign Task to Role</label>
            <input type="text" value={formData.role} readOnly />
          </div>

          <div className="form-group">
            <label>Start Timing</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Timing</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="datetime-local-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Write description for the task"
            />
          </div>

          <div className="form-group">
            <label>Notification</label>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, notify: !prev.notify }))}
              className={`toggle-button buttons ${formData.notify ? 'on' : 'off'}`}
            >
              {formData.notify ? 'ON 🔔' : 'OFF 🔕'}
            </button>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => router.back()} className="cancel-button buttons">
              Cancel
            </button>
            <button type="submit" disabled={isUpdating} className="save-button buttons">
              {isUpdating ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditTask;
