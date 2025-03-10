import apiSlice from './taskApiCreateSlice';

export interface Task {
  id: number;
  name: string;
  company_name:string;
  assigned_by_name: string;
  assigned_to_name: string;
  deadline: string;
}

export interface TasksResponse {
  data: Task[];
}

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
  }),
  overrideExisting: false,
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
