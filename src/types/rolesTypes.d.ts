interface Role {
    id: number;
    name: string;
    company_id: string;
    permissions: { id: number; name: string }[];
}