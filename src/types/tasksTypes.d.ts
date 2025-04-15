interface Task {
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
    attachment_url: string;
    created_at: string;
    updated_at: string;
}

interface TasksResponse {
    data: Task[];
}