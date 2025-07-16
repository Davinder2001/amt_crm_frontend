import { useCompany } from '@/utils/Company';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaCalendarPlus, FaUserCheck, FaClipboardList } from 'react-icons/fa';

interface NavigationProps {
    setIsAttandanceOpen: (open: boolean) => void;
    setIsApplyForLeaveOpen: (open: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ setIsAttandanceOpen, setIsApplyForLeaveOpen }) => {
    const { companySlug } = useCompany();
    const router = useRouter();

    return (
        <>
            <div className="navigation-buttons">
                <button className="buttons" onClick={() => setIsApplyForLeaveOpen(true)} type='button'>
                    <FaCalendarPlus />
                    <span>Apply for Leave</span>
                </button>

                <button className="buttons" onClick={() => setIsAttandanceOpen(true)} type='button' >
                    <FaUserCheck />
                    <span>Add Attendance</span>
                </button>

                <button className="buttons" onClick={() => router.push(`/${companySlug}/employee/leaves`)} type='button'>
                    <FaClipboardList />
                    <span>Leaves</span>
                </button>
            </div>
        </>
    );
};
export default Navigation;
