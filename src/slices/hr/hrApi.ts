import invoiceCreateApiSlice from "./hrCreateSlice";

interface Employee {
    id: number;
    name: string;
    // Add other employee fields if needed
}

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
    late_arrival: AttendanceRecord[];
    early_departures: AttendanceRecord[];
    time_off_today: AttendanceRecord[];
    new_employees_this_month: number;
}

interface DsummaryResponse {
    summary: dashboardSummary;
    summary_message: string;
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
