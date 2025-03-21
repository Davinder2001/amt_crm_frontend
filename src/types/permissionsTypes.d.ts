interface Permission {
    id: number;
    name: string;
}

interface PermissionsResponse {
    permissions: Permission[]; // Ensure the API returns an object with a "permissions" key
}
