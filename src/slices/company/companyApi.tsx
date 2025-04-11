import companyCreateSlice from "./companyCreateSlice";

type Shift = {
  id: number;
  company_id: number;
  shift_name: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
};

type ShiftApiResponse = {
  message: string;
  data: Shift[];
};

type CreateShiftPayload = {
  shift_name: string;
  start_time: string;
  end_time: string;
};

type UpdateShiftPayload = {
  id: number;
  shift_name?: string;
  start_time?: string;
  end_time?: string;
};

const companyApi = companyCreateSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchCompanyShifts: builder.query<ShiftApiResponse, void>({
      query: () => ({
        url: "shifts",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Company"],
    }),

    createShift: builder.mutation<{ message: string; data: Shift }, CreateShiftPayload>({
      query: (payload) => ({
        url: "shifts",
        method: "POST",
        body: payload,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),

    updateShift: builder.mutation<{ message: string; data: Shift }, UpdateShiftPayload>({
      query: ({ id, ...body }) => ({
        url: `shifts/${id}`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Company"],
    }),
  }),
});

export const {
  useFetchCompanyShiftsQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
} = companyApi;

export default companyApi;
