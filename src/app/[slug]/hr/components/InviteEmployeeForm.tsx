import React from 'react';

interface InviteEmployeeFormProps {
  onClose: () => void;
}

const InviteEmployeeForm: React.FC<InviteEmployeeFormProps> = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Invite Employee</h2>
        <p>Enter employee details to send an invitation.</p>
        <input type="email" placeholder="Employee Email" />
        <button>Send Invite</button>
        <button onClick={onClose}>Close</button>
      </div>

      {/* Basic CSS for modal */}
      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        button {
          cursor: pointer;
          padding: 8px 12px;
          border: none;
          background: #007bff;
          color: white;
          border-radius: 4px;
          margin-right: 10px;
        }
        button:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default InviteEmployeeForm;
