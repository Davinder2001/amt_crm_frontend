interface Task {
    id: number;
    name: string;
    company_name: string;
    assigned_by_name: string;
    assigned_to_name: string;
    deadline: string;
}

interface TasksResponse {
    data: Task[];
}