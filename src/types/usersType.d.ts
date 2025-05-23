interface Role {
    id: number;
    name: string;
    company_id: string;
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

interface Admin {
    company_id: string;
    user_type: ReactNode;
    profile_image: string | StaticImport;
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