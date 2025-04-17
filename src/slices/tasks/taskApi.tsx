import apiSlice from './taskApiCreateSlice';

export type SubmitTaskResponse = {
  success:   boolean;
  reference: number;
  message:   string;
};

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<TasksResponse, void>({
      query: () => 'tasks',
      providesTags: ['Task'],
    }),

    createTask: builder.mutation<Task, Partial<Task>>({
      query: (newTask) => ({
        url: 'tasks',
        method: 'POST',
        body: newTask,
      }),
      invalidatesTags: ['Task'],
    }),

    updateTask: builder.mutation<Task, Partial<Task> & Pick<Task, 'id'>>({
      query: ({ id, ...taskData }) => ({
        url: `tasks/${id}`,
        method: 'PUT',
        body: taskData,
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

    approveHistory: builder.mutation<{ message: string }, number>({
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
  }),
  overrideExisting: false,
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useSubmitTaskMutation,
  useApproveHistoryMutation,
  useRejectHistoryMutation,
} = tasksApi;
