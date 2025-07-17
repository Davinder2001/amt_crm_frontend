
'use client';

import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  width?: string;
  height?: string;
  closeOnOutsideClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = '600px',
  height = 'auto',
  closeOnOutsideClick = true,
}) => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="modal-overlay">
      {/* Overlay */}
      <div
        className="modal-backdrop"
        onClick={closeOnOutsideClick ? onClose : undefined}
      />
      
      {/* Modal container */}
      <div className="modal-container" style={{ width, height }}>
        {/* Modal header */}
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button className="modal-close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        )}
        
        {/* Modal content */}
        <div className="modal-content">
          {children}
        </div>
      </div>

    </div>,
    document.body
  );
};

export default Modal;