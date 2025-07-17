import attendanceCreateApiSlice from "./attendanceCreateSlice";

interface User {
  id: number;
  name: string;
  email: string;
  number: string;
  uid: string;
}

export interface Attendance {
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

export interface LeaveBalanceResponse {
  leaves: {
    leave_type: string;
    leave_id: number;
    frequency: string;
    total_allowed: number;
    used: number;
    remaining: number;
  }[];
}


interface AttendanceResponse {
  attendances: Attendance[];   // For lists
  attendance: Attendance;      // For single item (e.g. detail/edit)
}

export interface AttendanceRequest {
  id: number;
  attendance_date?: string;
  clock_in?: string;
  clock_out?: string;
  status?: string;
  approval_status?: string;
  // Add any fields that may be updated
}

const attendanceCreateApi = attendanceCreateApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchAttenances: builder.query<AttendanceResponse, void>({
      query: () => "attendances",
      providesTags: ["Attendance"],
    }),

    fetchMyAttenances: builder.query<AttendanceResponse, void>({
      query: () => "attendance/my",
      providesTags: ["Attendance"],
    }),

    fetchBalanceLeave: builder.query<LeaveBalanceResponse, void>({
      query: () => "attendance/balance-leave",
      providesTags: ["Attendance"],
    }),

    recordAttendance: builder.mutation<Attendance, { image: File | Blob }>({
      query: (data) => {
        const formData = new FormData();
        formData.append("image", data.image);
        return {
          url: "attendance",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Attendance"],
    }),

    updateAttendance: builder.mutation<Attendance, AttendanceRequest>({
      query: (payload) => ({
        url: `attendance/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Attendance"],
    }),

    approveAttendance: builder.mutation<Attendance, number>({
      query: (id) => ({
        url: `attendance/approve/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Attendance"],
    }),

    rejectAttendance: builder.mutation<Attendance, number>({
      query: (id) => ({
        url: `attendance/reject/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Attendance"],
    }),

    applyForLeave: builder.mutation<AttendanceResponse, { dates: string[], subject: string, description: string }>
({
      query: (data) => ({
        url: "apply-for-leave",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attendance"],
    }),
  }),
});

export const {
  useFetchAttenancesQuery,
  useFetchMyAttenancesQuery,
  useFetchBalanceLeaveQuery,
  useRecordAttendanceMutation,
  useUpdateAttendanceMutation,
  useApproveAttendanceMutation,
  useRejectAttendanceMutation,
  useApplyForLeaveMutation,
} = attendanceCreateApi;

export default attendanceCreateApi;
