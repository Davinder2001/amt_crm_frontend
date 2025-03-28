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
    created_at: string;
    updated_at: string;
  }

  interface AttendanceResponse {
    attendances: Attendance[]; 
    attendance: Attendance[]; 
  }

const attendanceCreateApi = attendanceCreateApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
        fetchAttenances: builder.query<AttendanceResponse, void>({
            query: () => 'attendances',
            providesTags: ['Attendance'],
        }),

        recordAttendance: builder.mutation<AttendanceResponse, AttendanceRequest>({
            query: (id) => ({
                url: 'attendance',
                method: 'POST',
                body: id,
            }),
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
    }),
});

export const {
    useFetchAttenancesQuery,
    useRecordAttendanceMutation,
    useUpdateAttendanceMutation,
    useApproveAttendanceMutation,
    useRejectAttendanceMutation,
} = attendanceCreateApi;

export default attendanceCreateApi;
