import React from 'react';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>✖</button>
        <h2>Are you sure?</h2>
        <p>Do you really want to delete this restaurant? This action cannot be undone.</p>
        <div className={styles.modalActions}>
          <button className={styles.confirmBtn} onClick={onConfirm}>Yes, Delete</button>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
