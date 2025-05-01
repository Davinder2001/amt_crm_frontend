interface Role {
    id: number;
    name: string;
}

interface FetchUser {
    id: number;
    name: string;
    email: string;
    company_id: number;
    company_slug: string;
    roles: Role[];
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface CreateUserRequest {
    name: string;
    email: string;
    role: string;
    password: string;
}

interface UsersResponse {
    users: FetchUser[];
}


interface NotificationData {
    title: string;
    message: string;
};

interface Notification {
    id: string | number;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
};
interface NotificationResponse {
    notifications: Notification[];
}
interface MarkNotificationResponse {
    success: boolean;
    message: string;
}




interface Role {
    company_id: string;
}

interface Admin {
    companies: Company[];
    created_at: string | number | Date;
    id: number | string;
    uid: string;
    name: string;
    email: string;
    number: string;
    roles: Role[];
    email_verified_at: string | null;
    user_status: string;
}

interface AdminResponse {
    admins: Admin[];
}

interface UpdateStatusResponse {
    success: boolean;
    message: string;
}