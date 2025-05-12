import invoiceCreateApiSlice from "./hrCreateSlice";


interface AttendanceRecord {
    id: number;
    employee_id: number;
    attendance_date: string;
    clock_in: string | null;
    clock_out: string | null;
    status: string;
    employee: Employee;
    created_at?: string;
    updated_at?: string;
}

interface dashboardSummary {
    total_employees: number;
    present_today: AttendanceRecord[];
    absent_today: number;
}

interface DsummaryResponse {
    summary: dashboardSummary;
    early_departures: AttendanceRecord[];
    monthly_leaves: AttendanceRecord[];
    lateArrival: AttendanceRecord[];
}

const hrApi = invoiceCreateApiSlice.injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
        fetchdashboardSummary: builder.query<DsummaryResponse, void>({
            query: () => "hr/dashboard-summary",
            providesTags: ["Hr"],
        }),

    }),
});

export const {
    useFetchdashboardSummaryQuery,
} = hrApi;

export default hrApi;
