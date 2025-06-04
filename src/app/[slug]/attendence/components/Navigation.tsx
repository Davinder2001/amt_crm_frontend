import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface NavigationProps {
    setIsAttandanceOpen: (open: boolean) => void;
    setIsApplyForLeaveOpen: (open: boolean) => void;
}
const Navigation: React.FC<NavigationProps> = ({ setIsAttandanceOpen, setIsApplyForLeaveOpen }) => {

    return (
        <>
            <div className="navigation-buttons">
                <button className="buttons" onClick={() => setIsApplyForLeaveOpen(true)}><FaPlus /><span>Applay for Leave</span></button>
                <button className="buttons" onClick={() => setIsAttandanceOpen(true)}><FaPlus /><span>Add Attendence</span></button>
            </div>
        </>
    );
};

export default Navigation;
