
// Attendance type for individual attendance record
interface Attendance {
    id: string | number;
    user_id: string | number;
    company_id: string | number;
    attendance_date: string;
    clock_in: string | null;
    clock_out: string | null;
    clock_in_image: string | null;
    clock_out_image: string | null;
    status: 'present' | 'absent' | 'late' | 'on_leave';
    created_at: string;
    updated_at: string;
}

// AttendanceResponse type for the array of attendances
interface AttendanceResponse {
    attendances: Attendance[];
}

// AttendanceRequest type for submitting attendance data (e.g., when marking attendance)
interface AttendanceRequest {
    user_id: number | string;
    clock_in_image: string; // Base64 or image URL
    clock_in: string; // In ISO format or timestamp
    status: 'present' | 'absent' | 'late' | 'on_leave';
    clock_out_image?: string; // Optional, for clock-out image
    clock_out?: string; // Optional, for clock-out time
}
