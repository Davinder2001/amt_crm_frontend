import React from 'react';

interface InviteEmployeeFormProps {
  onClose: () => void;
}

const InviteEmployeeForm: React.FC<InviteEmployeeFormProps> = ({ onClose }) => {
  return (
    <>
    <div className='invite-employees-popup'>
      <p>Enter employee details to send an invitation.</p>
      <input type="email" placeholder="Employee Email" />
      <div className='invites-btn'>
        <button className='buttons'>Send Invite</button>
        <button className="buttons close-btn"onClick={onClose}>Close</button>
      </div>
    </div>
    </>
  );
};

export default InviteEmployeeForm;
