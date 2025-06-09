import React from 'react';

interface InviteEmployeeFormProps {
  onClose: () => void;
}

const InviteEmployeeForm: React.FC<InviteEmployeeFormProps> = ({ onClose }) => {
  return (
    <>
      <p>Enter employee details to send an invitation.</p>
      <input type="email" placeholder="Employee Email" />
      <button>Send Invite</button>
      <button onClick={onClose}>Close</button>
    </>
  );
};

export default InviteEmployeeForm;
