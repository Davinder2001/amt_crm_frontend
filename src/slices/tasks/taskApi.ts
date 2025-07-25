import apiSlice from './taskApiCreateSlice';

export type SubmitTaskResponse = {
  success: boolean;
  reference: number;
  message: string;
};

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // ⬇ Existing task endpoints
    getTasks: builder.query<TasksResponse, { page?: number; per_page?: number }>({
      query: (params) => ({
        url: "tasks",
        params: {
          page: params.page,
          per_page: params.per_page
        }
      }),
      providesTags: ["Task"],
    }),

    createTask: builder.mutation<Task, FormData>({
      query: (newTask) => ({
        url: 'tasks',
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: ['Task'],
    }),

    updateTask: builder.mutation<Task, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `tasks/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Task'],
    }),


    deleteTask: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),

    submitTask: builder.mutation<SubmitTaskResponse, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `tasks/history/${id}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Task'],
    }),

    viewTaskTimeline: builder.query<TasksResponse, string | number>({
      query: (id) => `tasks/history/${id}`, // correct usage — no quotes around {id}
      providesTags: ['Task'],
    }),



    approveHistory: builder.mutation<TasksResponse, { message: string }, number>({
      query: (historyId) => ({
        url: `tasks/${historyId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['Task'],
    }),

    rejectHistory: builder.mutation<{ message: string }, { id: number; remark?: string }>({
      query: ({ id, remark }) => ({
        url: `tasks/${id}/reject`,
        method: 'POST',
        body: remark ? { remark } : {},
      }),
      invalidatesTags: ['Task'],
    }),

    getPendingTasks: builder.query<TasksResponse, void>({
      query: () => 'tasks/pending',
      providesTags: ['Task'],
    }),

    getWorkingTasks: builder.query<TasksResponse, void>({
      query: () => 'tasks/working',
      providesTags: ['Task'],
    }),

    getMyTasks: builder.query<TasksResponse, void>({
      query: () => 'tasks/my-tasks',
      providesTags: ['Task'],
    }),

    markTaskAsWorking: builder.mutation<{ message: string; task: Task }, number>({
      query: (id) => ({
        url: `tasks/${id}/mark-working`,
        method: 'POST',
      }),
      invalidatesTags: ['Task'],
    }),

    // ✅ Predefined Task CRUD
    getPredefinedTasks: builder.query<PredefinedTasksResponse, void>({
      query: () => 'predefined-tasks',
      providesTags: ['Task'],
    }),

    getSinglePredefinedTask: builder.query<PredefinedTask, number>({
      query: (id) => `predefined-tasks/${id}`,
      providesTags: ['Task'],
    }),

    createPredefinedTask: builder.mutation<PredefinedTask, Partial<PredefinedTask>>({
      query: (task) => ({
        url: 'predefined-tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),

    updatePredefinedTask: builder.mutation<PredefinedTask, { id: number; data: Partial<PredefinedTask> }>({
      query: ({ id, data }) => ({
        url: `predefined-tasks/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),

    deletePredefinedTask: builder.mutation<PredefinedTask, number>({
      query: (id) => ({
        url: `predefined-tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),

    endTask: builder.mutation<{ message: string; task: Task }, number>({
      query: (id) => ({
        url: `tasks/${id}/end`,
        method: 'POST',
      }),
      invalidatesTags: ['Task'],
    }),

    // POST: Set reminder
    setReminder: builder.mutation<ReminderResponse, { taskId: number, reminder_at: string }>({
      query: ({ taskId, ...reminder }) => ({
        url: `tasks/${taskId}/set-reminder`,
        method: 'POST',
        body: reminder,
      }),
      invalidatesTags: ['Task'],
    }),

    // GET: View reminder
    viewReminder: builder.query<ReminderResponse, number>({
      query: (taskId) => `tasks/${taskId}/reminder`,
      providesTags: ['Task'],
    }),

    // PUT: Update reminder
    updateReminder: builder.mutation<ReminderResponse, { taskId: number, reminder_at: string }>({
      query: ({ taskId, ...reminder }) => ({
        url: `tasks/${taskId}/update-reminder`,
        method: 'PUT',
        body: reminder,
      }),
      invalidatesTags: ['Task'],
    }),

  }),

});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useSubmitTaskMutation,
  useViewTaskTimelineQuery,
  useApproveHistoryMutation,
  useRejectHistoryMutation,
  useGetPendingTasksQuery,
  useGetWorkingTasksQuery,
  useGetMyTasksQuery,
  useMarkTaskAsWorkingMutation,

  // Predefined task hooks
  useGetPredefinedTasksQuery,
  useGetSinglePredefinedTaskQuery,
  useCreatePredefinedTaskMutation,
  useUpdatePredefinedTaskMutation,
  useDeletePredefinedTaskMutation,
  useEndTaskMutation,

  // reminders
  useSetReminderMutation,
  useViewReminderQuery,
  useUpdateReminderMutation,

} = tasksApi;
