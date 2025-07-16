'use client';

import React, { useMemo } from 'react';
import { useGetRolesQuery } from '@/slices';
import { toast } from 'react-toastify';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import { FaTriangleExclamation } from 'react-icons/fa6';

interface ViewRoleProps {
    roleId: number;
}

const ViewRole: React.FC<ViewRoleProps> = ({ roleId }) => {
    const { data, isLoading, error } = useGetRolesQuery(undefined);

    const roleData = useMemo(() => {
        return data?.roles?.find((role: Role) => role.id === roleId);
    }, [data, roleId]);

    if (isLoading) return <LoadingState />;

    if (error || !roleData) {
        toast.error('Error fetching role details.');
        return (
            <EmptyState
                icon={<FaTriangleExclamation className='empty-state-icon' />}
                title="Failed to fetching roles details."
                message="Something went wrong while fetching roles details."
            />
        );
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
