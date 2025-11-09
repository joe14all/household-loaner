import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css';

/**
 * A reusable modal component that renders its children in a portal.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is visible.
 * @param {Function} props.onClose - Function to call when the modal should close.
 * @param {React.ReactNode} props.children - The content to render inside the modal.
 */
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  // Use createPortal to render the modal at the end of the document body
  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        // Stop clicks inside the modal from closing it
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          title="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body // This is the target DOM node
  );
};

export default Modal;