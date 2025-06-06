'use client';

import React, { useMemo } from 'react';
import { useGetRolesQuery } from '@/slices/roles/rolesApi';
import Loader from '@/components/common/Loader';
import { toast } from 'react-toastify';

interface ViewRoleProps {
    roleId: number;
}

const ViewRole: React.FC<ViewRoleProps> = ({ roleId }) => {
    const { data, isLoading, error } = useGetRolesQuery(undefined);

    const roleData = useMemo(() => {
        return data?.roles?.find((role: Role) => role.id === roleId);
    }, [data, roleId]);

    if (isLoading) return <Loader />;

    if (error || !roleData) {
        toast.error('Error fetching role details.');
        return <div>Error loading role details.</div>;
    }

    return (
        <div className="view-role-details">
            <div className="view-role-field">
                <strong>Role Name:</strong>
                <span>{roleData.name}</span>
            </div>

            <div className="view-role-field">
                <strong>Company ID:</strong>
                <span>{roleData.company_id || 'N/A'}</span>
            </div>

            <div className="view-role-field">
                <strong>Permissions Count:</strong>
                <span>{roleData.permissions_count ?? 'N/A'}</span>
            </div>
        </div>
    );
};

export default ViewRole;
