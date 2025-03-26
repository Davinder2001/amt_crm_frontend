// src/slices/attendance/attendance.ts
import attendanceCreateApiSlice from "./attendanceCreateApiSlice";


const attendanceCreateApi = attendanceCreateApiSlice.injectEndpoints({

    endpoints: (builder) => ({

        // Fetch all attendances
        fetchAttenances: builder.query<AttendanceResponse, void>({
            query: () => 'attendances',
            providesTags: ['Attendance'],
        }),

        // Add an attendance record (clock-in)
        recordAttendance: builder.mutation<AttendanceResponse, AttendanceRequest>({
            query: (id) => ({
                url: 'attendance',
                method: 'POST',
                body: id,
            }),
            invalidatesTags: ['Attendance'],
        }),

        // Update attendance record (clock-out)
        updateAttendance: builder.mutation<AttendanceResponse, AttendanceRequest>({
            query: (id) => ({
                url: `attendance/${id}`,
                method: 'PUT',
                body: id,
            }),
            invalidatesTags: ['Attendance'],
        }),
    }),
});

export const {
    useFetchAttenancesQuery,
    useRecordAttendanceMutation,
    useUpdateAttendanceMutation
} = attendanceCreateApi;

export default attendanceCreateApi;
