'use client';
import React, { useState } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  type: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title = 'Confirm',
  message,
  onConfirm,
  onCancel,
  type
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="dialog-overlay">
        <div className="dialog-box">
          <h2 className="dialog-title">{title}</h2>
          <p className="dialog-message">{message}</p>
          <div className="dialog-actions">
            <button className="cancel-btn" onClick={onCancel} disabled={isProcessing}>
              Cancel
            </button>
            <button className="confirm-btn" onClick={handleConfirm} disabled={isProcessing}>
              {isProcessing ? `${type}ing...` : 'Confirm'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dialog-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(7, 16, 1, 0.19);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000000;
        }

        .dialog-box {
          background: #ffffff;
          padding: 24px;
          border-radius: 8px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .dialog-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .dialog-message {
          margin-bottom: 24px;
          font-size: 14px;
          line-height: 1.5;
        }

        .dialog-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .cancel-btn,
        .confirm-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          text-transform: capitalize;
        }

        .cancel-btn {
          background-color: #e0e0e0;
          color: #333;
        }

        .cancel-btn:hover {
          background-color: #d5d5d5;
        }

        .confirm-btn {
          background-color: #d32f2f;
          color: white;
        }

        .confirm-btn:hover {
          background-color: #b71c1c;
        }

        .confirm-btn:disabled,
        .cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default ConfirmDialog;
