import attendanceCreateApiSlice from "./attendanceCreateApiSlice";

interface Attendance {
  id: number;
  user_id: number;
  company_id: number;
  attendance_date: string;
  clock_in: string | null;
  clock_in_image: string | null;
  clock_out: string | null;
  clock_out_image: string | null;
  status: string | null;
  approval_status: string | null;
  created_at: string;
  updated_at: string;
  user: User;
}

interface User {
  id: number;
  name: string;
  email: string;
  number: string;
  uid: string;
}

interface AttendanceResponse {
  attendances: Attendance[];
  attendance: Attendance[];
  User: Attendance[];
}

const attendanceCreateApi = attendanceCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchAttenances: builder.query<AttendanceResponse, void>({
      query: () => 'attendances',
      providesTags: ['Attendance'],
    }),

    recordAttendance: builder.mutation<FormData, { image: File | Blob }>({
      query: (data) => {
        const formData = new FormData();
        formData.append('image', data.image);
        return {
          url: 'attendance',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Attendance'],
    }),

    updateAttendance: builder.mutation<AttendanceResponse, AttendanceRequest>({
      query: (id) => ({
        url: `attendance/${id}`,
        method: 'PUT',
        body: id,
      }),
      invalidatesTags: ['Attendance'],
    }),

    approveAttendance: builder.mutation<AttendanceResponse, number>({
      query: (id) => ({
        url: `attendance/approve/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Attendance'],
    }),

    rejectAttendance: builder.mutation<AttendanceResponse, number>({
      query: (id) => ({
        url: `attendance/reject/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Attendance'],
    }),

    applyForLeave: builder.mutation<AttendanceResponse, void>({
      query: () => ({
        url: 'apply-for-leave',
        method: 'POST',
      }),
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  useFetchAttenancesQuery,
  useRecordAttendanceMutation,
  useUpdateAttendanceMutation,
  useApproveAttendanceMutation,
  useRejectAttendanceMutation,
  useApplyForLeaveMutation,
} = attendanceCreateApi;

export default attendanceCreateApi;
