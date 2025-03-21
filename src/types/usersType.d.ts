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