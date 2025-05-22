interface Task {
    assignedTo: string;
    id: number;
    name: string;
    company_name: string;
    assigned_by_name: string;
    assigned_to_name: string;
    deadline: string;
    assigned: string;
    assigned_role: string;
    start_date: string;
    end_date: string;
    status: string;
    description: string;
    company_id: string | number;
    notify: boolean;
    recurrence_type: string;
    recurrence_start_date: string;
    recurrence_end_date: string
    attachment_url: string;
    attachments: Attachment[];
    created_at: string;
    updated_at: string;
    priority: string;
}
interface Attachment {
    url: string;
    name?: string;
    type?: string;
}

interface TaskHistory {
    id: string;
    task_id: string
    status: string;
    description: string;
    attachments: string[];
    created_at: string
}

interface Reminder {
    id: number;
    user_id: number;
    task_id: number;
    reminder_at: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

interface ReminderResponse {
    message: string;
    reminder: Reminder;
}

interface TasksResponse {
    data: Task[];
    histories: TaskHistory[];
}

interface PredefinedTask {
    assigned_to: string;
    notify: boolean;
    id: number;
    name: string;
    description: string;
    recurrence_type: string;
    recurrence_start_date: string;
    recurrence_end_date: string
    attachment_url: string;
    created_at: string;
    updated_at: string;
    // Add more fields if needed
}

interface PredefinedTasksResponse {
    data: PredefinedTask[];
}
